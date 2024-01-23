import express from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import User from "../db/models/user.model";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT SECRET is  missing");
}

const router = express.Router();

const signUpBody = z.object({
  username: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});

type userType = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

// NOTE: sign up route.
router.post("/signup", async (req, res) => {
  const { success } = signUpBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Invalid inputs!!",
    });
  }

  const exisitingUser = await User.findOne({
    username: req.body.username,
  });
  if (exisitingUser) {
    return res.status(411).json({
      message: "Email already taken!!!",
    });
  }
  //  NOTE: all have checked if the inputs are correct and if the users already exisits.
  //  NOTE: then create the user.
  const user: userType = await User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  });
  // NOTE: get the user will auto add the id and return it in the const user variable use it;

  const userId = user._id;

  // NOTE: use the id and sign the jwt secreet

  const token = jwt.sign(
    {
      userId,
    },
    jwtSecret,
  );
  res.json({
    message: "User created  successfully",
    token: token,
  });
});

const signInBody = z.object({
  username: z.string().email(),
  password: z.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signInBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Invalid Inputs!!!",
    });
  }
  const user = await User.findOne({
    username: req.body.username,
  });

  if (user === null) {
    res.status(404).json({
      message: "User not found!",
    });
    return;
  }

  if (user.password !== req.body.password) {
    res.status(401).json({
      message: "Invalid Password",
    });
    return;
  }

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      jwtSecret,
    );
    res.json({
      token: token,
    });
    return;
  }
  res.status(411).json({
    message: "Error while logging in!",
  });
});

export default router;
