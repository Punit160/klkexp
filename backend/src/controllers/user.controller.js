import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import path from "path";

const prisma = new PrismaClient();

// ✅ CREATE EMPLOYEE
export const createUser = async (req, res) => {
  try {
    const {
      empName,
      empEmail,
      password,
      reportingHead,
      doj,
      dol,
      ctc,
      phone,
      designation,
      dob,
      gender,
      qualification,
      status,
    } = req.body;

    // ✅ FROM JWT (FIXED)
    const company_id = req.user.company_id;
    const created_by =  req.user.email;
    console.log(company_id, created_by);

    if (!company_id) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const statusValue = status == 1;
    const photo = req.file ? req.file.filename : null;
    const user_id = "EMP" + Date.now();

    const employee = await prisma.user.create({
      data: {
        company_id,
        user_id,
        username: empName,
        email: empEmail,
        password: password,
        reporting_head: reportingHead,
        doj: new Date(doj),
        dol: dol ? new Date(dol) : null,
        ctc: ctc ? parseFloat(ctc) : null,
        phone_no: phone,
        designation,
        dob: dob ? new Date(dob) : null,
        gender,
        qualification,
        user_img: photo,
        pfesi: false,
        status: statusValue,
        created_by,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    res.status(201).json({
      message: "Employee created successfully ✅",
      employee,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error ❌",
    });
  }
};


// ✅ GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { created_at: "desc" },
    });

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ GET SINGLE USER
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      empName,
      empEmail,
      password,
      reportingHead,
      doj,
      dol,
      ctc,
      phone,
      designation,
      gender,
      status,
      dob,
      qualification,
    } = req.body;

    const updatedData = {
      username: empName,
      email: empEmail,
      password: password || undefined,
      reporting_head: reportingHead,
      doj: doj ? new Date(doj) : undefined,
      dol: dol ? new Date(dol) : undefined,
      ctc: ctc ? parseFloat(ctc) : undefined, // ✅ convert to number
      phone_no: phone,
      designation,
      gender,
      status,
      dob: dob ? new Date(dob) : undefined,
      qualification: qualification || undefined,
      updated_at: new Date(),
    };

    // ✅ If file uploaded
    if (req.file) updatedData.user_img = req.file.filename;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updatedData,
    });

    res.json({ message: "User updated successfully ✅", data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// ✅ DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Find user first
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🖼️ Delete image if exists
    if (existingUser.user_img) {
      const imageName = existingUser.user_img.split("/uploads/")[1];

      if (imageName) {
        const imagePath = path.join(process.cwd(), "uploads", imageName);

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    // ❌ Delete user from DB
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ OPTIONAL: CHANGE STATUS (ACTIVE / INACTIVE)
export const changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    // ✅ Convert string to boolean if coming from frontend
    if (typeof status === "string") {
      status = status === "true";
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json({
      message: "Status updated",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};