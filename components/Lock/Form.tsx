import { WebBundlr } from "@bundlr-network/client";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import lit, { generateAccessControlConditions } from "../../utils/lit";
import { getWebBundlr, uploadData, uploadMetadata } from "../../utils/bundlr";

interface FormProps {
  chain: string;
  contractAddress: string;
  tokenId: string;
}
export interface Metadata {
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
}

/** TODO:
 * 1. Upload button animation
 * 2. Form validation errors and improve form inputs informations like upload size and supported file types
 * 3. Ability to switch between upload file and text box for voucher type information
 * **/
const Form = ({ chain, contractAddress, tokenId }: FormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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

      const encryptedData = Buffer.from(
        await encryptedFile.arrayBuffer()
      ).toString("hex");

      try {
        // upload encypted file
        const result = await uploadData(bundlr, encryptedData, file);
        if (result.txnId) {
          console.log("https://arweave.net/" + result.txnId);
          resetFileData();
          // upload metadata
          const metadata: Metadata = {
            name: name,
            description: description,
            fileMime: file.type,
            fileSize: file.size,
            contractAddress,
            tokenId,
            chain,
            encryptedKey: encryptedSymmetricKey,
            arweaveTxnId: result.txnId,
            createdAt: Date.now(),
          };
          const resp = await uploadMetadata(bundlr, metadata);
          console.log("https://arweave.net/" + resp.txnId);
        }
      } catch (error) {
        console.log(error);
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
      <form onSubmit={handleUpload} className="grid grid-cols-1 gap-6">
        <div>
          <label className="text-gray-700">Upload File</label>
          <input
            type="file"
            onChange={(e) => onFileChange(e)}
            className="w-full mt-1 form-input bg-gray-50  border-gray-200 focus:ring-0 focus:border-blue-100"
            ref={fileRef}
          />
        </div>
        <div>
          <label className="text-gray-700">Name</label>
          <input
            type="text"
            className="w-full mt-1 bg-gray-50 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-gray-700">Description</label>
          <textarea
            className="w-full mt-1 bg-gray-50 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-200"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-blue xs">
          Upload
        </button>
      </form>
    </div>
  );
};

export default Form;
