import { z } from "zod";
import type { SiweNonceType, SiweType } from "./Siwe/SiweSchema";

export const AuthUserSchema = z.object({
  id: z.string().uuid(),
  currentDeviceName: z.string(),
  state: z.enum(["loggedIn", "pendingRegistration", "pendingAuthentication"]),
});
export type AuthUserType = z.infer<typeof AuthUserSchema>;

export type AuthSessionType = {
  user: AuthUserType | null;
  siweNonce: SiweNonceType | null;
  siwe: SiweType | null;
};
