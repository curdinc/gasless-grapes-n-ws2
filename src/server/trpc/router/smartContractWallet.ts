import { SmartContractWallet } from "@server/db/modals/smartContractWallet";
import { makeId } from "@utils/randomId";
import { ethers } from "ethers";
import { log } from "next-axiom";
import { protectedProcedure, router } from "../trpc";

export const smartContractWalletRouter = router({
  createNewWalletDetail: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;
    const provider = ethers.getDefaultProvider(
      "https://goerli.gateway.tenderly.co/7AoXEydPiJqHkTAB9KWSiu"
    );
    const walletAddressInterface = new ethers.utils.Interface([
      "function calcWalletAddress(bytes32 _salt) external view returns(address)",
    ]);
    const salt = ethers.utils.formatBytes32String(makeId(31));
    log.info("Creating wallet for user", { salt, userId: user.id });
    const result = await provider.call({
      to: "0x0110Be7Ad7a0f534D25808E9146B3a4d8F79f7d7",
      data: walletAddressInterface.encodeFunctionData("calcWalletAddress", [
        salt,
      ]),
    });
    const value = walletAddressInterface.decodeFunctionResult(
      "calcWalletAddress",
      result
    )[0];

    // store the wallet address and the hash used to generate the particular address
    return await SmartContractWallet().createDefaultWallet({
      address: value,
      userId: user.id,
      walletSalt: salt,
    });
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
