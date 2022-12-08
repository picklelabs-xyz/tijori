import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { WagmiConfig, createClient, configureChains, chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ALCHEMY_API_KEY } from "../constants";
import { BundlrProvider } from "../context/bundlr";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon, chain.mainnet, chain.polygonMumbai],
  [alchemyProvider({ apiKey: ALCHEMY_API_KEY }), publicProvider()]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains: chains,
      // options: {
      //   shimDisconnect: true,
      //   UNSTABLE_shimOnConnectSelectAccount: true,
      // },
    }),
  ],
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <BundlrProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </BundlrProvider>
    </WagmiConfig>
  );
}
