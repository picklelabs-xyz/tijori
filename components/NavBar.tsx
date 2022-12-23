import Link from "next/link";
import NetworkSelector from "./Wallet/NetworkSelector";
import WalletConnector from "./Wallet/WalletConnector";

const NavBar = () => {
  return (
    <header className="border-b-2 border-b-gray-100 py-4 px-6 text-lg ">
      <div className="container m-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">LA3 UNLOCK</Link>
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
          <NetworkSelector />
          <WalletConnector />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
