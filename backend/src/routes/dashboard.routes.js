import express from "express";
import { UserDashboard , AdminDashboard , ManagerDashboard
} from "../controllers/dashboard.controller.js";
import { checkPermission } from "../middlewares/checkPermission.js";



const router = express.Router();

// This will be accessible at /api/dashboards/users
router.get("/user-dashboard", checkPermission("user_dashboard"), UserDashboard);
router.get("/admin-dashboard", checkPermission("admin_dashboard"), AdminDashboard);
router.get("/manager-dashboard", checkPermission("manager_dashboard"), ManagerDashboard);

export default router;
