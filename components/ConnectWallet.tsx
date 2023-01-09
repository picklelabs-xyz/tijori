import { WalletIcon } from "@heroicons/react/24/outline";

const ConnectWallet = () => {
  return (
    <div className="mt-40 flex flex-col items-center">
      <WalletIcon className="w-40 h-40" />
      <div className="text-xl font-semibold">Connect your wallet</div>
    </div>
  );
};

export default ConnectWallet;
