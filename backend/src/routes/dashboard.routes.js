import express from "express";
import { UserDashboard } from "../controllers/dashboard.controller.js";



const router = express.Router();

router.get("/users", UserDashboard);

export default router;

