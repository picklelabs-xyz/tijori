import Skeleton from "react-loading-skeleton";

const CardSkeleton = ({ count: length }: { count: number }) => {
  const loadCards = Array(length).fill(1);
  return (
    <>
      {loadCards.map((val, i) => (
        <div className="rounded shadow-md p-3 bg-white" key={i}>
          <div>
            <Skeleton count={1} height={300} />
          </div>
          <div className="mt-5">
            <Skeleton count={1} height={10} />
          </div>
          <Skeleton count={1} height={10} />
        </div>
      ))}
    </>
  );
};

export default CardSkeleton;
