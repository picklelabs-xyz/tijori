import { useEffect, useState } from "react";
import { getTransactions } from "../../utils/graphql/queries/getUnlockable";
import { PhotoIcon, LockOpenIcon } from "@heroicons/react/24/outline";
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
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {loading && (
        <div className="mt-1 h-52 flex items-center justify-center border border-gray-400">
          No locked content found
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="border border-purple-200 text-center mt-2">
          <ItemRow isHeader={true} />
          {data.map((item: VaultItem) => (
            <ItemRow data={item} key={item.timestamp} />
          ))}
        </div>
      )}
    </>
  );
};

export default Vault;
