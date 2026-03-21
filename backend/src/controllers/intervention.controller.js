import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createIntervention = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if already exists
    const existingIntervention = await prisma.intervention.findFirst({
      where: { name }
    });

    if (existingIntervention) {
      return res.status(400).json({
        message: "Intervention Already Exists !!"
      });
    }

    // Create new intervention
    const newIntervention = await prisma.intervention.create({
      data: {
        ...req.body
      }
    });

    return res.status(200).json({
      message: "Intervention Added Successfully !!!",
      data: newIntervention
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
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
    const interventions = await prisma.intervention.findMany();

    if (!interventions || interventions.length === 0) {
      return res.status(404).json({
        message: "No Interventions Found !!"
      });
    }

    return res.status(200).json(interventions);

  } catch (error) {
    return res.status(500).json({
      message: error.message
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

