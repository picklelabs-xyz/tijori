import Bundlr, { WebBundlr } from "@bundlr-network/client";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import lit, { generateAccessControlConditions } from "../utils/lit";
import { getWebBundlr, uploadData, uploadMetadata } from "../utils/bundlr";
import { ContractMethodNoResultError } from "wagmi";
import { blob } from "stream/consumers";

interface Props {
  contractAddress: string;
  tokenId: string;
}

const Upload = ({ contractAddress, tokenId }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [bundlr, setBundlr] = useState<WebBundlr | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const resetFileData = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    setFileData(null);
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const chain = "polygon";
    if (file && fileData && bundlr) {
      //encrypt data with lit
      const acessControlConditions = generateAccessControlConditions(
        contractAddress,
        chain,
        tokenId
      );

      const data = Buffer.from(fileData).toString("hex");

      const { encryptedFile, encryptedSymmetricKey } = await lit.enryptString(
        data,
        chain,
        acessControlConditions
      );

      const encryptedData = await encryptedFile.arrayBuffer();

      // // upload encypted file
      const result = await uploadData(bundlr, file, encryptedData);
      if (result.status) {
        console.log("https://arweave.net/" + result.txnId);
        resetFileData();
        // upload metadata
        const metadata = `{
          "contract_address" : "${contractAddress}",
          "token_id": "${tokenId}",
          "chain": "${chain}",
          "key": "${encryptedSymmetricKey}",
          "txn_id": "${result.txnId}"
        }`;
        const resp = await uploadMetadata(bundlr, JSON.parse(metadata));
        console.log("https://arweave.net/" + resp.txnId);
      }
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setFileData(Buffer.from(reader.result as ArrayBuffer));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const initBundlr = async () => {
    const bundlr = await getWebBundlr();
    setBundlr(bundlr);
  };

  useEffect(() => {
    initBundlr();
  }, []);

  return (
    <div className="">
      <div className="font-bold">Add Content</div>
      <form
        onSubmit={handleUpload}
        className="flex justify-between mt-2 border border-gray-400 p-2 items-center"
      >
        <input
          type="file"
          onChange={(e) => onFileChange(e)}
          ref={fileRef}
        ></input>
        <button type="submit" className="btn btn-blue xs">
          Upload
        </button>
      </form>
    </div>
  );
};

export default Upload;
