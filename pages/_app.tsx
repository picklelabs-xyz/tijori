import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { WagmiConfig, createClient, configureChains, chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const apiKey: string = process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? "demo";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon, chain.mainnet],
  [alchemyProvider({ apiKey: apiKey }), publicProvider()]
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
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WagmiConfig>
  );
}
