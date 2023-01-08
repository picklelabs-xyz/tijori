import * as LitJsSdk from "lit-js-sdk";

const client = new LitJsSdk.LitNodeClient();

// access rules with owner of nft
export const generateAccessControlConditions = (
  contractAddress: string,
  contractType: "ERC721" | "ERC1155",
  chain: string,
  tokenId: string
) => {
  return [
    {
      contractAddress,
      standardContractType: contractType,
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
    data: string,
    chain: string,
    accessControlConditions: Array<any>
  ) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      data
    );

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
    encryptedString: Blob | File,
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

    return { decryptedFile };
  }
}

export default new Lit();
