import Link from "next/link";
import Wallet from "./Wallet";

const NavBar = () => {
  return (
    <header className="border-b-2 border-b-gray-100 py-4 px-6 text-lg ">
      <div className="container m-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          {" "}
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
        <Wallet />
      </div>
    </header>
  );
};

export default NavBar;
