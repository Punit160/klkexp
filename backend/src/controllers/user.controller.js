import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import path from "path";

const prisma = new PrismaClient();

//   CREATE EMPLOYEE
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

    //   Session values
    const company_id = req.session.company_id;
    const created_by = req.session.user_id;

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
      message: "Employee created successfully ",
      employee,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error ",
    });
  }
};


//   GET ALL USERS
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



//   GET SINGLE USER
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


// UPDATE USER  
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

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

    //   Date helper
    const formatDate = (date) => {
      if (!date || date === "" || date === "undefined") return null;
      return new Date(date);
    };

    //   Build update object with correct DB field names
    const updateData = {
      username: empName,
      email: empEmail,
      reporting_head: reportingHead,
      doj: formatDate(doj),
      dol: formatDate(dol),
      ctc: ctc ? parseFloat(ctc) : null,
      phone_no: phone,
      designation,
      dob: formatDate(dob),
      gender,
      qualification,
   status: status === "Active" ? true : false,  
      updated_at: new Date(),
    };

    //   Password: only update if provided
    if (password && password.trim() !== "") {
      updateData.password = password; // ya bcrypt use karo agar chahiye
    }

    //   Image: only update if new file uploaded
    if (req.file) {
      updateData.user_img = req.file.filename;

      // Delete old image
      if (existingUser.user_img) {
        const oldPath = path.join(process.cwd(), "uploads", existingUser.user_img);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.json({ message: "Employee updated successfully  ", user: updatedUser });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};




//   DELETE USER
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



//   OPTIONAL: CHANGE STATUS (ACTIVE / INACTIVE)
export const changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    //   Convert string to boolean if coming from frontend
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