import { useCallback, useState } from "react";
import { SiweMessage } from "siwe";
import { useSignMessage } from "wagmi";
import Cookies from "js-cookie";
import axios from "axios";

const useSiwe = () => {
  const [loading, setLoading] = useState(false);
  const { signMessageAsync } = useSignMessage();

  const login = useCallback(
    async ({ address, chainId }: { address: string; chainId: number }) => {
      setLoading(true);

      //get nonce
      const nonceResponse = await axios.get(
        `http://localhost:5003/api/nonce/${address}`
      );
      const nonce = nonceResponse.data.data.nonce;

      console.log(nonceResponse);

      if (nonce) {
        //Prepare message
        const message = new SiweMessage({
          domain: "http://localhost",
          address,
          statement: "Sign in with Ethereum to the app.",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce,
        });

        //Sign Message
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        const verifyResponse = await axios.post(
          "http://localhost:5003/api/verify",
          JSON.stringify({ message, signature }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // verify & store token in cookie
        const token = await verifyResponse.data.token;
        if (token) {
          Cookies.set("TIJORI_AUTH", token);
        }
      }

      setLoading(false);
    },
    [signMessageAsync]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    //do any api call if required
    Cookies.remove("TIJORI_AUTH");
    setLoading(false);
  }, []);

  return { loading, login, logout };
};

export default useSiwe;
