import Bundlr, { WebBundlr } from "@bundlr-network/client";
import { ChangeEvent, useEffect, useState } from "react";
import { toString } from "uint8arrays/to-string";
import lit, { generateAccessControlConditions } from "../utils/lit";
import { providers, utils } from "ethers";
import { useBundlr } from "../context/bundlr";

const Upload = (contractAddress: string, tokenId: string) => {
  const [file, setFile] = useState<string | null>(null);
  const { bundlr, initBundlr, balance, uploadFile, fundWallet } = useBundlr();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!bundlr) {
      initBundlr();
    }
    if (file && bundlr) {
      // encrypt file content using lit, returns encrypted file content
      // const accessControlConditions = generateAccessControlConditions(
      //   contractAddress,
      //   "ethereum",
      //   tokenId
      // );
      // const encrypted = await lit.enryptString(
      //   file,
      //   "ethereum",
      //   accessControlConditions
      // );
      // console.log(encrypted);
      // const price = await bundlr.getPrice("hello".length);
      // console.log(price.toNumber());
      // uploadFile("hello");
      // upload encrypted file in storage - arweave/ipfs, stores encrypted filecontent and file with nft details for encrypted contente
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(files[0]);
      reader.onloadend = () => {
        const result = new Uint8Array(reader.result as ArrayBuffer);
        setFile(toString(result));
      };
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => onFileChange(e)}></input>
      <div className="mt-2">
        <button
          type="button"
          className="btn btn-blue xs"
          onClick={(e) => handleUpload(e)}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default Upload;
