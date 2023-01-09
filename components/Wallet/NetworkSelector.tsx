import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import React, { Fragment } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import useIsMounted from "../../hooks/useIsMounted";

//TODO: Add network logos
const NetworkSelector = () => {
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <>
      {chain && (
        <div className="mr-sm relative">
          <Listbox value={chain?.name} as="div" className="mr-10">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 px-4 text-left shadow-md sm:text-sm flex items-center gap-2">
              {chain.unsupported && (
                <>
                  <ExclamationTriangleIcon className="w-5 h-5 inline text-red-500" />
                  <span className="text-red-500">Unsupported</span>
                </>
              )}
              {!chain.unsupported && (
                <>
                  <img
                    src={`/chains/${chain.name.toLowerCase()}.svg`}
                    className="inline w-5 h-5"
                    alt={`${chain.name} logo`}
                  />
                  <span>{chain.name}</span>
                </>
              )}
            </Listbox.Button>

            <Listbox.Options className="pointer absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {chains.map((x) => (
                <Listbox.Option
                  key={x.id}
                  value={x.name}
                  className={({ active }) =>
                    `relative select-none py-2 pl-10 cursor-pointer ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  disabled={!switchNetwork || x.id === chain.id}
                  onClick={() => switchNetwork?.(x.id)}
                >
                  {({ selected }) => (
                    <>
                      <span> {x.name}</span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
      )}
    </>
  );
};

export default NetworkSelector;
