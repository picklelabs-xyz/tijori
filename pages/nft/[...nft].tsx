import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import useSWR from "swr";
import { useNetwork } from "wagmi";
import Upload from "../../components/Upload";
import { fetcher } from "../../utils/fetcher";
import { getBaseUrl } from "../../utils/nft";
import Vault from "../../components/VaultGrid/Vault";

const NftDetail = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const router = useRouter();
  const { nft } = router.query;
  const { chain } = useNetwork();

  const baseUrl = getBaseUrl(chain?.id);
  const path = `${baseUrl}/getNFTMetadata/?contractAddress=${nft?.[0]}&tokenId=${nft?.[1]}`;
  const { data, error } = useSWR(shouldFetch ? path : null, fetcher);
  console.log(data);

  useEffect(() => {
    if (router.isReady) {
      setShouldFetch(true);
    }
  }, [router.isReady]);

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

              <div className="mt-4">
                <Upload
                  contractAddress={data.contract.address as string}
                  tokenId={nft?.[1] as string}
                />
              </div>
              <div className="mt-4 font-bold">Unlockable Content</div>
              <Vault />
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
