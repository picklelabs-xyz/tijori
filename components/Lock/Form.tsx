import { WebBundlr } from "@bundlr-network/client";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import lit, { generateAccessControlConditions } from "../../utils/lit";
import useForm from "../../hooks/useForm";
import { getWebBundlr, uploadData } from "../../utils/bundlr";
import Metadata from "../../types/Metadata";
import Button from "../Elements/Button";

interface FormProps {
  //Check how can we inforce lowercase strings via typescript
  chain: string;
  contractAddress: string;
  tokenId: string;
  tokenType: "ERC721" | "ERC1155";
}

const Form = ({ chain, contractAddress, tokenId, tokenType }: FormProps) => {
  // const [name, setName] = useState("");
  // const [description, setDescription] = useState("");
  // const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string | null>(null);
  const [bundlr, setBundlr] = useState<WebBundlr | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { formData, handleInputChange, handleSubmit, resetForm, errors } =
    useForm(
      {
        name: "",
        description: "",
        file: "",
      },
      (formData) => handleUpload()
    );

  const { name, description, file }: any = formData;

  useEffect(() => {
    if (file) {
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
  }, [file]);

  const handleUpload = async () => {
    setUploading(true);

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
        setUploading(false);

        if (result.txnId) {
          console.log("https://arweave.net/" + result.txnId);
          resetForm();
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
        setUploading(false);
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
          <p className="text-red-500 italic font-extralight">
            {errors.file && errors.file}
          </p>
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
          <p className="text-red-500 italic font-extralight">
            {errors.name && errors.name}
          </p>
        </div>
        <div>
          <label className="text-gray-700">Description</label>
          <textarea
            name="description"
            className="w-full mt-1 bg-gray-50 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-200 align-top"
            onChange={handleInputChange}
            value={description}
          ></textarea>
          <p className="text-red-500 italic font-extralight">
            {errors.description && errors.description}
          </p>
        </div>
        <Button type="submit" loading={uploading} />
      </form>
    </div>
  );
};

export default Form;
