import { z } from "zod";
import { ClientExtensionResultsSchema, TransportSchema } from "./common";

export const RegisterCredentialSchema = z.object({
  id: z.string(),
  rawId: z.string(),
  response: z.object({
    attestationObject: z.string(),
    clientDataJSON: z.string(),
  }),
  type: z.string(),
  authenticatorAttachment: z.enum(["cross-platform", "platform"]).optional(),
  clientExtensionResults: ClientExtensionResultsSchema,
  transports: TransportSchema.optional(),
  eoaAddress: z.string(),
  eoaEncryptedPrivateKey: z.string(),
});
export type RegisterCredentialType = z.infer<typeof RegisterCredentialSchema>;
