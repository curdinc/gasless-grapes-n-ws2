import { z } from "zod";

export const ClientExtensionResultsSchema = z.object({
  devicePubKey: z
    .object({
      authenticatorOutput: z.string(),
      signature: z.string(),
    })
    .optional(),
  appid: z.boolean().optional(),
  credProps: z.object({ rk: z.boolean().optional() }).optional(),
  uvm: z.number().array().array().optional(),
});

export const TransportSchema = z
  .enum(["ble", "internal", "nfc", "usb", "cable", "hybrid"])
  .array();
