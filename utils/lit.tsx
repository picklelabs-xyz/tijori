import * as LitJsSdk from "lit-js-sdk";

const client = new LitJsSdk.LitNodeClient({
  litNetwork: "serrano",
});

// access rules with owner of nft
export const generateAccessControlConditions = (
  contractAddress: string,
  chain: string,
  tokenId: string
) => {
  return [
    {
      contractAddress,
      standardContractType: "ERC721",
      chain,
      method: "ownerOf",
      parameters: [tokenId],
      returnValueTest: {
        comparator: "=",
        value: ":userAddress",
      },
    },
  ];
};

class Lit {
  private litNodeClient: any;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async enryptString(
    str: string,
    chain: string,
    accessControlConditions: Array<any>
  ) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(str);

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    return {
      encryptedFile: encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        "base16"
      ),
    };
  }

  async decryptString(
    encryptedString: string,
    encryptedSymmetricKey: string,
    chain: string,
    accessControlConditions: Array<any>
  ) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    });
    const decryptedFile = await LitJsSdk.decryptString(
      encryptedString,
      symmetricKey
    );
    // eslint-disable-next-line no-console
    console.log({
      decryptedFile,
    });
    return { decryptedFile };
  }
}

export default new Lit();
