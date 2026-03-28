import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Dashboard = async (req, res) => {
    try {
        const company_id = req.user.company_id;
        const user_id = req.user.id;
        const data = await prisma.expensePayment.groupBy({
            by: ['approval_status', 'payment_status'],
            where: {
                company_id,
                requested_by: user_id
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

            totalExpense += amount;

            if (item.payment_status == 1) {
                paidAmount += amount;
            }

            if (item.approval_status == 0) {
                pendingAmount += amount;
            }

            if (item.approval_status == 2) {
                rejectedAmount += amount;
            }

            if (item.approval_status == 1 && item.payment_status == 0) {
                approvedAmount += amount;
            }
        }

        //   Year-wise Paid Data (CORRECT)
        const yearlyPaidData = await prisma.$queryRaw`
            SELECT 
                YEAR(created_at) as year,
                SUM(amount) as totalPaid
            FROM expensepayment
            WHERE company_id = ${company_id}
              AND requested_by = ${user_id}
              AND payment_status = 1
            GROUP BY YEAR(created_at)
            ORDER BY year ASC
        `;

        const projectWiseData = await prisma.$queryRaw`
    SELECT 
        p.id AS project_name,
        p.name AS project_name,

        SUM(ep.amount) AS totalAmount,

        SUM(CASE WHEN ep.payment_status = 1 THEN ep.amount ELSE 0 END) AS totalPaid,

        SUM(CASE WHEN ep.approval_status = 0 THEN ep.amount ELSE 0 END) AS pendingAmount,

        SUM(CASE WHEN ep.approval_status = 2 THEN ep.amount ELSE 0 END) AS rejectedAmount,

        SUM(CASE WHEN ep.approval_status = 1 AND ep.payment_status = 0 THEN ep.amount ELSE 0 END) AS approvedAmount

    FROM expensePayment ep
    LEFT JOIN project p ON p.id = ep.project_name

    WHERE ep.company_id = ${company_id}
      AND ep.requested_by = ${user_id}

    GROUP BY p.id, p.name
`;

const AllExpenseData = await prisma.$queryRaw`
    SELECT 
        ep.*,
        p.name AS project_name
    FROM expensepayment ep
    LEFT JOIN project p ON ep.project_name = p.id
    WHERE ep.company_id = ${company_id}
      AND ep.requested_by = ${user_id}
    ORDER BY ep.id DESC
    LIMIT 5
`;

        return res.status(200).json({
            success: true,
            data: {
                totalExpense,
                paidAmount,
                pendingAmount,
                rejectedAmount,
                approvedAmount,
                yearlyPaidData,
                projectWiseData,
                AllExpenseData
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