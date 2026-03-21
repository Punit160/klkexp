import { Router } from "express";
import upload from "../middlewares/uploads.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserStatus,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/create-user", upload.single("user_img"), createUser);
router.get("/get-user", getAllUsers);
router.get("/fetch-user/:id", getUserById);
router.put("/update-user/:id", upload.single("user_img"), updateUser);
router.delete("/delete-user/:id", deleteUser);
router.patch("change/:id/status", changeUserStatus);

export default router;