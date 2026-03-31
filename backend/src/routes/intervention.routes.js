import express from "express";
import { checkPermission } from "../middlewares/checkPermission.js";
import {
  createIntervention,
  fetchIntervention,
  getAllInterventions,
  updateIntervention,
  deleteIntervention
} from "../controllers/intervention.controller.js";

const router = express.Router();

// Create
router.post("/create-intervention", checkPermission("create_intervention"), createIntervention);

// Get all
router.get("/get-interventions", checkPermission("create_intervention"), getAllInterventions);

// Get single by ID
router.get("/fetch-intervention/:id", checkPermission("edit_intervention"), fetchIntervention);

// Update
router.put("/fetch-intervention/:id", checkPermission("edit_intervention"), updateIntervention);

// Delete
router.delete("/delete-intervention/:id", checkPermission("delete_intervention"), deleteIntervention);

export default router;