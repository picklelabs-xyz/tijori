import {
  ALCHEMY_API_KEY,
  ALCHMEY_ETH_ENDPOINT,
  ALCHMEY_POLYGON_ENDPOINT,
  ALCHMEY_POLYGON_MUM_ENDPOINT,
} from "../constants";

export const convertIpfsUrl = (url: string) => {
  if (url.substring(0, 4) == "ipfs") {
    const ipfsString = url.substring(7);
    return "https://ipfs.io/ipfs/" + ipfsString;
  }

  return url;
};
