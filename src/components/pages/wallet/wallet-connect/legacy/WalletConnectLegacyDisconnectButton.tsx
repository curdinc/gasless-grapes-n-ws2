import { Button } from "@components/ui/input/Button";
import { deleteCachedLegacySession } from "@utils/WalletConnect/walletConnectLegacyClient";

export const WalletConnectLegacyDisconnectButton = () => {
  return (
    <Button
      onClick={() => {
        deleteCachedLegacySession();
      }}
      className="btn"
    >
      Disconnect
    </Button>
  );
};
