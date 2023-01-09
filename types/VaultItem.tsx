export default interface VaultItem {
  txnId: string;
  name: string;
  encryptedKey: string;
  accessString: string;
  fileSize: number;
  fileMime: string;
  chain: string;
  contractAddress: string;
  timestamp: string;
}
