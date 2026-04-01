import express from "express";
import { UserDashboard , AdminDashboard , ManagerDashboard
} from "../controllers/dashboard.controller.js";


const router = express.Router();

// This will be accessible at /api/dashboards/users
router.get("/user-dashboard", UserDashboard);
router.get("/admin-dashboard", AdminDashboard);
router.get("/manager-dashboard", ManagerDashboard);

export default router;