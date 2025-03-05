import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getAllTransactions,
  getTransactionById,
  getTransactionsIMade,
  getTransactionsMadeToMe,
  getAllTransactionsByStatus,
} from "../controllers/transaction.js";

const transactionRouter = express.Router();

transactionRouter.get("/me", authMiddleware, getAllTransactionsByStatus);
transactionRouter.get("/me/:status", authMiddleware, getAllTransactions);
transactionRouter.get("/toothers", authMiddleware, getTransactionsIMade);
transactionRouter.get("/tome", authMiddleware, getTransactionsMadeToMe);
transactionRouter.get("/:transactionId", authMiddleware, getTransactionById);

export default transactionRouter;
