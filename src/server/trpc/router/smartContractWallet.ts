import {
  deploySmartContractWallet,
  getSmartContractWalletAddress,
} from "@server/common/ethers";
import { SmartContractWallet } from "@server/db/modals/smartContractWallet";
import { SmartContractWalletDetails } from "@server/db/modals/smartContractWalletDetails";
import { TRPCError } from "@trpc/server";
import { ErrorMessages } from "@utils/messages";
import {
  FetchSmartContractWalletByTypeSchema,
  SmartContractWalletCreationSchema,
  SmartContractWalletDeploymentSchema,
} from "types/schema/SmartContractWallet";
import { protectedProcedure, router } from "../trpc";

export const smartContractWalletRouter = router({
  createNewWallet: protectedProcedure
    .input(SmartContractWalletCreationSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { salt, walletAddress } = await getSmartContractWalletAddress();
      console.log("SCW: Creating wallet for user", { salt, userId: user.id });

      // store the wallet address and the hash used to generate the particular address
      const smartContractWallet = await SmartContractWallet().create({
        address: walletAddress,
        userId: user.id,
        walletSalt: salt,
        type: input.type,
      });
      console.log("SCW: Added DB entry for user", { salt, userId: user.id });

      return { smartContractWallet };
    }),
  deployToNewChain: protectedProcedure
    .input(SmartContractWalletDeploymentSchema)
    .mutation(async ({ input, ctx }) => {
      const smartContractWallet = await SmartContractWallet().getByAddress({
        walletAddress: input.walletAddress,
      });
      if (!smartContractWallet) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: ErrorMessages.invalidWalletAddress,
        });
      }
      const existingWallet =
        smartContractWallet.SmartContractWalletDetails.filter((details) => {
          details.chain === input.chain;
        });
      if (!!existingWallet.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: ErrorMessages.smartContractWalletAlreadyDeployed,
        });
      }
      const { creationSalt, id: smartContractWalletId } = smartContractWallet;
      const { txHash } = await deploySmartContractWallet(
        creationSalt,
        input.chain
      );
      console.log("SCW: deployed wallet for user", {
        creationSalt,
        userId: ctx.session.user.id,
        txHash,
      });
      const deploymentDetails = await SmartContractWalletDetails().deployed({
        chain: input.chain,
        deploymentHash: txHash,
        smartContractWalletId: smartContractWalletId,
      });
      return { deploymentDetails };
    }),
  getWalletDetailsByType: protectedProcedure
    .input(FetchSmartContractWalletByTypeSchema)
    .query(async ({ ctx, input }) => {
      const wallets = await SmartContractWallet().getByType({
        userId: ctx.session.user.id,
        type: input.type,
      });
      return wallets;
    }),
});
