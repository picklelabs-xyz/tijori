export default interface VaultItem {
  txnId: string;
  name: string;
  encryptedKey: string;
  accessString: string;
  fileSize: number;
  fileMime: string;
  timestamp: string;
}
