import { useEffect, useState } from "react";
import { getTransactions } from "../../utils/graphql/queries/getUnlockable";
import {
  PhotoIcon,
  LockOpenIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import VaultItem from "../../types/VaultItem";
import ItemRow from "./ItemRow";
import NFT from "../../types/NFT";

interface VaultProps {
  nft: NFT;
  chain: string;
}
const Vault = ({ nft, chain }: VaultProps) => {
  const [data, setData] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true);
    const response = await getTransactions(nft.contractAddress, nft.tokenId);
    setData(response);
    setLoading(false);
  };
  console.log(data);
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {loading && (
        <div className="h-60 mt-6 bg-gray-100 flex justify-center items-center">
          <ArrowPathIcon className="w-10 h-10 animate-spin" />
        </div>
      )}

      {!loading && data.length == 0 && (
        <div className="h-60 mt-4 flex justify-center items-center bg-gray-100 text-center">
          <div>
            <div className="text-xl font-semibold">No Locked Content!</div>
            <div className="mt-1">
              This NFT doesnot contain unlockable content.
            </div>
          </div>
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="bg-gray-100">
          <div className="font-semibold flex flex-row p-3 gap-4 items-center bg-slate-300 mt-6">
            <div className="basis-auto">&nbsp;</div>
            <div className="basis-1/3">Name</div>
            <div className="basis-1/3">Size</div>
            <div className="basis-1/3">Creation Date</div>
            <div className="basis-auto">&nbsp;</div>
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
