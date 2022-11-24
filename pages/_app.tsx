import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
  chain,
} from "wagmi";

import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon],
  [
    alchemyProvider({ apiKey: "prqWcfSyPSAAwGl5i3GW_YaHfIxxSlHw" }),
    publicProvider(),
  ]
);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains: [chain.polygon],
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
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WagmiConfig>
  );
}
