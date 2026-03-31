import express from "express"
import { createProject, getProjects,  getProjectById, updateProject, deleteProject, getManagers} from "../controllers/project.controller.js";
import upload from "../middlewares/uploads.js";
import { checkPermission } from "../middlewares/checkPermission.js";

const router = express.Router()

router.post("/create-project", checkPermission("create_project"), upload.single("mou"), createProject);
router.get("/get-projects", checkPermission("view_project"), getProjects);
router.get("/fetch-project/:id", checkPermission("edit_project"), getProjectById);
router.put("/update-project/:id", checkPermission("edit_project"), upload.single("mou"), updateProject);
router.delete("/delete-project/:id", checkPermission("delete_project"), deleteProject);
router.get("/get-managers", getManagers);

export default router