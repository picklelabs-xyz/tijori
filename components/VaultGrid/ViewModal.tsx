import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
interface LocalModalProps {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
  loading: boolean;
  imgUrl: string;
  title: string;
}
const ViewModal = ({
  isOpen,
  setIsOpen,
  loading,
  imgUrl,
  title,
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-gray-900 text-right pb-4 flex items-center justify-between"
                  ></Dialog.Title>
                  <div className="flex justify-center items-center">
                    {!imgUrl && (
                      <ArrowPathIcon className="w-10 h-10 animate-spin" />
                    )}
                    {imgUrl && <img src={imgUrl} alt={title} />}
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

export default ViewModal;
