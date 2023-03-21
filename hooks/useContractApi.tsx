import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAccount, useNetwork } from "wagmi";
import { fetcher } from "../utils/fetcher";

const useContractApi = (contractAddress: string) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const url = `https://api.nftport.xyz/v0/nfts/${contractAddress}`;
  const path = `${url}?chain=${chain?.name.toLowerCase()}`;

  const { data, error } = useSWR(
    shouldFetch ? [path, "57192dd0-b371-45be-be04-add1a30fae1b"] : null,
    fetcher
  );

  useEffect(() => {
    if (isConnected && chain) {
      setShouldFetch(true);
    }
  }, [isConnected, chain]);

  return { data, error };
};

export default useContractApi;
