import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export const CreateExpenseVouchersValidation = [

    body("user_id")
        .notEmpty()
        .withMessage("User is required")
        .isInt()
        .withMessage("Invalid User ID")
        .bail()
        .custom(async (value) => {
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(value)
                }
            });

            if (!user) {
                throw new Error("User not found");
            }

            return true;
        }),

    body("voucher_no")
        .trim()
        .notEmpty()
        .withMessage("Voucher No is required"),

    body("voucher_date")
        .notEmpty()
        .withMessage("Voucher Date is required")
        .isISO8601()
        .withMessage("Invalid Voucher Date"),

    body("narration")
        .trim()
        .notEmpty()
        .withMessage("Narration is required"),

    body("debit")
        .optional()
        .isArray()
        .withMessage("Debit must be an array"),

    body("credit")
        .optional()
        .isArray()
        .withMessage("Credit must be an array"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array(),
            });
        }

        const debit = req.body.debit || [];
        const credit = req.body.credit || [];

        if (debit.length === 0 && credit.length === 0) {
            return res.status(422).json({
                success: false,
                message: "Please add at least one Debit or Credit entry."
            });
        }

        next();
    },
];