import { useEffect, useState } from "react";
import { getTransactions } from "../../utils/graphql/queries/getUnlockable";
import { PhotoIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import VaultItem from "../../types/VaultItem";
import ItemRow from "./ItemRow";

const Vault = () => {
  const [data, setData] = useState<null | []>(null);
  useEffect(() => {
    getTransactions("0x55a8dbe6f191b370885d01e30cb7d36d0fa99f16", "12143");
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
