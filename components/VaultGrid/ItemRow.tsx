import { LockOpenIcon, PhotoIcon } from "@heroicons/react/24/outline";
import VaultItem from "../../types/VaultItem";
import axios from "axios";
import lit, { generateAccessControlConditions } from "../../utils/lit";
import { useState } from "react";
import ViewModal from "./ViewModal";

const ItemRow = ({ data }: { data: VaultItem }) => {
  const [imgUrl, setImgUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const unlockItem = async () => {
    setIsOpen(true);
    if (!imgUrl) {
      const response = await axios.get(`https://www.arweave.net/${data.txnId}`);
      const content = response.data;
      const abc = new Blob([Buffer.from(content, "hex")]);
      const final = await lit.decryptString(
        abc,
        data.encryptedKey,
        data.chain,
        JSON.parse(data.accessString)
      );
      const decyptedFileBuffer = Buffer.from(final.decryptedFile, "hex");
      const file = new File([decyptedFileBuffer], data.name, {
        type: data.fileMime,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (e) => {
        setImgUrl(fileReader.result as string);
      };
    }
  };

  return (
    <>
      <div
        className="flex flex-row p-3 items-center border-b border-gray-300 text-sm hover:bg-gray-200 cursor-pointer"
        onClick={() => unlockItem()}
      >
        <div className="basis-3/5">
          <PhotoIcon className="w-5 h-5 inline-block mr-4" />
          {data.name}
        </div>
        <div className="basis-1/5 text-right">{data.fileSize / 1000} kB</div>
        <div className="basis-1/5 text-right">
          {new Date(parseInt(data.timestamp)).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      <ViewModal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        imgUrl={imgUrl}
        loading={loading}
        title={data.name}
      />
    </>
  );
};

export default ItemRow;
