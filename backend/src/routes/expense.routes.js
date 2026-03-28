import { Router } from "express";
import upload from "../middlewares/uploads.js";
import { createExpense, getExpenseFormData, getMyCreatedExpenses, getManagerExpenses, getReviewers, assignReviewer, getReviewerExpenses, reviewerApprove, managerApproveExpense, getAccountsExpenses , processPayment, getPaymentHistory, paymentReceipt } from "../controllers/expense.controller.js";

const router = Router();

router.get("/add-expense", getExpenseFormData)
router.post("/create", upload.single("document"), createExpense);
router.get("/view-my-expense", getMyCreatedExpenses);
router.get("/manager-expenses", getManagerExpenses);
router.get("/reviewers", getReviewers);
router.patch("/assign-reviewer/:id", assignReviewer);
router.get("/review-expenses", getReviewerExpenses);
router.patch("/reviewer-approval/:id", reviewerApprove);
router.patch("/manager-approve/:id",managerApproveExpense);
router.get("/accounts-expenses",getAccountsExpenses);
router.post("/process-payment/:id", processPayment);
router.get("/payment-history/:id", getPaymentHistory);
router.get("/payment-receipt/:id", paymentReceipt);




export default router;