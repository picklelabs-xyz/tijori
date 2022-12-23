import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import useSWR from "swr";
import { useNetwork } from "wagmi";
import { fetcher } from "../../utils/fetcher";
import Vault from "../../components/VaultGrid/Vault";
import { PlusIcon } from "@heroicons/react/24/outline";
import Modal from "../../components/Lock/Modal";

const NftDetail = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  console.log(router.query);
  const { nft } = router.query;
  const { chain } = useNetwork();
  const baseUrl = chain?.rpcUrls.default;
  const path = `${baseUrl}/getNFTMetadata/?contractAddress=${nft?.[0]}&tokenId=${nft?.[1]}`;
  const { data, error } = useSWR(shouldFetch ? path : null, fetcher);
  // console.log(data);

  useEffect(() => {
    if (router.isReady) {
      //set nft details
      setShouldFetch(true);
    }
  }, [router.isReady]);

  if (!chain) {
    return <div>Please connect wallet</div>;
  }

  return (
    <>
      {!data && <div>Loading...</div>}
      {data && (
        <div>
          <div className="flex gap-8">
            <div className="basis-1/2">
              <img src={data.media[0].gateway} alt={data.title} />
            </div>
            <div className="basis-1/2">
              <h1 className="text-2xl font-bold">{data.title}</h1>
              <div className="my-6">
                <ReactMarkdown>{data.description}</ReactMarkdown>
              </div>

              <div className="flex justify-between mt-4 items-center">
                <div className="font-bold text-lg">Vault</div>
                <button
                  className="btn btn-blue text-sm flex items-center"
                  onClick={() => setIsOpen(true)}
                >
                  <PlusIcon className="w-4 h-4 mr-2 inline-block" />
                  <span>Add Item</span>
                </button>
              </div>
              <Vault />
              <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                contractAddress={nft?.[0]}
                tokenId={nft?.[1]}
                chain={chain?.name}
              />
            </div>
          </div>

          <div className="flex gap-8 mt-16">
            <div className="basis-1/2">
              <h2 className="text-lg font-bold">Traits</h2>
              <div className="flex gap-4 flex-wrap mt-3">
                {!data.metadata.attributes && <div>No traits present.</div>}
                {data.metadata.attributes &&
                  data.metadata.attributes
                    .filter((item: any) => item.trait_type != undefined)
                    .map((item: any) => (
                      <div
                        key={item.trait_type}
                        className="rounded-md bg-indigo-200 p-4 text-center"
                      >
                        <div className="uppercase text-xs text-indigo-600">
                          {item.trait_type}
                        </div>
                        <div className="text-sm mt-1">{item.value}</div>
                      </div>
                    ))}
              </div>
            </div>

            <div className="basis-1/2">
              <h2 className="text-lg font-bold">Details</h2>
              <div className="mt-3">
                <span className="font-semibold mr-2">Contract Name:</span>
                <span>{data.contractMetadata.name}</span>
              </div>
              <div className="mt-3">
                <span className="font-semibold mr-2">Contract Symbol:</span>
                <span>{data.contractMetadata.symbol}</span>
              </div>
              <div className="mt-3">
                <span className="font-semibold mr-2">Token Type:</span>
                <span>{data.contractMetadata.tokenType}</span>
              </div>
              <div className="mt-3">
                <span className="font-semibold mr-2">Total Supply:</span>
                <span>{data.contractMetadata.totalSupply}</span>
              </div>
              <div className="mt-3">
                <span className="font-semibold mr-2">Address:</span>
                <span>{data.contract.address}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NftDetail;
