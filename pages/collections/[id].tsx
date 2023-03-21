import Link from "next/link";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";
import Page from "../../components/Layout/Page";
import VaultWrapper from "../../components/VaultWrapper";
import useContractApi from "../../hooks/useContractApi";

const CollectionDetail = () => {
  const router = useRouter();
  const { chain } = useNetwork();
  const { id: contractAddress } = router.query;
  const { data, error } = useContractApi(contractAddress as string);

  return (
    <Page>
      <div>
        <div className="text-sm text-gray-700 flex gap-2">
          <Link href="/collections">
            <span>Home</span>
          </Link>
          <span>&#62;</span>
          <span>Collection Name</span>
        </div>

        <div className="md:flex md:gap-16 mt-6">
          <div className="md:basis-1/3">
            <div className="shadow-sm bg-gray-100 rounded p-4 text-sm">
              <h2 className="text-lg font-semibold border-b-2 pb-2">
                Collection Details
              </h2>
              <div className="mt-4 flex justify-between">
                <span className="font-semibold">Name</span>
                <span>{data ? data.contract.name : ""}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="font-semibold">Symbol</span>
                <span>{data?.contract.symbol}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="font-semibold">Token Standard</span>
                <span>{data ? data.contract.type : ""}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="font-semibold">Total Supply</span>
                <span>{data ? data.total : ""}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="font-semibold">Address</span>
                <Link href="#" className="text-blue-900" target="_blank">
                  <span>0x5c1b087f9ef7d6ad38a33c3bbb360ae50cffcad0</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="md:basis-2/3">
            <h1 className="text-2xl font-bold mt-6 md:mt-0">Collection Name</h1>
            <div className="mt-2">
              Content uploaded at the contract level will be available for NFTs
              of this collection.
            </div>
            {chain && contractAddress && (
              <VaultWrapper
                chain={chain.name}
                contractAddress={contractAddress as string}
                tokenStandard="ERC721"
              />
            )}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default CollectionDetail;
function useEffect(arg0: () => void, arg1: boolean[]) {
  throw new Error("Function not implemented.");
}
