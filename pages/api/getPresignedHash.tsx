import type { NextApiRequest, NextApiResponse } from "next";
import Bundlr from "@bundlr-network/client/";
import { BUNDLR_MAINNET } from "../../constants";

export const getServerBundlr = async (): Promise<Bundlr> => {
  const key = process.env.NEXT_PUBLIC_BUNDLR_KEY;
  const serverBundlr = new Bundlr(
    BUNDLR_MAINNET.bundlrNetwork,
    BUNDLR_MAINNET.currency,
    BUNDLR_MAINNET.pk
  );
  await serverBundlr.ready();

  return serverBundlr;
};

const signingMsj = "sign this message to connect to Bundlr.Network";

const presignedHash = async (req: NextApiRequest, res: NextApiResponse) => {
  const serverBundlr = await getServerBundlr();
  const hash = await serverBundlr.currencyConfig.sign(signingMsj as any);
  const presignedHash = Buffer.from(hash).toString("hex");
  res.status(200).json({ presignedHash });
};

export default presignedHash;
