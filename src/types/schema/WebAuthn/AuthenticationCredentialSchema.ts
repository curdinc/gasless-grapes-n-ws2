import { z } from "zod";
import { ClientExtensionResultsSchema } from "./common";

export const AuthenticationCredentialSchema = z.object({
  id: z.string(),
  rawId: z.string(),
  response: z.object({
    authenticatorData: z.string(),
    clientDataJSON: z.string(),
    signature: z.string(),
    userHandle: z.string().optional(),
  }),
  type: z.string(),
  clientExtensionResults: ClientExtensionResultsSchema,
});
