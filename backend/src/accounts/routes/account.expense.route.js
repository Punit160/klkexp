import { Router } from "express";
import { checkPermission } from "../../middlewares/checkPermission.js";
import { CreateExpenseVouchersValidation } from "../validators/account.expense.validator.js";
import { PaidExpenseUsers,PaidExpenseUserReport,CreateExpenseVouchers,ViewExpenseVouchers,UpdateExpenseVoucherStatus} from "../controllers/account.expense.controller.js";
const router = Router();

router.get("/paid/users", PaidExpenseUsers);
router.get("/paid/users/report", PaidExpenseUserReport);
router.post("/create/expense_vouchers", CreateExpenseVouchersValidation,CreateExpenseVouchers)
router.get("/view/expense_vouchers", ViewExpenseVouchers)
router.patch("/expense_vouchers/:id/status", UpdateExpenseVoucherStatus);

export default router;