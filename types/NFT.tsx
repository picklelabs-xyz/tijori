export default interface NFT {
  title: string;
  description: string;
  image: string;
  tokenId: string;
  tokenStandard: "ERC721" | "ERC1155";
  collectionName: string;
  contractAddress: string;
  contractSymbol: string;
}

export interface NFTList {
  totalCount: number;
  nfts: NFT[];
}
