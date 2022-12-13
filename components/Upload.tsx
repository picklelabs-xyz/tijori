import Bundlr, { WebBundlr } from "@bundlr-network/client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import lit, { generateAccessControlConditions } from "../utils/lit";
import { getWebBundlr, uploadData } from "../utils/bundlr";

const Upload = (contractAddress: string, tokenId: string) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [bundlr, setBundlr] = useState<WebBundlr | null>(null);

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file && fileData && bundlr) {
      const result = await uploadData(bundlr, file, fileData);
      setFile(null);
      setFileData(null);
      console.log(result);
      console.log("https://arweave.net/" + result.txnId);
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
    <div>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => onFileChange(e)}></input>
        <div className="mt-2">
          <button type="submit" className="btn btn-blue xs">
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
