import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import useSWR from "swr";
import { useNetwork } from "wagmi";
import { fetchNftMetdata } from "../../utils/fetcher";
import Vault from "../../components/VaultGrid/Vault";
import { PlusIcon } from "@heroicons/react/24/outline";
import Modal from "../../components/Lock/Modal";
import useIsMounted from "../../hooks/useIsMounted";
import Link from "next/link";
import ConnectWallet from "../../components/ConnectWallet";

const NftDetail = () => {
  const isMounted = useIsMounted();
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { chain } = useNetwork();
  const router = useRouter();
  const { nft } = router.query;
  const contractAddress = nft?.[0] as string;
  const tokenId = nft?.[1] as string;

  const baseUrl = chain?.rpcUrls.default;
  const path = `${baseUrl}/getNFTMetadata/?contractAddress=${contractAddress}&tokenId=${tokenId}`;
  const { data, error } = useSWR(shouldFetch ? path : null, fetchNftMetdata);
  // console.log(data);

  useEffect(() => {
    if (router.isReady && chain) {
      setShouldFetch(true);
    }
  }, [router.isReady, chain]);

  if (!isMounted) return null;

  if (!chain) {
    return <ConnectWallet />;
  }

  return (
    <>
      {!data && <div>Loading...</div>}
      {data && (
        <div>
          <div className="text-sm text-gray-700 flex gap-2">
            <Link href="/">
              <span>Home</span>
            </Link>
            <span>&#62;</span>
            <span>{data.title}</span>
          </div>
          <div className="flex gap-12 mt-6">
            <div className="basis-1/3">
              <div className="rounded shadow-sm bg-gray-100 p-4">
                <img src={data.image} alt={data.title} className="m-auto" />
              </div>
              <div className="mt-4 shadow-sm bg-gray-100 rounded p-4 text-sm">
                <h2 className="text-lg font-semibold border-b-2 pb-2">
                  Contract Details
                </h2>
                <div className="mt-4 flex justify-between">
                  <span className="font-semibold">Name</span>
                  <span>{data.collectionName}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="font-semibold">Symbol</span>
                  <span>{data.contractSymbol}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="font-semibold">Type</span>
                  <span>{data.tokenType}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="font-semibold">Address</span>
                  <span>{data.contractAddress}</span>
                </div>
              </div>
            </div>

            <div className="basis-2/3">
              <h1 className="text-2xl font-bold">{data.title}</h1>
              <div className="mt-2">
                <ReactMarkdown>{data.description}</ReactMarkdown>
              </div>

              <div className="flex justify-between mt-6 items-center">
                <div className="font-bold text-lg">Unlockables</div>
                <button
                  className="btn btn-blue text-sm flex items-center"
                  onClick={() => setIsOpen(true)}
                >
                  <PlusIcon className="w-4 h-4 mr-2 inline-block" />
                  <span>Add Item</span>
                </button>
              </div>
              <Vault nft={data} chain={chain.name} />
              <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                nft={data}
                chain={chain.name}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default NftDetail;
