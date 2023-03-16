import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import useIsMounted from "../../hooks/useIsMounted";
import useSignIn from "../../hooks/useSignIn";
import Account from "./Account";

const signIn = async (address: string, chainId: number) => {};

const WalletConnector = () => {
  // const { setTrigger } = useSignIn({
  //   address: "0xAD000BD0abFf98408578F3Ee3f3E3dF0751D0642",
  //   chainId: 121,
  // });

  const [loginTrigger, setLoginTrigger] = useState(false);
  const { setTrigger } = useSignIn();

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect({
      onSuccess(data) {
        //trigger login
        setTrigger(true);
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
