import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const getExpenseFormData = async (req, res) => {
  try {
    const company_id = req.user?.company_id;

    if (!company_id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // ✅ Fetch Projects
    const projects = await prisma.project.findMany({
      where: {
        company_id: company_id,
        status: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // ✅ Fetch Interventions
    const interventions = await prisma.intervention.findMany({
      where: {
        company_id: company_id,
        status: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      projects,
      interventions,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createExpense = async (req, res) => {
  try {
    const {
      project_name,
      project_state,
      project_district,
      project_village,
      intervention,
      requested_date,
      amount,
    } = req.body;

    const company_id = req.user.company_id; 
    const created_by = req.user.email;
    const requested_by = req.user.id;
    

    const manager_project_id = await prisma.project.findFirst({
        where : {
            id: parseInt(project_name)
        },
        select: {
        manager_id: true,
      },
    });

    let document = null;

    if (req.file) {
      document = req.file.filename;
    }

    const expense = await prisma.expensePayment.create({
      data: {
        company_id,
        project_name,
        project_state,
        project_district,
        project_village,
        intervention : parseInt(intervention),
        amount: Number(amount),
        manager_id : parseInt(manager_project_id.manager_id),
        requested_by,
        created_by,
        document,
         requested_date: new Date(requested_date),
      },
    });

    return res.status(201).json({
      message: "Expense created successfully",
      data: expense,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const getMyCreatedExpenses = async (req, res) => {
  try {
    const company_id = req.user?.company_id;
    const created_by = req.user?.email;

    if (!company_id || !created_by) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // ✅ 1. Fetch all data
    const [expenses, projects, users, interventions] = await Promise.all([
      prisma.expensePayment.findMany({
        where: {
          company_id,
          created_by,
        },
        orderBy: {
          created_at: "desc",
        },
      }),

      prisma.project.findMany({
        where: { company_id },
        select: { id: true, name: true },
      }),

      prisma.user.findMany({
        where: { company_id },
        select: { id: true, username: true },
      }),

      prisma.intervention.findMany({
        where: { company_id },
        select: { id: true, name: true },
      }),
    ]);

    // ✅ 2. Map data
    const mappedExpenses = expenses.map((exp) => {
      const project = projects.find(
        (p) => p.id === Number(exp.project_name) // 👈 project_id stored in project_name
      );

      const manager = users.find(
        (u) => u.id === exp.manager_id
      );

       const intervention = interventions.find(
        (i) => i.id === Number(exp.intervention) // 👈 IMPORTANT
      );

      return {
        id: exp.id,
        project_name: project?.name || "N/A",
        manager_name: manager?.username || "N/A",
        intervention_name: intervention?.name || "N/A",
        project_state: exp.project_state,
        project_district: exp.project_district,
        project_village: exp.project_village,
        amount: exp.amount,
        document: exp.document,
        created_at: exp.created_at,
      };
    });

    return res.status(200).json(mappedExpenses);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const getManagerExpenses = async (req, res) => {
  try {
    const company_id = req.user?.company_id;
    const manager_id = req.user?.id;

    if (!company_id || !manager_id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // ✅ Fetch data
    const [expenses, projects, users] = await Promise.all([
      prisma.expensePayment.findMany({
        where: {
          company_id,
          manager_id: Number(manager_id),
        },
        orderBy: {
          created_at: "desc",
        },
      }),

      prisma.project.findMany({
        where: { company_id },
        select: { id: true, name: true },
      }),

      prisma.user.findMany({
        where: { company_id },
        select: { id: true, username: true },
      }),
    ]);

    // ✅ Maps (FAST lookup)
    const projectMap = Object.fromEntries(
      projects.map((p) => [p.id, p.name])
    );

    const userMap = Object.fromEntries(
      users.map((u) => [u.id, u.username])
    );

    // ✅ Status converter
    const getStatusText = (status) => {
      if (status === 1) return "Approved";
      if (status === 2) return "Rejected";
      return "Pending";
    };

    // ✅ Map response
    const result = expenses.map((exp) => ({
      id: exp.id,
      project: projectMap[Number(exp.project_name)] || "N/A",
      state: exp.project_state,
      district: exp.project_district,
      village: exp.project_village,
      amount: exp.amount,
      review_assign : exp.review_assign,

      // ✅ FIXED
      reviewer_name: userMap[exp.reviewer_id] || "N/A",

      managertoreviewer: exp.managertoreviewer,

      status: getStatusText(exp.approval_status),
    }));

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const getReviewers = async (req, res) => {
  try {
    const company_id = req.user?.company_id;

    if (!company_id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const reviewers = await prisma.user.findMany({
      where: {
        company_id: company_id,
        status: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
      orderBy: {
        username: "asc",
      },
    });

    return res.status(200).json(reviewers);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const assignReviewer = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { reviewer_id, managertoreviewer } = req.body;

    const updated = await prisma.expensePayment.update({
      where: { id },
      data: {
        reviewer_id: reviewer_id,
        managertoreviewer: managertoreviewer || "",
        review_assign: true,
      },
    });
    return res.status(200).json({
      message: "Reviewer Assigned Successfully",
      data: updated,
    });

  } catch (error) {
  console.log("ERROR 👉", error); // 👈 IMPORTANT
  return res.status(500).json({
    message: error.message,
  });
}
};


export const getReviewerExpenses = async (req, res) => {
  try {
    const company_id = req.user?.company_id;
    const reviewer_id = req.user?.id;

    if (!company_id || !reviewer_id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const [expenses, projects, users, interventions] = await Promise.all([
      prisma.expensePayment.findMany({
        where: {
          company_id,
          reviewer_id: Number(reviewer_id),
        },
        orderBy: {
          created_at: "desc",
        },
      }),

      prisma.project.findMany({
        where: { company_id },
        select: { id: true, name: true },
      }),

      prisma.user.findMany({
        where: { company_id },
        select: { id: true, username: true, email: true },
      }),

      prisma.intervention.findMany({
        where: { company_id },
        select: { id: true, name: true },
      }),
    ]);

    // ✅ Maps
    const projectMap = Object.fromEntries(
      projects.map((p) => [p.id, p.name])
    );

    const userMap = Object.fromEntries(
      users.map((u) => [u.id, u.username])
    );

    const emailMap = Object.fromEntries(
      users.map((u) => [u.email, u.username]) // 👈 for created_by
    );

    const interventionMap = Object.fromEntries(
      interventions.map((i) => [i.id, i.name])
    );

    const getStatusText = (status) => {
      if (status === 1) return "Approved";
      if (status === 2) return "Rejected";
      return "Pending";
    };

    // ✅ FINAL RESPONSE
    const result = expenses.map((exp) => ({
      id: exp.id,

      project: projectMap[Number(exp.project_name)] || "N/A",

      intervention:
        interventionMap[Number(exp.intervention)] || "N/A",

      state: exp.project_state,
      district: exp.project_district,
      village: exp.project_village,
      amount: exp.amount,

      // ✅ ALL 3 NAMES
      raised_by: userMap[exp.requested_by] || exp.requested_by || "N/A",
      manager_name: userMap[exp.manager_id] || "N/A",
      reviewer_name: userMap[exp.reviewer_id] || "N/A",

      manager_remark: exp.managertoreviewer,
      reviewer_remarks: exp.reviewer_remarks,
      approved_amount: exp.approved_amount,

      reviewer_status: getStatusText(exp.reviewer_approval_status),

      created_at: exp.created_at,
    }));

    return res.status(200).json(result);

  } catch (error) {
    console.log(error); // 🔥 always log
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const reviewerApprove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const reviewer_id = req.user?.id;

    const {
      reviewer_approval_status,
      reviewer_remarks,
      approved_amount,
    } = req.body;

    const existing = await prisma.expensePayment.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const approvedAmt = approved_amount
      ? Number(approved_amount)
      : existing.amount;

    let amountChangeBy = null;

    if (approvedAmt !== existing.amount) {
      amountChangeBy = reviewer_id;
    }

    const updated = await prisma.expensePayment.update({
      where: { id },
      data: {
        reviewer_status: true,
        reviewer_approval_status: Number(reviewer_approval_status),
        reviewer_remarks,
        approved_amount: approvedAmt,
        amount_change_by: amountChangeBy,
      },
    });

    return res.status(200).json({
      message: "Review submitted successfully",
      data: updated,
    });

  } catch (error) {
    console.log("ERROR:", error); // 👈 VERY IMPORTANT
    return res.status(500).json({
      message: error.message,
    });
  }
};