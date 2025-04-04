import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getAllTransactions,
  getTransactionById,
  getTransactionsIMade,
  getTransactionsMadeToMe,
  getAllTransactionsByStatus,
  directTransaction,
} from "../controllers/transaction.js";

const transactionRouter = express.Router();

transactionRouter.get("/me", authMiddleware, getAllTransactions);
transactionRouter.get("/me/:status", authMiddleware, getAllTransactionsByStatus);
transactionRouter.get("/toothers", authMiddleware, getTransactionsIMade);
transactionRouter.get("/tome", authMiddleware, getTransactionsMadeToMe);
transactionRouter.get("/:transactionId", authMiddleware, getTransactionById);
transactionRouter.post("/direct", authMiddleware, directTransaction);

export default transactionRouter;
