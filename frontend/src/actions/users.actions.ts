"use server";

import { SignUpSchema } from "@/schemas";
import { z } from "zod";
export const getAllUsers = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/user/bulk");
    const users = await response.json();
    return users;
  } catch (error) {
    console.log(error);
  }
};

export const signUp = async (data: z.infer<typeof SignUpSchema>) => {
  try {
    console.log("from server action", data);
    const response = await fetch("http://localhost:8080/api/v1/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set appropriate header
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
