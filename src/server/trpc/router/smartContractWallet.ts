import {
  deploySmartContractWallet,
  getSmartContractWalletAddress,
  sendOneTransaction,
} from "@server/common/ethers";
import { DeviceAuthenticator } from "@server/db/modals/DeviceAuthenticator";
import { SmartContractWallet } from "@server/db/modals/smartContractWallet";
import { SmartContractWalletDetails } from "@server/db/modals/smartContractWalletDetails";
import { TRPCError } from "@trpc/server";
import { ErrorMessages } from "@utils/messages";
import { BigNumber } from "ethers";
import {
  FetchSmartContractWalletByTypeSchema,
  SendSmartContractWalletTransactionSchema,
  SmartContractWalletCreationSchema,
  SmartContractWalletDeploymentSchema,
} from "types/schema/SmartContractWallet";
import { protectedProcedure, router } from "../trpc";

export const smartContractWalletRouter = router({
  createNewWallet: protectedProcedure
    .input(SmartContractWalletCreationSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      const eoaWallet = await DeviceAuthenticator().getAssociatedEoaWallet({
        deviceName: user.currentDeviceName,
        userId: user.id,
      });
      const { salt, walletAddress } = await getSmartContractWalletAddress({
        eoaWalletAddress: eoaWallet.address,
      });
      console.log("SCW: Creating wallet for user", { salt, userId: user.id });

      // store the wallet address and the hash used to generate the particular address
      const smartContractWallet = await SmartContractWallet().create({
        address: walletAddress,
        userId: user.id,
        walletSalt: salt,
        type: input.type,
        eoaAddress: eoaWallet.address,
      });
      console.log("SCW: Added DB entry for user", { salt, userId: user.id });

      return { smartContractWallet };
    }),
  deployToNewChain: protectedProcedure
    .input(SmartContractWalletDeploymentSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const smartContractWallet = await SmartContractWallet().getByAddress({
        walletAddress: input.walletAddress,
      });
      const eoaDetails = await DeviceAuthenticator().getAssociatedEoaWallet({
        deviceName: user.currentDeviceName,
        userId: user.id,
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
      const { openZeppelinTransactionId, txHash } =
        await deploySmartContractWallet(
          creationSalt,
          input.chain,
          eoaDetails.address
        );
      console.log("SCW: deployed wallet for user", {
        creationSalt,
        userId: ctx.session.user.id,
        openZeppelinTransactionId,
        txHash,
      });
      const deploymentDetails = await SmartContractWalletDetails().deployed({
        chain: input.chain,
        openZeppelinTransactionId,
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
  sendTransaction: protectedProcedure
    .input(SendSmartContractWalletTransactionSchema)
    .mutation(async ({ input }) => {
      console.log("receive send transaction request ", input);
      const smartContractWalletDetails =
        await SmartContractWallet().getByAddress({
          walletAddress: input.walletAddress,
        });
      console.log("smartContractWalletDetails", smartContractWalletDetails);
      if (
        !smartContractWalletDetails ||
        !smartContractWalletDetails?.SmartContractWalletDetails.filter(
          (details) => details.chain === input.chain
        ).length
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: ErrorMessages.missingSmartContractWalletDetails,
        });
      }
      console.log("sending transaction");
      const transaction = await sendOneTransaction({
        nonce: BigNumber.from(input.nonce),
        chain: input.chain,
        signature: input.signature,
        transaction: input.transaction,
      });
      return transaction;
    }),
});
