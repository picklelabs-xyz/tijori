import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";

type Params = {
  address: string;
  chainId: number;
};

const useSignIn = () => {
  const [trigger, setTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nonce, setNonce] = useState(null);
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();

  //TODO: wrap the functon is useCallback and add depenency on useEffect
  const login = async () => {
    setLoading(true);

    if (address) {
      // check if not signedIn
      const serverNonceRes = await fetch(
        `http://localhost:5003/api/nonce/${address}`
      );
      const serverNonce = await serverNonceRes.json();

      const nonce = serverNonce.data.nonce;
      if (nonce) {
        const message = new SiweMessage({
          domain: window.location.host,
          address: address,
          statement: "Sign in with Ethereum to the app.",
          uri: window.location.origin,
          version: "1",
          chainId: 129,
          nonce,
        });

        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        const serverVerifyRes = await fetch(
          "http://localhost:5003/api/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message, signature }),
          }
        );
      }
      // verify & store token in cookie
      setIsLoggedIn(true);
    }

    setLoading(false);
    setTrigger(false);
  };

  const logout = async () => {
    setLoading(true);
    //remove token from cookie
    setLoading(false);
  };

  useEffect(() => {
    if (trigger) {
      login();
    }
  }, [trigger]);

  return { setTrigger, isLoggedIn, logout };
};

export default useSignIn;
