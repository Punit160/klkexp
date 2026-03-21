import express from "express";
import {
  createIntervention,
  fetchIntervention,
  getAllInterventions,
  updateIntervention,
  deleteIntervention
} from "../controllers/intervention.controller.js";

const router = express.Router();

// Create
router.post("/create-intervention", createIntervention);

// Get all
router.get("/get-interventions", getAllInterventions);

// Get single by ID
router.get("/fetch-intervention/:id", fetchIntervention);

// Update
router.put("/fetch-intervention/:id", updateIntervention);

// Delete
router.delete("/delete-intervention/:id", deleteIntervention);

export default router;