import { Collection } from "./../types/Collection";
import { NFTList } from "./../types/NFT";
import axios from "axios";
import { Fetcher } from "swr";
import NFT from "../types/NFT";
import { ethers } from "ethers";

export const fetcher = (url: string, token: string) =>
  axios.get(url, { headers: { Authorization: token } }).then((res) => res.data);

export const axiosFetcher = (
  url: string,
  method = "get",
  token: string,
  payload?: string
) =>
  axios({ method, url, headers: { Authorization: token }, data: payload }).then(
    (res) => res.data
  );

export const fetchNfts: Fetcher<NFTList> = async (url: string) => {
  const response = await axios.get(url);
  // console.log(response.data);
  const nfts: NFT[] = response.data.ownedNfts.map((item: any) =>
    mapApiResponse(item)
  );
  return {
    totalCount: response.data.totalCount,
    nfts: nfts,
  };
};

export const fetchNftMetdata: Fetcher<NFT> = async (url: string) => {
  const response = await axios.get(url);
  // console.log(response.data);
  return mapApiResponse(response.data);
};

const mapApiResponse = (item: any): NFT => {
  return {
    title: item.title,
    description: item.metadata.description,
    image: item.media[0].gateway,
    tokenId: ethers.BigNumber.from(item.id.tokenId).toString(),
    tokenStandard: item.contractMetadata.tokenType,
    collectionName: item.contractMetadata.name,
    contractAddress: item.contract.address,
    contractSymbol: item.contractMetadata.symbol,
  };
};
