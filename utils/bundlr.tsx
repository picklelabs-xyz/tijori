import Bundlr, { WebBundlr } from "@bundlr-network/client/";
import { BUNDLR_DEV } from "../constants";

//used for api signing
export const getServerBundlr = async (): Promise<Bundlr> => {
  const key = process.env.NEXT_PUBLIC_BUNDLR_KEY;
  const serverBundlr = new Bundlr(
    BUNDLR_DEV.bundlrNetwork,
    BUNDLR_DEV.currency,
    BUNDLR_DEV.pk
  );
  await serverBundlr.ready();

  return serverBundlr;
};

//client side code
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
    BUNDLR_DEV.bundlrNetwork,
    BUNDLR_DEV.currency,
    provider
  );
  await bundlr.ready();
  console.log("bundlr ready:", bundlr.address);
  return bundlr;
};

export const uploadData = async (
  bundlr: WebBundlr,
  file: File,
  fileData: Uint8Array
) => {
  const tags = [
    { name: "Content-Type", value: file.type },
    { name: "File", value: file.name },
    { name: "App-Name", value: "la3-unlock" },
    { name: "App-version", value: "1.0" },
  ];

  const txn = bundlr.createTransaction(fileData, { tags });
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
