export default interface VaultItem {
  name: string;
  description?: string;
  encryptedKey: string;
  fileSize: number;
  arweaveTxnId: string;
  timestamp: string;
}
