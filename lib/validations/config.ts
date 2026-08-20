import { z } from "zod";
export * from "./index";

export const userRoleUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["admin", "user"]).optional(),
  is_active: z.boolean().optional(),
});

export type UserRoleUpdateValues = z.infer<typeof userRoleUpdateSchema>;
