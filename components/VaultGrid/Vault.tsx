import { useEffect, useState } from "react";
import {
  getTransactions,
  getTransactionsForContract,
} from "../../utils/graphql/queries/getUnlockable";
import {
  ArrowPathIcon,
  FaceFrownIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import VaultItem from "../../types/VaultItem";
import ItemRow from "./ItemRow";
import NFT from "../../types/NFT";
import VaultSkeleton from "../Elements/VaultSkeleton";

interface VaultProps {
  contractAddress: string;
  tokenId: string;
  chain: string;
}
const Vault = ({ contractAddress, chain, tokenId }: VaultProps) => {
  const [data, setData] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true);
    const response = await getTransactionsForContract(contractAddress);
    setData(response);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {loading && <VaultSkeleton />}

      {!loading && data.length == 0 && (
        <div className="h-60 mt-4 flex justify-center items-center bg-gray-100 text-center ">
          <div>
            <FaceFrownIcon className="w-10 h-10 inline-block text-teal-400" />
            <div className="text-xl font-semibold mt-1">No Locked Content!</div>
            <div className="mt-1">This NFT type has no unlockable content.</div>
          </div>
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="bg-gray-100 mt-6">
          <div className="font-semibold flex flex-row p-3 items-center bg-slate-300">
            <div className="basis-3/5">Name</div>
            <div className="basis-1/5 text-right">Size</div>
            <div className="basis-1/5 text-right">Date Added</div>
            <div>&nbsp;</div>
          </div>

          {data.map((item: VaultItem) => (
            <ItemRow data={item} key={item.timestamp} />
          ))}
        </div>
      )}
    </>
  );
};

export default Vault;
