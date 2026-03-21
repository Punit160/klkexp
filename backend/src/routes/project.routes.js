import express from "express"
import { createProject, getProjects,  getProjectById, updateProject, deleteProject} from "../controllers/project.controller.js";

const router = express.Router()

router.post("/create-project", createProject);
router.get("/get-projects", getProjects);
router.get("/fetch-project/:id", getProjectById);
router.put("/fetch-project/:id", updateProject);
router.delete("/delete-project/:id", deleteProject);

export default router