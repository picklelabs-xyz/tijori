import { WebBundlr } from "@bundlr-network/client";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import lit, { generateAccessControlConditions } from "../../utils/lit";
import { getWebBundlr, uploadData, uploadMetadata } from "../../utils/bundlr";
import useForm from "../../hooks/useForm";

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
 * 0. Add access key controls to file metadata
 * 1. Upload button animation
 * 2. Form validation errors and improve form inputs informations like upload size and supported file types
 * 3. Ability to switch between upload file and text box for voucher type information
 * **/
const Form = ({ chain, contractAddress, tokenId }: FormProps) => {
  // const [name, setName] = useState("");
  // const [description, setDescription] = useState("");
  // const [file, setFile] = useState<File | null>(null);
  const [bundlr, setBundlr] = useState<WebBundlr | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    formData,
    fileData,
    setFileData,
    handleInputChange,
    handleSubmit,
    errors,
  } = useForm(
    {
      name: "",
      description: "",
      file: "",
    },
    (formData) => console.log(formData, errors)
  );

  const { name, description, file }: any = formData;

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
        "ERC1155",
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

  const initBundlr = async () => {
    const bundlr = await getWebBundlr();
    setBundlr(bundlr);
  };

  useEffect(() => {
    initBundlr();
  }, []);

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div>
          <label className="text-gray-700">Upload File</label>
          <input
            name="file"
            type="file"
            onChange={handleInputChange}
            className="w-full mt-1 form-input bg-gray-50  border-gray-200 focus:ring-0 focus:border-blue-100"
            ref={fileRef}
          />
          <p className="text-red-500">{errors.file && errors.file}</p>
        </div>
        <div>
          <label className="text-gray-700">Name</label>
          <input
            name="name"
            type="text"
            className="w-full mt-1 bg-gray-50 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-200"
            value={name}
            onChange={handleInputChange}
          />
          <p className="text-red-500">{errors.name && errors.name}</p>
        </div>
        <div>
          <label className="text-gray-700">Description</label>
          <textarea
            name="description"
            className="w-full mt-1 bg-gray-50 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-200 align-top"
            onChange={handleInputChange}
            value={description}
          ></textarea>
          <p className="text-red-500">
            {errors.description && errors.description}
          </p>
        </div>

        <button type="submit" className="btn btn-blue xs">
          Upload
        </button>
      </form>
    </div>
  );
};

export default Form;
