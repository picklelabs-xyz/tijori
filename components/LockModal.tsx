import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import Upload from "./Upload";

interface LocalModalProps {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
  contractAddress: string;
  tokenId: string;
  chain: string;
}
const LockModal = ({
  isOpen,
  setIsOpen,
  contractAddress,
  tokenId,
  chain,
}: LocalModalProps) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-90" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-gray-900 text-center border-b-2 pb-4 flex items-center justify-between"
                  >
                    <div></div>
                    <div>Add Unlockable Item</div>
                    <XMarkIcon
                      className="w-5 h-5 inline cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    ></XMarkIcon>
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 py-4">
                      <Upload
                        contractAddress={contractAddress}
                        tokenId={tokenId}
                        chain={chain}
                      />
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default LockModal;
