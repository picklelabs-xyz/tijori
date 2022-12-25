import { WebBundlr } from "@bundlr-network/client/";
import { Metadata } from "../components/Lock/Form";
import { BUNDLR_MAINNET } from "../constants";

interface Tag {
  name: string;
  value: any;
}
interface UploadResponse {
  status: boolean;
  txnId?: string;
}

export const getWebBundlr = async () => {
  const result = await fetch("/api/getPresignedHash", { method: "GET" });
  const data = await result.json();
  const presignedHash = Buffer.from(data.presignedHash, "hex");
  const provider = {
    getSigner: () => {
      return {
        signMessage: () => {
          return presignedHash;
        },
      };
    },
  };
  const bundlr = new WebBundlr(
    BUNDLR_MAINNET.bundlrNetwork,
    BUNDLR_MAINNET.currency,
    provider
  );
  await bundlr.ready();
  console.log("bundlr ready:", bundlr.address);
  return bundlr;
};

// Default app tags for all type of uploads
const defaultTags: Tag[] = [
  { name: "App-Name", value: "la3-unlock" },
  { name: "App-version", value: "1.0-alpha" },
];

// Function to upload encrypted data
export const uploadData = async (
  bundlr: WebBundlr,
  encryptedData: string,
  file?: File
): Promise<{ status: boolean; txnId?: string }> => {
  let tags = defaultTags.concat([
    { name: "Content-Type", value: "application/octet-stream" },
  ]);

  if (file) {
    tags = [{ name: "mime", value: file.type }, ...tags];
  }

  return await upload(bundlr, encryptedData, tags);
};

// Function to upload unlock metadata
export const uploadMetadata = async (
  bundlr: WebBundlr,
  metadata: Metadata
): Promise<{ status: boolean; txnId?: string }> => {
  let tags = defaultTags.concat([
    { name: "Content-Type", value: "application/json" },
    { name: "Name", value: metadata.name },
    { name: "ContractAddress", value: metadata.contractAddress },
    { name: "Chain", value: metadata.chain },
    { name: "TokenId", value: metadata.tokenId },
    { name: "EncryptedKey", value: metadata.encryptedKey },
    { name: "ArweaveTxnId", value: metadata.arweaveTxnId },
    { name: "CreatedAt", value: metadata.createdAt },
  ]);

  if (metadata.description) {
    tags = [{ name: "Description", value: metadata.description }, ...tags];
  }

  const resp = await upload(bundlr, JSON.stringify(metadata), tags);
  return resp;
};

const upload = async (
  bundlr: WebBundlr,
  data: string,
  tags?: Tag[]
): Promise<UploadResponse> => {
  const txn = bundlr.createTransaction(data, { tags });
  const signatureData = await txn.getSignatureData();
  try {
    const result = await fetch("/api/signData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: Buffer.from(signatureData).toString("hex"),
      }),
    });

    const response = await result.json();
    const signed = Buffer.from(response.signedData, "hex");
    txn.setSignature(signed);
    const res = await txn.upload();
    console.log("res", res);
    return { status: true, txnId: res.id };
  } catch (error) {
    console.log("Error", error);
    return { status: false };
  }
};
