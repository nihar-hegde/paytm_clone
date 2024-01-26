import express from "express";
import mongoose from "mongoose";
import Account from "../db/models/account.model";
import dotenv from "dotenv";

dotenv.config();

export const getAccountBalance = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const account = await Account.findOne({
      userId: req.body._id,
    });
    res.json({
      balance: account?.balance,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};

export const transactions = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.body.userId }).session(
      session,
    );
    console.log(account);
    if (!account) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Account not found",
      });
    }

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    // Perform the transfer
    await Account.updateOne(
      { userId: req.body.userId },
      { $inc: { balance: -amount } },
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } },
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json({
      message: "Transfer successful",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};
