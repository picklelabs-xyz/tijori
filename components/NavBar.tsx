import { Listbox } from "@headlessui/react";
import Link from "next/link";
import { useNetwork, useSwitchNetwork } from "wagmi";
import Wallet from "./Wallet";

const NavBar = () => {
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();

  // console.log(chain);

  return (
    <header className="border-b-2 border-b-gray-100 py-4 px-6 text-lg ">
      <div className="container m-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">LA3 Studio</Link>
        </h1>
        <div className="flex text-slate-600 text-sm">
          <div className="mr-10 ">
            <Link href="/nfts">My NFTS</Link>
          </div>
          <div>
            <Link href="/nfts">Upgrade NFT</Link>
          </div>
        </div>

        <div className="flex text-sm items-center">
          {chain && (
            <div className="mr-sm relative">
              <Listbox value={chain?.name} as="div" className="mr-10">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 px-4 text-left shadow-md sm:text-sm">
                  {chain && chain.name}
                </Listbox.Button>
                <Listbox.Options className="pointer absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {chains.map((x) => (
                    <Listbox.Option
                      key={x.id}
                      value={x.name}
                      className="relative cursor-default select-none px-4 py-2"
                      disabled={!switchNetwork || x.id === chain?.id}
                      onClick={() => switchNetwork?.(x.id)}
                    >
                      {x && x.name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
          )}
          <Wallet />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
