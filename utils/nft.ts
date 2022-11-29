import {
  ALCHEMY_API_KEY,
  ALCHMEY_ETH_ENDPOINT,
  ALCHMEY_POLYGON_ENDPOINT,
} from "../constants";

export const convertIpfsUrl = (url: string) => {
  if (url.substring(0, 4) == "ipfs") {
    const ipfsString = url.substring(7);
    return "https://ipfs.io/ipfs/" + ipfsString;
  }

  return url;
};

export const getBaseUrl = (chainId: number | undefined): string => {
  const apiKey = ALCHEMY_API_KEY;
  let baseUrl = "";
  switch (chainId) {
    case 1:
      baseUrl = ALCHMEY_ETH_ENDPOINT + apiKey;
      break;
    case 137:
      baseUrl = ALCHMEY_POLYGON_ENDPOINT + apiKey;
      break;
    default:
      break;
  }

  return baseUrl;
};
