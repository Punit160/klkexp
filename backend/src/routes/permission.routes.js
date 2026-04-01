import { Router } from "express";
import { checkPermission } from "../middlewares/checkPermission.js";
import {
  createPermission,
  getPermissions,
} from "../controllers/permission.controller.js";

const router = Router();

router.post("/create-permission", checkPermission("create_permission"), createPermission);
router.get("/get-permission", checkPermission("view_permission"), getPermissions);

export default router;