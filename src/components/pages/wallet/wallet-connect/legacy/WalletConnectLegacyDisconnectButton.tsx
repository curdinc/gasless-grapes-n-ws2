import { Button } from "@components/ui/input/Button";
import { walletConnectLegacySignClient } from "@utils/WalletConnect/walletConnectLegacyClient";
import { walletConnectStore } from "hooks/stores/useWalletConnectStore";

export const WalletConnectLegacyDisconnectButton = () => {
  return (
    <Button
      onClick={async () => {
        await walletConnectLegacySignClient?.killSession();
        walletConnectStore.setState({ currentSessionDetails: null });
      }}
      className="btn"
    >
      Disconnect
    </Button>
  );
};
