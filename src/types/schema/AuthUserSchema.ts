import { z } from "zod";

export const AuthUserSchema = z.object({
  id: z.string().uuid(),
  currentDeviceName: z.string(),
  state: z.enum(["loggedIn", "pendingRegistration", "pendingAuthentication"]),
});
export type AuthUserType = z.infer<typeof AuthUserSchema>;
export type AuthSessionType = { user: AuthUserType | null };
