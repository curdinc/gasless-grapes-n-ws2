import { z } from "zod";

export const SmartContractWalletType: {
  [key in SmartContractWalletTypeType]: key;
} = {
  Default: "Default",
};
export const SmartContractWalletTypeSchema = z.enum(["Default"]);
export type SmartContractWalletTypeType = z.infer<
  typeof SmartContractWalletTypeSchema
>;

export const SmartContractWalletCreationSchema = z.object({
  type: SmartContractWalletTypeSchema,
});
export type SmartContractWalletCreationType = z.infer<
  typeof SmartContractWalletCreationSchema
>;
