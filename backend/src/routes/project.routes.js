import express from "express"
import { createProject, getProjects,  getProjectById, updateProject, deleteProject} from "../controllers/project.controller.js";
import upload from "../middlewares/uploads.js";

const router = express.Router()

router.post("/create-project", upload.single("mou"), createProject);
router.get("/get-projects", getProjects);
router.get("/fetch-project/:id", getProjectById);
router.put("/update-project/:id", upload.single("mou"), updateProject);
router.delete("/delete-project/:id", deleteProject);

export default router