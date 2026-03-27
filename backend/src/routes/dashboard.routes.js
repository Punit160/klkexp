import express from "express";
import { Dashboard } from "../controllers/dashboard.controller.js";



const router = express.Router();

router.get("/users", Dashboard);

export default router;

