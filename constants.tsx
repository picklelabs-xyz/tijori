export const ALCHEMY_API_KEY: string =
  process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? "demo";

export const ALCHMEY_ETH_ENDPOINT: string =
  "https://eth-mainnet.g.alchemy.com/v2/";

export const ALCHMEY_POLYGON_ENDPOINT: string =
  "https://polygon-mainnet.g.alchemy.com/v2/";

export const ALCHMEY_POLYGON_MUM_ENDPOINT: string =
  "https://polygon-mumbai.g.alchemy.com/v2/";

export const BUNDLR_DEV = {
  currency: "matic",
  pk: process.env.NEXT_PUBLIC_MATIC_KEY,
  providerLink: ALCHMEY_POLYGON_MUM_ENDPOINT,
  bundlrNetwork: "https://devnet.bundlr.network",
};

export const BUNDLR_MAINNET = {
  currency: "matic",
  pk: process.env.NEXT_PUBLIC_MATIC_KEY,
  providerLink: ALCHMEY_POLYGON_ENDPOINT,
  bundlrNetwork: "https://node2.bundlr.network",
};

export const ARWEAVE_GRAPH_ENDPOINT = "https://www.arweave.net/graphql";
