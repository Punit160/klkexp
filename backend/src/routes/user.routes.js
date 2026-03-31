import { Router } from "express";
import upload from "../middlewares/uploads.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserStatus,
  getReportingHeads
} from "../controllers/user.controller.js";
import { checkPermission } from "../middlewares/checkPermission.js";

const router = Router();

router.post("/create-user", checkPermission("create_user"), upload.single("user_img"), createUser);
router.get("/get-user", checkPermission("view_user"), getAllUsers);
router.get("/fetch-user/:id", checkPermission("edit_user"), getUserById);
router.put("/update-user/:id", checkPermission("edit_user"), upload.single("user_img"), updateUser);
router.delete("/delete-user/:id", checkPermission("delete_user"), deleteUser);
router.patch("/change/:id/status", checkPermission("edit_user"), changeUserStatus);
router.get("/get-reporting-heads", getReportingHeads);

export default router;