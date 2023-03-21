import Link from "next/link";
import NetworkSelector from "./Wallet/NetworkSelector";
import WalletConnector from "./Wallet/WalletConnector";

const NavBar = () => {
  return (
    <header className="border-b-2 border-b-gray-100 py-4 px-6 text-lg ">
      <div className="container m-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">TIJORI</Link>
        </h1>
        <div className="flex gap-12 text-sm font-semibold tracking-widest">
          <Link href="/collections">
            <div>COLLECTIONS</div>
          </Link>
          <Link href="/">
            <div>NFT</div>
          </Link>
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
