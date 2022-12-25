import { useEffect, useState } from "react";
import { getTransactions } from "../../utils/graphql/queries/getUnlockable";
import { PhotoIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import VaultItem from "../../types/VaultItem";
import ItemRow from "./ItemRow";

interface VaultProps {
  contractAddress: string;
  tokenId: string;
  chain: string;
}
const Vault = ({ contractAddress, tokenId, chain }: VaultProps) => {
  const [data, setData] = useState<null | VaultItem[]>(null);
  const getData = async () => {
    const resp = await getTransactions(contractAddress, tokenId);
    setData(resp);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {!data && (
        <div className="mt-1 h-52 flex items-center justify-center border border-gray-400">
          No locked content found
        </div>
      )}

      {data && (
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
