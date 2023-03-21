import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import useIsMounted from "../../hooks/useIsMounted";
import useSiwe from "../../hooks/useSiwe";
import Account from "./Account";

const signIn = async (address: string, chainId: number) => {};

const WalletConnector = () => {
  const { login } = useSiwe();

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect({
      onSuccess(data) {
        login({ address: data.account, chainId: data.chain.id });
      },
    });
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
