export const convertIpfsUrl = (url: string) => {
  if (url.substring(0, 4) == "ipfs") {
    const ipfsString = url.substring(7);
    return "https://ipfs.io/ipfs/" + ipfsString;
  }

  return url;
};
