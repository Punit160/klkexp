import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ─── Helper ───────────────────────────────────────────────────────────────────

const getCurrentFYYear = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear(); 
    const fyStartYear = month >= 4 ? year : year - 1;
    return `${fyStartYear}-${fyStartYear + 1}`;
};

const isValidFYYear = (fy) => /^\d{4}-\d{4}$/.test(fy);

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const Dashboard = async (req, res) => {
    try {
        const company_id = req.user.company_id;
        const user_id = req.user.id;

        // ✅ Validate fy_year input to prevent SQL injection
        const rawFY = req.query.fy_year;
        const fyYear = (rawFY && isValidFYYear(rawFY)) ? rawFY : getCurrentFYYear();

        // ─── 1. Status Summary (groupBy) ──────────────────────────────────────
        const data = await prisma.expensePayment.groupBy({
            by: ['approval_status', 'payment_status'],
            where: {
                company_id,
                requested_by: user_id,
                financial_year: fyYear
            },
            _sum: { amount: true }
        });

        let totalExpense = 0;
        let paidAmount = 0;
        let pendingAmount = 0;
        let rejectedAmount = 0;
        let approvedAmount = 0;

        for (const item of data) {
            const amount = Number(item._sum.amount) || 0;

            // ✅ Use strict equality (===) — Prisma returns typed values
            if (item.payment_status === 1) paidAmount += amount;
            if (item.approval_status === 0) pendingAmount += amount;
            if (item.approval_status === 2) rejectedAmount += amount;
            if (item.approval_status === 1 && item.payment_status === 0) approvedAmount += amount;

            // ✅ Fix: exclude rejected amounts from totalExpense
            if (item.approval_status !== 2) totalExpense += amount;
        }

        // ─── 2. Year-wise Paid (All FYs — for chart) ─────────────────────────
        // ✅ Removed fy_sort — use financial_year string sort (format "YYYY-YYYY" sorts correctly)
        const yearlyPaidData = await prisma.$queryRaw`
            SELECT 
                financial_year AS fy_year,
                SUM(amount)    AS totalPaid
            FROM expensepayment
            WHERE company_id   = ${company_id}
              AND requested_by = ${user_id}
              AND payment_status = 1
            GROUP BY financial_year
            ORDER BY financial_year ASC
        `;

        // ─── 3. Project-wise Summary ──────────────────────────────────────────
        
        const projectWiseData = await prisma.$queryRaw`
            SELECT 
                p.id   AS project_id,
                p.name AS project_name,
                SUM(ep.amount)                                                                            AS totalAmount,
                SUM(CASE WHEN ep.payment_status  = 1                          THEN ep.amount ELSE 0 END) AS totalPaid,
                SUM(CASE WHEN ep.approval_status = 0                          THEN ep.amount ELSE 0 END) AS pendingAmount,
                SUM(CASE WHEN ep.approval_status = 2                          THEN ep.amount ELSE 0 END) AS rejectedAmount,
                SUM(CASE WHEN ep.approval_status = 1 AND ep.payment_status = 0 THEN ep.amount ELSE 0 END) AS approvedAmount
            FROM expensepayment ep
            LEFT JOIN project p ON p.id = ep.project_name
            WHERE ep.company_id    = ${company_id}
              AND ep.requested_by  = ${user_id}
              AND ep.financial_year = ${fyYear}
            GROUP BY p.id, p.name
        `;
        // ─── 4. Latest 5 Expenses ─────────────────────────────────────────────
        const AllExpenseData = await prisma.$queryRaw`
            SELECT 
                ep.*,
                p.name AS project_name
            FROM expensepayment ep
            LEFT JOIN project p ON ep.project_name = p.id
            WHERE ep.company_id    = ${company_id}
              AND ep.requested_by  = ${user_id}
              AND ep.financial_year = ${fyYear}
            ORDER BY ep.id DESC
            LIMIT 5
        `;

        // ─── 5. FY Dropdown List ──────────────────────────────────────────────
        // ✅ Added ORDER BY for consistent dropdown ordering
        const availableFYList = await prisma.$queryRaw`
            SELECT DISTINCT
                financial_year AS fy_year
            FROM expensepayment
            WHERE company_id   = ${company_id}
              AND requested_by = ${user_id}
            ORDER BY financial_year ASC
        `;
        // ─── 6. Intervention-wise Summary ────────────────────────────────────────────
           
        const interventionWiseData = await prisma.$queryRaw`
            SELECT 
                i.id              AS intervention_id,
                i.name    AS intervention_name,
                SUM(ep.amount)                                                                             AS totalAmount,
                SUM(CASE WHEN ep.payment_status  = 1                           THEN ep.amount ELSE 0 END) AS totalPaid,
                SUM(CASE WHEN ep.approval_status = 0                          THEN ep.amount ELSE 0 END) AS pendingAmount,
                SUM(CASE WHEN ep.approval_status = 2                          THEN ep.amount ELSE 0 END) AS rejectedAmount,
                SUM(CASE WHEN ep.approval_status = 1 AND ep.payment_status = 0 THEN ep.amount ELSE 0 END) AS approvedAmount
            FROM expensepayment ep
            LEFT JOIN intervention i ON i.id = ep.intervention
            WHERE ep.company_id    = ${company_id}
              AND ep.requested_by  = ${user_id}
              AND ep.financial_year = ${fyYear}
            GROUP BY i.id, i.name
        `;  


        // ─── Response ─────────────────────────────────────────────────────────
        return res.status(200).json({
            success: true,
            data: {
                activeFY: fyYear,
                availableFYList,
                totalExpense,
                paidAmount,
                pendingAmount,
                rejectedAmount,
                approvedAmount,
                yearlyPaidData,
                projectWiseData,
                AllExpenseData,
                interventionWiseData
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Dashboard fetch failed",
            error: error.message
        });
    }
};