import { LockOpenIcon, PhotoIcon } from "@heroicons/react/24/outline";
import VaultItem from "../../types/VaultItem";
import axios from "axios";
import lit, { generateAccessControlConditions } from "../../utils/lit";
import { useState } from "react";

//TODO: check if we can do typechecking basis other key value pa
const ItemRow = ({ data }: { data: VaultItem }) => {
  const [img, setImg] = useState();
  const unlockItem = async () => {
    // const response = await axios.get(
    //   `https://www.arweave.net/${data?.arweaveTxnId}`
    // );
    // const content = response.data;
    // const contractAddress = "0x2a0af90bd2c470750a4a42d87bfdfaee7c6d4e4a";
    // const chain = "polygon";
    // const tokenId = "2";
    // const acessControlConditions = generateAccessControlConditions(
    //   contractAddress,
    //   "ERC1155",
    //   chain,
    //   tokenId
    // );
    // const abc = new Blob([Buffer.from(content, "hex")]);
    // const final = await lit.decryptString(
    //   abc,
    //   data?.encryptedKey,
    //   chain,
    //   acessControlConditions
    // );
    // const decyptedFileBuffer = Buffer.from(final.decryptedFile, "hex");
    // const file = new File([decyptedFileBuffer], "unlocked file ", {
    //   type: "image/png",
    // });
    // const fileReader = new FileReader();
    // fileReader.readAsDataURL(file);
    // fileReader.onload = (e) => {
    //   const url = fileReader.result;
    //   setImg(url);
    //   // console.log();
    // };
    // console.log(file);
    // var url = URL.createObjectURL(blob);
    // console.log(url);
  };

  return (
    <div className="flex flex-row p-3 gap-4 items-center border-b border-gray-300 text-sm">
      <div className="basis-auto">
        <PhotoIcon className="w-5 h-5" />
      </div>
      <div className="basis-1/3">{data.name}</div>
      <div className="basis-1/3">{data.fileSize / 1000} KB</div>
      <div className="basis-1/3">
        {new Date(parseInt(data.timestamp)).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <div className="basis-auto">
        <LockOpenIcon
          className="w-5 h-5 text-purple-500 cursor-pointer"
          onClick={() => unlockItem()}
        />
      </div>
      <div>{/* <img src={img} alt="preview" /> */}</div>
    </div>
  );
};

export default ItemRow;
