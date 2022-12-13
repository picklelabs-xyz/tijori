import type { NextApiRequest, NextApiResponse } from "next";
import { getServerBundlr } from "../../utils/bundlr";

const signingMsj = "sign this message to connect to Bundlr.Network";

const presignedHash = async (req: NextApiRequest, res: NextApiResponse) => {
  const serverBundlr = await getServerBundlr();
  const hash = await serverBundlr.currencyConfig.sign(signingMsj as any);
  const presignedHash = Buffer.from(hash).toString("hex");
  res.status(200).json({ presignedHash });
};

export default presignedHash;
