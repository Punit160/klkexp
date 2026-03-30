// import express from "express";
// import { UserDashboard } from "../controllers/dashboard.controller.js";



// const router = express.Router();

// router.get("/users", UserDashboard);

// export default router;



import express from "express";
import { UserDashboard , AdminDashboard , ManagerDashboard
} from "../controllers/dashboard.controller.js";


const router = express.Router();

// This will be accessible at /api/dashboards/users
router.get("/users", UserDashboard);
router.get("/admin", AdminDashboard);
router.get("/manager", ManagerDashboard);

export default router;