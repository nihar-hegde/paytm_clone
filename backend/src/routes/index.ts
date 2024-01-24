import express from "express";
import userRouter from "./user";
import accountRoute from "./account";
const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountRoute);

export default router;
