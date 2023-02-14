import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import NFT from "../../types/NFT";
import UploadForm, { FormProps } from "./Form";

interface LocalModalProps extends FormProps {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
}

const Modal = ({ isOpen, setIsOpen, ...props }: LocalModalProps) => {
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
                    <div>Add Unlockable Item</div>
                    <XMarkIcon
                      className="w-5 h-5 inline cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    ></XMarkIcon>
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="text-sm text-gray-500 py-4">
                      <UploadForm
                        contractAddress={props.contractAddress}
                        tokenId={props.tokenId}
                        chain={props.chain.toLowerCase()}
                        tokenStandard={props.tokenStandard}
                      />
                    </div>
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

export default Modal;
