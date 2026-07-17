import { Router } from "express";
import { checkPermission } from "../src/middlewares/checkPermission.js";
import { PaidExpenseUsers,PaidExpenseUserReport,} from "../controllers/account.expense.controller.js";
const router = Router();


router.get("/paid/users", PaidExpenseUsers);
router.get("/paid/users/report", PaidExpenseUserReport);

export default router;