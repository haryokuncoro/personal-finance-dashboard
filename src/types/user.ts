import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userResponseSchema = userSchema.extend({
  id: z.string(),
});


export type UserRequest = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
