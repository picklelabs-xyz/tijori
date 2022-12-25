import { LockOpenIcon, PhotoIcon } from "@heroicons/react/24/outline";
import VaultItem from "../../types/VaultItem";
import axios from "axios";
import lit, { generateAccessControlConditions } from "../../utils/lit";
import { useState } from "react";

//TODO: check if we can do typechecking basis other key value pa
const ItemRow = (params: { isHeader?: boolean; data?: VaultItem }) => {
  const { isHeader = false, data } = params;
  const [img, setImg] = useState(null);
  const unlockItem = async () => {
    const response = await axios.get(
      `https://www.arweave.net/${data?.arweaveTxnId}`
    );
    const content = response.data;
    const contractAddress = "0x55a8dbe6f191b370885d01e30cb7d36d0fa99f16";
    const chain = "polygon";
    const tokenId = "12144";
    const acessControlConditions = generateAccessControlConditions(
      contractAddress,
      chain,
      tokenId
    );

    const abc = new Blob([Buffer.from(content, "hex")]);

    const final = await lit.decryptString(
      abc,
      data?.encryptedKey,
      chain,
      acessControlConditions
    );

    const decyptedFileBuffer = Buffer.from(final.decryptedFile, "hex");
    const file = new File([decyptedFileBuffer], "unlocked file ", {
      type: "image/png",
    });
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      const url = fileReader.result;
      setImg(url);
      // console.log();
    };
    console.log(file);
    // var url = URL.createObjectURL(blob);
    // console.log(url);
  };

  return (
    <div
      className={`${
        isHeader ? "font-semibold" : "text-sm"
      } flex flex-row p-3 gap-4 items-center even:bg-slate-200 odd:bg-slate-300 `}
    >
      <div className="basis-auto">
        {isHeader ? "\u00A0" : <PhotoIcon className="w-5 h-5" />}
      </div>
      <div className="basis-1/3">{isHeader ? "FileName" : data?.name}</div>
      <div className="basis-1/3">{isHeader ? "Size" : data?.fileSize}</div>
      <div className="basis-1/3">
        {isHeader ? "Creation Date" : data?.timestamp}
      </div>
      <div className="basis-auto">
        {isHeader ? (
          "\u00A0"
        ) : (
          <LockOpenIcon
            className="w-5 h-5 text-purple-500 cursor-pointer"
            onClick={() => unlockItem()}
          />
        )}
      </div>
      <div>
        <img src={img} alt="preview" />
      </div>
    </div>
  );
};

export default ItemRow;
