import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createIntervention = async (req, res) => {
  try {
    const { name, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // 🔍 Check duplicate (case insensitive optional)
    const existingIntervention = await prisma.intervention.findFirst({
      where: {
        name: name,
      },
    });

    if (existingIntervention) {
      return res.status(400).json({
        message: "Intervention Already Exists !!",
      });
    }

    const newIntervention = await prisma.intervention.create({
      data: {
        name,
        status: status == 1, // ✅ convert to boolean
        company_id: req.user?.company_id,
        created_by: req.user?.email,
      },
    });

    return res.status(201).json({
      message: "Intervention Added Successfully !!!",
      data: newIntervention,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const fetchIntervention = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const intervention = await prisma.intervention.findUnique({
      where: { id }
    });

    if (!intervention) {
      return res.status(404).json({
        message: "Intervention Not Exist !!"
      });
    }

    return res.status(200).json(intervention);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

export const getAllInterventions = async (req, res) => {
  try {
    const company_id = req.user?.company_id;

    if (!company_id) {
      return res.status(401).json({
        message: "Unauthorized: company_id missing",
      });
    }

    const interventions = await prisma.intervention.findMany({
      where: {
                company_id: req.user.company_id,
      },
      orderBy: { created_at: "desc" },
    });

    return res.status(200).json(interventions);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateIntervention = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existingIntervention = await prisma.intervention.findUnique({
      where: { id }
    });

    if (!existingIntervention) {
      return res.status(404).json({
        message: "Intervention not found"
      });
    }

    const updatedIntervention = await prisma.intervention.update({
      where: { id },
      data: {
        ...req.body
      }
    });

    return res.status(200).json({
      message: "Intervention updated successfully",
      data: updatedIntervention
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};


export const deleteIntervention = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const deletedIntervention = await prisma.intervention.delete({
      where: { id }
    });

    return res.status(200).json({
      message: "Intervention Deleted Successfully !!",
      data: deletedIntervention
    });

  } catch (error) {

    // Handle "record not found" specifically
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Intervention Not Found !!"
      });
    }

    return res.status(500).json({
      message: error.message
    });
  }
};