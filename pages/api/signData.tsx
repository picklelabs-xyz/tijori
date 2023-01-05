import type { NextApiRequest, NextApiResponse } from "next";
import Bundlr from "@bundlr-network/client/";
import { getServerBundlr } from "./getPresignedHash";

const signData = async (req: NextApiRequest, res: NextApiResponse) => {
  const serverBundlr = await getServerBundlr();
  const data = Buffer.from(req.body.data, "hex");
  try {
    const signedData = Buffer.from(
      await serverBundlr.currencyConfig.sign(data)
    ).toString("hex");
    console.log(signedData);
    res.status(200).json({ signedData });
  } catch (error) {
    console.log("serversigning error", error);
    res.status(500).json({ msg: error });
  }
};

export default signData;
