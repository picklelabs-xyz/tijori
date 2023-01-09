export default interface Metadata {
  name: string;
  description?: string;
  fileMime: string;
  fileSize: number;
  contractAddress: string;
  tokenId: string;
  chain: string;
  encryptedKey: string;
  arweaveTxnId: string;
  createdAt: number;
  accessString: string;
}
