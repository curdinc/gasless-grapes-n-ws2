import { SignatureType } from "siwe";
import { z } from "zod";

export const SiweNonceSchema = z.object({
  nonce: z.string(),
});
export type SiweNonceType = z.infer<typeof SiweNonceSchema>;

export const SiweSchema = z.object({
  domain: z.string(),
  address: z.string(),
  statement: z.string().optional(),
  uri: z.string(),
  version: z.string(),
  chainId: z.number(),
  nonce: z.string(),
  issuedAt: z.string(),
  expirationTime: z.string().optional(),
  notBefore: z.string().optional(),
  requestId: z.string().optional(),
  resources: z.string().array().optional(),
  signature: z.string().optional(),
  type: z.nativeEnum(SignatureType).optional(),
});
export type SiweType = z.infer<typeof SiweSchema>;
