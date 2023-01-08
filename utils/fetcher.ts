import { NFTList } from "./../types/NFT";
import axios from "axios";
import { Fetcher } from "swr";
import NFT from "../types/NFT";
import { ethers } from "ethers";

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const fetchNfts: Fetcher<NFTList> = async (url: string) => {
  const response = await axios.get(url);
  //   console.log(response.data);
  const nfts = mapApiResponse(response.data);
  return {
    totalCount: response.data.totalCount,
    nfts: nfts,
  };
};

const mapApiResponse = (data: any): NFT[] => {
  const nftArray = data.ownedNfts.map((item: any): NFT => {
    return {
      title: item.title,
      description: item.description,
      image: item.media[0].gateway,
      tokenId: ethers.BigNumber.from(item.id.tokenId).toString(),
      tokenType: item.contractMetadata.tokenType,
      collectionName: item.contractMetadata.name,
      contractAddress: item.contract.address,
      contractSymbol: item.contractMetadata.symbol,
    };
  });

  return nftArray;
};
