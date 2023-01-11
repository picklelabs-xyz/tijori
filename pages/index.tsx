import { WalletIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAccount, useNetwork } from "wagmi";
import ConnectWallet from "../components/ConnectWallet";
import useIsMounted from "../hooks/useIsMounted";
import NFT from "../types/NFT";
import { fetchNfts } from "../utils/fetcher";
import Page from "../components/Layout/Page";

const Card = ({ nft }: { nft: NFT }) => {
  return (
    <div className="rounded shadow-md p-3 bg-white hover:bg-gray-100">
      <div>
        <Link href={`/nft/${nft.contractAddress}/${nft.tokenId}`}>
          <img
            src={nft.image}
            alt={nft.title}
            className="w-full object-contain aspect-square"
          />
          <div className="mt-5 text-sm text-slate-600">
            {nft.collectionName}
          </div>
          <div className="mt-1 text-md">{nft.title}</div>
        </Link>
      </div>
    </div>
  );
};

const IndexPage = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const { chain } = useNetwork();
  const baseUrl = chain?.rpcUrls.default;
  const path = `${baseUrl}/getNFTs/?owner=${address}`;
  // +"&excludeFilters[]=SPAM&excludeFilters[]=AIRDROPS";
  const { data, error } = useSWR(shouldFetch ? path : null, fetchNfts);
  // console.log(data);

  useEffect(() => {
    if (isConnected && chain) {
      setShouldFetch(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, chain]);

  if (!isMounted) return null;

  if (!isConnected) return <ConnectWallet />;

  if (chain?.unsupported) return <>The selected chain is not supported!</>;

  return (
    <Page>
      <h1 className=" flex justify-between items-center">
        <span className="text-2xl font-bold">MY NFTS</span>
        {data && (
          <span className="text-sm text-slate-500">
            Total Count: {data.totalCount}
          </span>
        )}
      </h1>
      {!data && <div>Loading...</div>}
      {data && (
        <div className="mt-6 grid grid-cols-4 gap-8 gap-y-12">
          {data.nfts.map((nft) => (
            <Card nft={nft} key={nft.tokenId} />
          ))}
        </div>
      )}
    </Page>
  );
};

export default IndexPage;
