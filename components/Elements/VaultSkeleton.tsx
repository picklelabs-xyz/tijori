import Skeleton from "react-loading-skeleton";

const VaultSkeleton = () => {
  return (
    <>
      <div className="mt-6">
        <Skeleton count={1} height={45} />
        <Skeleton count={1} height={45} />
        <Skeleton count={1} height={45} />
        <Skeleton count={1} height={45} />
        <Skeleton count={1} height={45} />
      </div>
    </>
  );
};

export default VaultSkeleton;
