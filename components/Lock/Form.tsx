import { WebBundlr } from "@bundlr-network/client";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import lit, { generateAccessControlConditions } from "../../utils/lit";
import { getWebBundlr, uploadData, uploadMetadata } from "../../utils/bundlr";
import Metadata from "../../types/Metadata";

interface FormProps {
  //Check how can we inforce lowercase strings via typescript
  chain: string;
  contractAddress: string;
  tokenId: string;
  tokenType: "ERC721" | "ERC1155";
}

const Form = ({ chain, contractAddress, tokenId, tokenType }: FormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string | null>(null);
  const [bundlr, setBundlr] = useState<WebBundlr | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    setFileData(null);
    setName("");
    setDescription("");
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file && fileData && bundlr) {
      //encrypt data with lit
      const acessControlConditions = generateAccessControlConditions(
        contractAddress,
        tokenType,
        chain,
        tokenId
      );

      const { encryptedFile, encryptedSymmetricKey } = await lit.enryptString(
        fileData,
        chain,
        acessControlConditions
      );

      const encryptedData = Buffer.from(
        await encryptedFile.arrayBuffer()
      ).toString("hex");

      try {
        const metadata: Metadata = {
          name: name,
          description: description,
          fileMime: file.type,
          fileSize: file.size,
          contractAddress,
          tokenId,
          tokenType,
          chain,
          encryptedKey: encryptedSymmetricKey,
          accessString: JSON.stringify(acessControlConditions),
          createdAt: Date.now(),
        };
        const result = await uploadData(bundlr, encryptedData, metadata);
        if (result.txnId) {
          console.log("https://arweave.net/" + result.txnId);
          resetForm();
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
          setFileData(
            Buffer.from(reader.result as ArrayBuffer).toString("hex")
          );
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
