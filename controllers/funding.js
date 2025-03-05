import Transaction from "../models/Transaction.js";
import paystack from "../libs/paystack.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Funding from "../models/Funding.js";

/**
 * This endpoint is used to initialize a new transaction
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const initFundingTransaction = async (req, res) => {
  try {
    const { id } = req.user;
    const { amount } = req.body;
    const user = await User.findByPk(id);
    const transaction = await paystack.transaction.initialize({
      amount: parseInt(`${amount}00`),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    });

    res.json(transaction);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while initializing a transaction" });
  }
};

/**
 * This endpoint is used to verify a transaction
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const verifyFundingTransaction = async (req, res) => {
  try {
    const { id } = req.user;
    const { reference } = req.body;
    const user = await User.findByPk(id);
    const transaction = await paystack.transaction.verify(reference);

    if (!user)
      return res.status(404).json({ message: "User account not found" });

    if (transaction.data.status !== "success")
      return res.status(422).json({
        verified: transaction.data.status === "success",
        message: "Verification failed",
        transactionData: transaction.data,
      });

    let wallet = await Wallet.findOne({ where: { userId: user.id } });

    let existingFunding = await Funding.findOne({
      where: {
        paystack_reference: transaction.data.reference,
        paystack_id: String(transaction.data.id),
      },
    });

    if (existingFunding)
      return res.status(422).json({ message: "Transaction already recorded" });
    let amount = parseInt(
      `${String(transaction.data.amount).slice(
        0,
        String(transaction.data.amount).length - 2
      )}`
    );

    await Funding.create({
      walletId: wallet.id,
      userId: user.id,
      amount,
      paystack_reference: transaction.data.reference,
      paystack_id: String(transaction.data.id),
    });

    await wallet.update({
      currentBalance: wallet.currentBalance + amount,
    });

    res.json({
      verified: transaction.data.status === "success",
      message: transaction.message,
      transactionData: transaction.data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while verifying transaction",
      error,
    });
  }
};
