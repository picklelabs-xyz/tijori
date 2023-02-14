export default interface Metadata {
  name: string;
  description?: string;
  fileMime: string;
  fileSize: number;
  contractAddress: string;
  tokenId?: string;
  tokenStandard: string;
  chain: string;
  encryptedKey: string;
  accessString: string;
  createdAt: number;
}
