import { useAccount, useConnect, useDisconnect } from "wagmi";
import useIsMounted from "../../hooks/useIsMounted";
import Account from "./Account";

const WalletConnector = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { isConnected } = useAccount();
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  if (isConnected) {
    return <Account />;
  }

  return (
    <div>
      {!isConnected &&
        connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="text-sm btn btn-blue"
          >
            Connect {connector.name}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}
          </button>
        ))}
    </div>
  );
};

export default WalletConnector;
