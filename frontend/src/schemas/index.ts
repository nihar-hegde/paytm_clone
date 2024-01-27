import { z } from "zod";

export const SignUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string().email(),
  password: z.string().min(6),
});

export const SignInSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});
