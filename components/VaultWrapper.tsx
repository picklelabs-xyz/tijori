import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { useState } from "react";
import NFT from "../types/NFT";
import { FormProps } from "./Lock/Form";
import Modal from "./Lock/Modal";
import Vault from "./VaultGrid/Vault";

const VaultWrapper = (props: FormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex justify-between mt-6 items-end">
        <div className="font-bold text-xl">NFT Vault</div>
        <button
          className="btn btn-blue text-sm flex items-center"
          onClick={() => setIsOpen(true)}
        >
          <PlusIcon className="w-4 h-4 mr-2 inline-block" />
          <span>Add Item</span>
        </button>
      </div>
      <Vault
        chain={props.chain}
        contractAddress={props.contractAddress}
        tokenId={props.tokenId as string}
      />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} {...props} />
    </>
  );
};

export default VaultWrapper;
