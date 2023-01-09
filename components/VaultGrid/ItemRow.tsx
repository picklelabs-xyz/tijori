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
    <div className="flex flex-row p-3 items-center border-b border-gray-300 text-sm hover:bg-gray-200 cursor-pointer">
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
  );
};

export default ItemRow;
