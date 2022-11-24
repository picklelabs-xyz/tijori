import { Popover, Transition } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

const Account = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div>
      <Popover className="relative text-sm">
        <Popover.Button className="inline-flex items-center">
          <UserCircleIcon className="w-6 h-6 mr-1" />
          <span> {address?.replace(address.substring(6, 37), ".....")}</span>
        </Popover.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Popover.Panel className="absolute z-10 mt-2 w-full text-sm rounded-md bg-white drop-shadow-lg divide-y">
            <div
              className="p-4 flex items-center gap-2 cursor-pointer"
              onClick={() => disconnect()}
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              <span>Logout </span>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
};

const Wallet = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { isConnected } = useAccount();
  const [_isConnected, _setIsConnected] = useState(false);

  useEffect(() => {
    _setIsConnected(isConnected);
  }, [isConnected]);

  if (_isConnected) {
    return <Account />;
  }

  return (
    <div>
      {!_isConnected &&
        connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="text-sm btn btn-blue"
          >
            Connect {connector.name}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}
          </button>
        ))}
    </div>
  );
};

export default Wallet;
