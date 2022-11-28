import { ethers, utils } from "ethers";
import { parseBytes32String } from "ethers/lib/utils.js";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAccount } from "wagmi";
import { fetcher } from "../utils/fetcher";
import { convertIpfsUrl } from "../utils/nft";

const NFT = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { address, isConnected } = useAccount();
  const apiUrl =
    `${process.env.NEXT_PUBLIC_POLY_URL}/getNFTs/?owner=${address}` +
    "&excludeFilters[]=SPAM";
  const { data, error } = useSWR(shouldFetch ? apiUrl : null, fetcher);

  useEffect(() => {
    if (address) {
      setShouldFetch(true);
    }
  }, [isConnected]);

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
                    src={convertIpfsUrl(nft.metadata.image)}
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
