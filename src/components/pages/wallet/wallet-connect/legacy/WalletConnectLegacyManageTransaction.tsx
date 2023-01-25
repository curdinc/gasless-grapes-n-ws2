import { Button } from "@components/ui/input/Button";
import type { TransactionRequest } from "@ethersproject/abstract-provider";
import { Blockchain } from "@utils/blockchain";
import { ErrorMessages } from "@utils/messages";
import { vanillaTrpcClient } from "@utils/trpc";
import { walletConnectLegacySignClient } from "@utils/WalletConnect/walletConnectLegacyClient";
import { WebAuthnUtils } from "@utils/webAuthn";
import type { IClientMeta } from "@walletconnect/legacy-types";
import { getSdkError } from "@walletconnect/utils";
import { randomBytes } from "crypto";
import { BigNumber } from "ethers";
import { userWalletStore } from "hooks/stores/useWalletConnectStore";
import { WalletConnectLegacyTransactionSchema } from "types/schema/blockchain/walletConnect";
import { WalletConnectProjectInfo } from "../WalletConnectProjectInfo";

export type WalletConnectLegacyManageTransactionProps = {
  projectDetails: IClientMeta;
  transactionDetails: { id: number; method: string; params: unknown[] };
  isSendTransaction: boolean;
};
export const WalletConnectLegacyManageTransaction = (
  props: WalletConnectLegacyManageTransactionProps
) => {
  const { projectDetails, transactionDetails, isSendTransaction } = props;
  const {
    closeWalletConnectModal,
    currentChainId,
    smartContractWalletDetails,
  } = userWalletStore.getState();
  const onApprove = async () => {
    const wallet = await WebAuthnUtils.getAssociatedEoaWallet({
      chainId: currentChainId,
    });
    if (!wallet) {
      throw new Error(ErrorMessages.missingEoaWallet);
    }
    const transactionPayload = WalletConnectLegacyTransactionSchema.parse(
      transactionDetails.params[0]
    );
    let result: string;
    if (props.isSendTransaction) {
      const wallet = await WebAuthnUtils.getAssociatedEoaWallet({
        chainId: currentChainId,
      });
      if (!wallet) {
        throw new Error(ErrorMessages.missingEoaWallet);
      }
      if (!smartContractWalletDetails?.address) {
        throw new Error(ErrorMessages.missingSmartContractWalletDetails);
      }
      const nonce = BigNumber.from(
        `0x${Buffer.from(randomBytes(32)).toString("hex")}`
      );
      const signature = await wallet.signMessage(
        Blockchain.getSmartContractParamToSign(
          nonce,
          BigNumber.from(0),
          transactionPayload.to,
          BigNumber.from(transactionPayload.value),
          transactionPayload.data
        )
      );
      const transaction =
        await vanillaTrpcClient.smartContractWallet.sendTransaction.mutate({
          chain: Blockchain.chainIdToName(currentChainId),
          signature,
          transaction: transactionPayload,
          walletAddress: smartContractWalletDetails.address,
          nonce: nonce.toString(),
        });
      result = transaction.txHash || "";
    } else {
      result = await wallet.signTransaction(
        transactionDetails.params[0] as TransactionRequest
      );
    }
    walletConnectLegacySignClient.approveRequest({
      id: transactionDetails.id,
      jsonrpc: "2.0",
      result,
    });
    closeWalletConnectModal();
  };
  const onReject = () => {
    walletConnectLegacySignClient.rejectRequest({
      id: transactionDetails.id,
      jsonrpc: "2.0",
      error: {
        message: getSdkError("USER_REJECTED_METHODS").message,
      },
    });
    closeWalletConnectModal();
  };
  userWalletStore.setState({ onReject });

  return (
    <div>
      <div>
        <WalletConnectProjectInfo {...projectDetails} />
      </div>
      <div className="m-4">
        {isSendTransaction
          ? "Approve the following transaction?"
          : "Sign the following transaction?"}
        <pre className="mt-3">
          {JSON.stringify(transactionDetails.params[0], null, 2)}
        </pre>
      </div>
      <div className="mt-3 flex-row justify-end">
        <Button
          className="btn mr-3 bg-neutral-600"
          onClick={() => {
            onReject();
          }}
        >
          Reject
        </Button>
        <Button
          className="btn"
          onClick={() => {
            onApprove();
          }}
        >
          Approve
        </Button>
      </div>
    </div>
  );
};
