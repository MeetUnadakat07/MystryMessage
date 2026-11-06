import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(8, "Username must be at least 8 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(
        /^[A-Za-z0-9_]+$/,
        "Username must contain only letters, numbers, and underscores",
    );

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});
