import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAccount, useNetwork } from "wagmi";
import ConnectWallet from "../components/ConnectWallet";
import Page from "../components/Layout/Page";
import useIsMounted from "../hooks/useIsMounted";
import { fetcher } from "../utils/fetcher";

const Contracts = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const { chain } = useNetwork();
  const path = `https://api.nftport.xyz/v0/accounts/contracts/${address}?chain=${chain?.name.toLowerCase()}&type=owns_contracts`;
  const { data, error } = useSWR(
    shouldFetch ? [path, "57192dd0-b371-45be-be04-add1a30fae1b"] : null,
    fetcher
  );
  console.log(data);

  useEffect(() => {
    if (isConnected && chain) {
      setShouldFetch(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, chain]);

  if (!isMounted) return null;

  if (!isConnected) return <ConnectWallet />;

  if (chain?.unsupported) return <>The selected chain is not supported!</>;

  if (error) return <>{error.message}</>;
  return (
    <Page>
      <h1 className=" flex justify-between items-center">
        <span className="text-2xl font-bold">My Collections</span>
      </h1>
      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12">
        {data?.contracts.map((contract: any) => (
          <div
            className="rounded shadow-md p-3 bg-white hover:bg-gray-100"
            key={contract.name}
          >
            <div>
              <Link href={`/collection/${contract.address}`}>
                <div className="h-40 bg-gray-400"></div>
                <div className="mt-5 text-sm text-slate-600">
                  {contract.symbol} - {contract.type}
                </div>
                <div className="mt-1 text-md">{contract.name}</div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};

export default Contracts;
