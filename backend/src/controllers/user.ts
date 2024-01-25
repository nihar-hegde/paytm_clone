import express from "express";
import z from "zod";
import User from "../db/models/user.model";
import Account from "../db/models/account.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT SECRET is  missing");
}

const signUpBody = z.object({
  username: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});

export const signUpUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
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
    const user = await User.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    });
    // NOTE: get the user will auto add the id and return it in the const user variable use it;

    const userId = user._id;

    // NOTE: create an account for that user
    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });

    // NOTE: use the id and sign the jwt secreet

    const token = jwt.sign(
      {
        userId,
      },
      jwtSecret
    );
    res.json({
      message: "User created  successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};

const signInBody = z.object({
  username: z.string().email(),
  password: z.string(),
});

export const signInUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
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
        jwtSecret
      );
      res.json({
        token: token,
      });
      return;
    }
    res.status(411).json({
      message: "Error while logging in!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};

const userBody = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { success } = userBody.safeParse(req.body);
    if (!success) {
      res.status(411).json({
        message: "Invalid Inputs!!",
      });
    }
    await User.findByIdAndUpdate(req.body._id, req.body);

    res.json({
      message: "User Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};

export const getAllUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const filter = req.query.filter || "";

    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });

    res.status(200).json({
      user: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};
