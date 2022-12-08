import { WebBundlr } from "@bundlr-network/client";
import { providers, utils } from "ethers";
import BigNumber from "bignumber.js";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface IBundlrContext {
  initBundlr: () => Promise<void>;
  fundWallet: (amount: number) => void;
  balance: string;
  uploadFile: (file: string) => Promise<any>;
  bundlr: WebBundlr | undefined;
}

const BundlrContext = createContext<IBundlrContext | undefined>(undefined);

const BundlrProvider = ({ children }: any) => {
  const [bundlr, setBundlr] = useState<WebBundlr>();
  const [balance, setBalance] = useState<string>("");

  useEffect(() => {
    if (bundlr) fetchBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundlr]);

  const initBundlr = async () => {
    const provider = new providers.Web3Provider(window.ethereum as any);
    await provider._ready();
    const bundlr = new WebBundlr(
      "https://devnet.bundlr.network",
      "matic",
      provider,
      {
        providerUrl: process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL,
      }
    );
    await bundlr.ready();
    setBundlr(bundlr);
  };

  const fundWallet = async (amount: number) => {
    if (bundlr && amount) {
      const amountParsed = new BigNumber(amount).multipliedBy(
        bundlr.currencyConfig.base[1]
      );
      if (amountParsed) {
        let response = await bundlr.fund(amountParsed);
        console.log("Wallet funded: ", response);
      }
      fetchBalance();
    }
  };

  async function fetchBalance() {
    if (bundlr) {
      const bal = await bundlr.getLoadedBalance();
      console.log("bal: ", utils.formatEther(bal.toString()));
      setBalance(utils.formatEther(bal.toString()));
    }
  }

  async function uploadFile(file: string) {
    try {
      let tx = await bundlr?.uploader.uploadData(file);
      console.log(tx);
      return tx;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  return (
    <BundlrContext.Provider
      value={{
        initBundlr,
        fundWallet,
        balance,
        uploadFile,
        bundlr,
      }}
    >
      {children}
    </BundlrContext.Provider>
  );
};

const useBundlr = () => {
  const context = useContext(BundlrContext);
  if (context === undefined) {
    throw new Error("useBundlr must be used within BundlrProvider");
  }
  return context;
};

export { useBundlr, BundlrProvider };
