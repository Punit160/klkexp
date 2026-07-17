import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();
export const PaidExpenseUsers = async (req, res) => {
    try {
        const company_id = req.user.company_id;
        const paidUsers = await prisma.$queryRaw`
   SELECT
    req.id,
    req.username AS name,
    req.email
    FROM ExpensePayment ep
    JOIN User req ON req.id = ep.requested_by
    WHERE ep.company_id = ${company_id}
    AND ep.payment_status = 2
    GROUP BY req.id, req.username, req.email
    ORDER BY req.username ASC
`;

        return res.status(200).json({ success: true, data: users, });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Paid Expense Report fetch failed",
            error: error.message,
        });
    }
};
export const PaidExpenseUserReport = async (req, res) => {
    try {
        const company_id = req.user.company_id;
        const user_id = Number(req.query.user_id);

        if (!user_id || isNaN(user_id)) {
            return res.status(400).json({
                success: false,
                message: "user_id is required",
            });
        }

        const paidExpenses = await prisma.$queryRaw`
            SELECT
                ep.*,
                req.username AS requested_by_name,
                req.email AS requested_by_email,
                mgr.username AS manager_name,
                i.name AS intervention_name,
                p.name AS project_name,
                ept.payment_date
            FROM ExpensePayment ep
            JOIN User req ON req.id = ep.requested_by
            JOIN User mgr ON mgr.id = ep.manager_id
            JOIN Intervention i ON i.id = ep.intervention
            JOIN Project p ON p.id = ep.project_name
            JOIN (
                SELECT expense_id, MAX(payment_date) AS payment_date
                FROM ExpensePaymentTransaction
                GROUP BY expense_id
            ) ept ON ept.expense_id = ep.id
            WHERE ep.company_id = ${company_id}
              AND ep.payment_status = 2
              AND ep.requested_by = ${user_id}
              AND ep.tally_status=0
            ORDER BY ept.payment_date DESC, ep.id DESC
        `;
        return res.status(200).json({
            success: true,
            data: paidExpenses,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Paid Expense Report fetch failed",
            error: error.message,
        });
    }
};

