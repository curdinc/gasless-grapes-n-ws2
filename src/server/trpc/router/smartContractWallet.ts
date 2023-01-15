import {
  deploySmartContractWallet,
  getSmartContractWalletAddress,
} from "@server/common/ethers";
import { SmartContractWallet } from "@server/db/modals/smartContractWallet";
import { protectedProcedure, router } from "../trpc";

export const smartContractWalletRouter = router({
  createNewWalletDetail: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;
    const { salt, walletAddress } = await getSmartContractWalletAddress();
    console.log("SCW: Creating wallet for user", { salt, userId: user.id });

    // store the wallet address and the hash used to generate the particular address
    await SmartContractWallet().createDefaultWallet({
      address: walletAddress,
      userId: user.id,
      walletSalt: salt,
    });
    console.log("SCW: Added DB entry for user", { salt, userId: user.id });

    // TODO: Probably move this into a queue to prevent clogging up the backend
    const { txHash } = await deploySmartContractWallet(salt);
    console.log("SCW: deployed wallet for user", {
      salt,
      userId: user.id,
      txHash,
    });

    const updatedWallet = await SmartContractWallet().deployed({
      address: walletAddress,
      deploymentHash: txHash,
    });

    return updatedWallet;
  }),
  getDefaultWalletDetail: protectedProcedure.query(async ({ ctx }) => {
    const wallet = await SmartContractWallet().getDefault({
      userId: ctx.session.user.id,
    });
    return wallet;
  }),
  getWalletDetails: protectedProcedure.query(({ ctx }) => {
    const { user } = ctx.session;
    // grab existing wallet details

    // return the wallet details
    return ctx.session;
  }),
  deployWallet: protectedProcedure.query(() => {
    //
    return "you can now see this secret message!";
  }),
});
