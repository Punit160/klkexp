import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
export const PaidExpenseUsers = async (req, res) => {
    try {
        const company_id = req.user.company_id;

        const paidUsers = await prisma.$queryRaw`
            SELECT DISTINCT
                u.id,
                u.username AS name,
                u.email
            FROM ExpensePayment ep
            INNER JOIN User u
                ON u.id = ep.requested_by
            WHERE ep.company_id = ${company_id}
              AND ep.payment_status = 2
              AND ep.voucher_status=0
            ORDER BY u.username ASC
        `;

        return res.status(200).json({
            success: true,
            data: paidUsers,   // <-- users nahi, paidUsers
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Paid Expense Users fetch failed",
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
              AND ep.voucher_status=0
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



export const CreateExpenseVouchers = async (req, res) => {
  try {
    const {
      user_id,
      voucher_no,
      voucher_date,
      narration,
      debit = [],
      credit = [],
    } = req.body;

    const created_by = req.user.id;
    const company_id = req.user.company_id;

    if (!user_id || !voucher_no || !voucher_date || !narration) {
      return res.status(400).json({
        success: false,
        message: "User, Voucher No, Voucher Date and Narration are required.",
      });
    }

    if (!Array.isArray(debit) || !Array.isArray(credit)) {
      return res.status(400).json({
        success: false,
        message: "Debit and Credit must be arrays.",
      });
    }

    if (debit.length === 0 && credit.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add at least one Debit or Credit entry.",
      });
    }

    const exists = await prisma.expenseVoucher.findFirst({
      where: {
        voucher_no,
        company_id,
      },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Voucher No already exists.",
      });
    }

    for (const item of debit) {
      if (!item.ledger_name || Number(item.amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid Debit Ledger.",
        });
      }
    }

    for (const item of credit) {
      if (!item.ledger_name || Number(item.amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid Credit Ledger.",
        });
      }
    }

    const debitTotal = debit.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const creditTotal = credit.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const difference = debitTotal - creditTotal;

    const voucher = await prisma.$transaction(async (tx) => {
      const header = await tx.expenseVoucher.create({
        data: {
          voucher_no,
          user_id: user_id,
          company_id,
          voucher_date: new Date(voucher_date),
          narration,
          debit_total: debitTotal,
          credit_total: creditTotal,
          difference,
          created_by,
        },
      });

      if (debit.length > 0) {
        await tx.expenseVoucherLine.createMany({
          data: debit.map((item, index) => ({
            voucher_id: header.id,
            ledger_name: item.ledger_name,
            entry_type: "debit",
            amount: Number(item.amount),
            row_order: index + 1,
          })),
        });
      }

      if (credit.length > 0) {
        await tx.expenseVoucherLine.createMany({
          data: credit.map((item, index) => ({
            voucher_id: header.id,
            ledger_name: item.ledger_name,
            entry_type: "credit",
            amount: Number(item.amount),
            row_order: index + 1,
          })),
        });
      }

      await tx.expensePayment.updateMany({
        where: {
          company_id,
          requested_by: user_id,
          payment_status: 2,
          voucher_status: 0,
        },
        data: {
          voucher_status: 1,
          voucher_id: header.id,
        },
      });

      return header;
    });

    return res.status(201).json({
      success: true,
      message: "Expense Voucher created successfully.",
      data: voucher,
    });
  } catch (error) {
    console.error("CreateExpenseVouchers:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Expense Voucher",
      error: error.message,
    });
  }
};

export const ViewExpenseVouchers = async (req, res) => {
    try {
        const company_id = req.user.company_id;
        const vouchers = await prisma.expenseVoucher.findMany({
            where: {
                company_id: company_id,
            },
            include: {
                lines: true,
            },
            orderBy: {
                id: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            data: vouchers,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch Expense Vouchers",
            error: error.message,
        });
    }
};


export const UpdateExpenseVoucherStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const company_id = req.user.company_id;
        if (!["draft", "push"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be 'draft' or 'push'."
            });
        }
        const voucher = await prisma.expenseVoucher.findFirst({
            where: {
                id: Number(id),
                company_id
            }
        });

        if (!voucher) {
            return res.status(404).json({
                success: false,
                message: "Expense Voucher not found."
            });
        }

        const updatedVoucher = await prisma.expenseVoucher.update({
            where: {
                id: Number(id)
            },
            data: {
                status,
                status_date: new Date()
            }
        });

        return res.status(200).json({
            success: true,
            message: `Expense Voucher ${status} successfully.`,
            data: updatedVoucher
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update voucher status.",
            error: error.message
        });
    }
};