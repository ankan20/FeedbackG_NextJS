import { z } from "zod";

export const usernameValidation =z.string()
.min(3,"Username must be atleast 3 characters")
.max(20,"Username must be under 20 characters")
.regex(/^[a-zA-Z0-9_]+$/,"username must not contain special character");

