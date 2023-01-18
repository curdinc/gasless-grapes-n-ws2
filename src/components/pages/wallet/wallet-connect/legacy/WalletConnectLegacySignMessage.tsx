import { Button } from "@components/ui/input/Button";
import { walletConnectLegacySignClient } from "@utils/WalletConnect/walletConnectLegacyClient";
import { WebAuthnUtils } from "@utils/webAuthn";
import type { IClientMeta } from "@walletconnect/legacy-types";
import { getSdkError } from "@walletconnect/utils";
import { utils } from "ethers";
import { userWalletStore } from "hooks/stores/useWalletConnectStore";
import { WalletConnectProjectInfo } from "../WalletConnectProjectInfo";

export type WalletConnectLegacySignMessageProps = {
  projectDetails: IClientMeta;
  transactionDetails: { id: number; method: string; params: any[] };
};

/**
 * Converts hex to utf8 string if it is valid bytes
 */
export function convertHexToUtf8(value: string) {
  if (utils.isHexString(value)) {
    return utils.toUtf8String(value);
  }

  return value;
}

/**
 * Gets message from various signing request methods by filtering out
 * a value that is not an address (thus is a message).
 * If it is a hex string, it gets converted to utf8 string
 */
export function getSignParamsMessage(params: string[]) {
  const message = params.filter((p) => !utils.isAddress(p))[0];
  if (!message) {
    return "";
  }
  return convertHexToUtf8(message);
}

export const WalletConnectLegacySignMessage = (
  props: WalletConnectLegacySignMessageProps
) => {
  const { closeWalletConnectModal: closeModal, user } =
    userWalletStore.getState();
  const message = getSignParamsMessage(props.transactionDetails.params);

  const onApprove = async () => {
    console.log("signing message");
    console.log("user", user);
    const wallet = WebAuthnUtils.getAssociatedEoaWallet({
      userId: user.id,
      chainId: 1,
      deviceName: user.currentDeviceName,
    });
    if (!wallet) {
      return;
    }
    const signedMessage = await wallet.signMessage(
      getSignParamsMessage(transactionDetails.params)
    );
    console.log("signedMessage", signedMessage);
    walletConnectLegacySignClient.approveRequest({
      id: transactionDetails.id,
      jsonrpc: "2.0",
      result: signedMessage,
    });

    closeModal();
  };
  const onReject = () => {
    walletConnectLegacySignClient.rejectRequest({
      id: transactionDetails.id,
      jsonrpc: "2.0",
      error: {
        message: getSdkError("USER_REJECTED_METHODS").message,
      },
    });
    closeModal();
  };
  userWalletStore.setState({ onReject });

  const { projectDetails, transactionDetails } = props;
  return (
    <div className="px-10">
      <div>
        <WalletConnectProjectInfo {...projectDetails} />
      </div>
      <div className="mt-5 whitespace-pre-wrap">{message}</div>
      <div className="mt-5 flex-row justify-end">
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
