import { Router } from "express";
import upload from "../middlewares/uploads.js";
import { createExpense, getExpenseFormData, getMyCreatedExpenses, getManagerExpenses, getReviewers, assignReviewer, getReviewerExpenses, reviewerApprove } from "../controllers/expense.controller.js";

const router = Router();

router.get("/add-expense", getExpenseFormData)
router.post("/create", upload.single("document"), createExpense);
router.get("/view-my-expense", getMyCreatedExpenses);
router.get("/manager-expenses", getManagerExpenses);
router.get("/reviewers", getReviewers);
router.patch("/assign-reviewer/:id", assignReviewer);
router.get("/review-expenses", getReviewerExpenses);
router.patch("/reviewer-approval/:id", reviewerApprove);


export default router;