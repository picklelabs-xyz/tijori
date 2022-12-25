import { ethers, utils } from "ethers";
import { parseBytes32String } from "ethers/lib/utils.js";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAccount, useNetwork } from "wagmi";
import useIsMounted from "../hooks/useIsMounted";
import { fetcher } from "../utils/fetcher";

const NFT = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const { chain } = useNetwork();
  const baseUrl = chain?.rpcUrls.default;
  const path = `${baseUrl}/getNFTs/?owner=${address}`;
  // +
  //"&excludeFilters[]=SPAM&excludeFilters[]=AIRDROPS";
  const { data, error } = useSWR(shouldFetch ? path : null, fetcher);
  console.log(data);

  useEffect(() => {
    if (isConnected && chain) {
      setShouldFetch(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, chain]);

  if (!isMounted) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">MY NFTS</h1>
      {!isConnected && (
        <div className="mt-2">Please connect your wallet to view your NFTs</div>
      )}

      {isConnected && !data && <div>Loading...</div>}

      <div className="mt-5 flex flex-wrap -mx-6">
        {data &&
          data.ownedNfts.map((nft: any) => (
            <div className="md:basis-1/4" key={nft.id.tokenId}>
              <div className="p-6">
                <Link
                  href={`/nft/${nft.contract.address}/${ethers.BigNumber.from(
                    nft.id.tokenId
                  ).toString()}`}
                >
                  <img
                    src={nft.media[0].gateway}
                    alt={nft.metadata.name}
                    className="w-full object-contain aspect-square"
                  />
                  <div className="mt-2 text-sm">{nft.title}</div>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NFT;
