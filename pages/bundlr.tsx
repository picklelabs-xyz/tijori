import { useEffect } from "react";
import { useBundlr } from "../context/bundlr";

const Bundlr = () => {
  const { bundlr, initBundlr, balance, uploadFile, fundWallet } = useBundlr();

  const handle = async () => {
    if (bundlr) {
      //   const price = await bundlr.getPrice(1024);
      //   console.log(price);
      fundWallet(0.2);
    }
  };

  const handleTxn = async () => {
    if (bundlr) {
      uploadFile("hello world");
    }
  };

  useEffect(() => {
    if (!bundlr) {
      initBundlr();
    }
  }, []);

  return (
    <div>
      {balance && <div>Your balance : {balance}</div>}
      <button onClick={() => handle()}>Fund balance</button>
      <button onClick={() => handleTxn()}>Write Txn</button>
    </div>
  );
};

export default Bundlr;
