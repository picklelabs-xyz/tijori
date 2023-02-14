import * as LitJsSdk from "lit-js-sdk";

const client = new LitJsSdk.LitNodeClient();

// access rules with owner of nft
export const generateAccessControlConditions = (
  contractAddress: string,
  contractType: "ERC721" | "ERC1155",
  chain: string,
  tokenId: string
) => {
  if (contractType == "ERC721") {
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
  } else {
    return [
      {
        contractAddress,
        standardContractType: contractType,
        chain,
        method: "balanceOf",
        parameters: [":userAddress", tokenId],
        returnValueTest: {
          comparator: ">",
          value: "0",
        },
      },
    ];
  }
};

// access rules with any token of the contract
export const generateACCForContract = (
  contractAddress: string,
  contractType: "ERC721" | "ERC1155",
  chain: string
) => {
  return [
    {
      contractAddress,
      standardContractType: contractType,
      chain,
      method: "balanceOf",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: ">=",
        value: "1",
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

    console.log("Access Control");
    console.log(accessControlConditions);

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
