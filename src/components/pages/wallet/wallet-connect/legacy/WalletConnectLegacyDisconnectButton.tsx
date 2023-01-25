import { Button } from "@components/ui/input/Button";
import { walletConnectLegacySignClient } from "@utils/WalletConnect/walletConnectLegacyClient";
import { userWalletStore } from "hooks/stores/useWalletConnectStore";

export const WalletConnectLegacyDisconnectButton = () => {
  return (
    <Button
      onClick={async () => {
        userWalletStore.setState({ currentSessionDetails: null });
        await walletConnectLegacySignClient?.killSession();
      }}
      className="btn"
    >
      Disconnect
    </Button>
  );
};
