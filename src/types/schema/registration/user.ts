import { z } from "zod";

export const UserRegistrationSchema = z.object({
  handle: z.string(),
  email: z.string().email().optional(),
});
export type UserRegistrationType = z.infer<typeof UserRegistrationSchema>;
