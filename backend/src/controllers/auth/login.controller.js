import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const loginUser = async (req, res) => {
  try {

    console.log("BODY:", req.body); // 👈 ADD THIS

    if (!req.body) {
      return res.status(400).json({ message: "Body missing" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & Password required" });
    }

    // ✅ Fetch user from MySQL via Prisma
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // 🔐 Compare password (IMPORTANT)
   if (password !== user.password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // 🔑 Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.designation, // 👈 since you don't have role
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "10h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone_no: user.phone_no,
        designation: user.designation,
        reporting_head: user.reporting_head,
        status: user.status,
        user_img: user.user_img,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

