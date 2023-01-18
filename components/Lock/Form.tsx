import { WebBundlr } from "@bundlr-network/client";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import lit, { generateAccessControlConditions } from "../../utils/lit";
import useForm from "../../hooks/useForm";
import { getWebBundlr, uploadData } from "../../utils/bundlr";
import Metadata from "../../types/Metadata";
import Button from "../Elements/Button";
import Input from "../Elements/Input";

interface FormProps {
  //Check how can we inforce lowercase strings via typescript
  chain: string;
  contractAddress: string;
  tokenId: string;
  tokenType: "ERC721" | "ERC1155";
}

type InputFields = {
  name: string;
  description: string;
  file: File | null;
};

const initialState: InputFields = {
  name: "",
  description: "",
  file: null,
};

const Form = ({ chain, contractAddress, tokenId, tokenType }: FormProps) => {
  const [fileData, setFileData] = useState<string | null>(null);
  const [bundlr, setBundlr] = useState<WebBundlr | null>(null);
  const [uploading, setUploading] = useState(false);

  const { formData, handleInputChange, handleSubmit, resetForm, errors } =
    useForm<InputFields>(initialState, () => handleUpload());

  const { name, description, file } = formData;

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
          <Input
            name="file"
            type="file"
            onChange={handleInputChange}
            error={errors.file}
          />
        </div>
        <div>
          <label className="text-gray-700">Name</label>
          <Input
            name="name"
            type="text"
            value={name}
            onChange={handleInputChange}
            error={errors.name}
          />
        </div>
        <div>
          <label className="text-gray-700">Description</label>
          <Input
            name="description"
            type="textarea"
            onChange={handleInputChange}
            value={description}
            error={errors.description}
          />
        </div>
        {/* {console.log("errors", errors)} */}
        <Button type="submit" loading={uploading} />
      </form>
    </div>
  );
};

export default Form;
