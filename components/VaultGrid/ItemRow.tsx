import { LockOpenIcon, PhotoIcon } from "@heroicons/react/24/outline";
import VaultItem from "../../types/VaultItem";

//TODO: check if we can do typechecking basis other key value pa
const ItemRow = (params: { isHeader?: boolean; data?: VaultItem }) => {
  const { isHeader = false, data } = params;
  const unlockItem = () => {
    return;
  };

  return (
    <div
      className={`${
        isHeader ? "font-semibold" : "text-sm"
      } flex flex-row p-3 gap-4 items-center even:bg-slate-200 odd:bg-slate-300 `}
    >
      <div className="basis-auto">
        {isHeader ? "\u00A0" : <PhotoIcon className="w-5 h-5" />}
      </div>
      <div className="basis-1/3">{isHeader ? "FileName" : data?.name}</div>
      <div className="basis-1/3">{isHeader ? "Size" : data?.fileSize}</div>
      <div className="basis-1/3">
        {isHeader ? "Creation Date" : data?.timestamp}
      </div>
      <div className="basis-auto">
        {isHeader ? (
          "\u00A0"
        ) : (
          <LockOpenIcon
            className="w-5 h-5 text-purple-500 cursor-pointer"
            onClick={() => unlockItem}
          />
        )}
      </div>
    </div>
  );
};

export default ItemRow;
