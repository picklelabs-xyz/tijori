import { batchRequests, gql } from "graphql-request";
import { fetchGraphQuery } from "..";
import { ARWEAVE_GRAPHQL_ENDPOINT } from "../../../constants";
import VaultItem from "../../../types/VaultItem";
import { Tag } from "../../bundlr";

const tokenQuery = gql`
  query ($contractAddr: String!, $tokenId: String!) {
    transactions(
      tags: [
        { name: "ContractAddress", values: [$contractAddr] }
        { name: "TokenId", values: [$tokenId] }
        { name: "App-Version", values: ["20230214"] }
        { name: "Lock-Type", values: ["token"] }
      ]
    ) {
      edges {
        node {
          id
          tags {
            name
            value
          }
        }
      }
    }
  }
`;

const contractQuery = gql`
  query ($contractAddr: String!) {
    transactions(
      tags: [
        { name: "ContractAddress", values: [$contractAddr] }
        { name: "App-Version", values: ["20230214"] }
        { name: "Lock-Type", values: ["contract"] }
      ]
    ) {
      edges {
        node {
          id
          tags {
            name
            value
          }
        }
      }
    }
  }
`;

// export const getTransactions = async (
//   contractAddr: string,
//   tokenId: string
// ): Promise<VaultItem[]> => {
//   const params = {
//     tokenQuery,
//     variables: {
//       contractAddr: contractAddr,
//       tokenId: tokenId,
//     },
//   };

//   const response = await fetchGraphQuery(params);
//   const items = response.transactions.edges.map((edge: any) =>
//     mapItem(edge.node)
//   );
//   return items;
// };

export const getLockedItems = async (
  contractAddr: string,
  tokenId?: string
) => {
  const response = await batchRequests(ARWEAVE_GRAPHQL_ENDPOINT, [
    {
      document: contractQuery,
      variables: {
        contractAddr: contractAddr,
        tokenId: tokenId,
      },
    },
    {
      document: contractQuery,
      variables: { contractAddr: contractAddr },
    },
  ]);

  // console.log(response);

  let data: any = [];
  const combinedTxns = response.map((item: any) =>
    data.push(...item.data.transactions.edges)
  );
  // console.log(data);

  const items = data.map((edge: any) => mapItem(edge.node));
  return items;
};

export const getTransactionsForContract = async (
  contractAddr: string
): Promise<VaultItem[]> => {
  const params = {
    query: contractQuery,
    variables: {
      contractAddr: contractAddr,
    },
  };

  const response = await fetchGraphQuery(params);
  const items = response.transactions.edges.map((edge: any) =>
    mapItem(edge.node)
  );
  return items;
};

const mapItem = (node: any): VaultItem => {
  const tags = node.tags;
  const VaultItem = {
    txnId: node.id,
    name: getData(tags, "Name"),
    encryptedKey: getData(tags, "EncryptedKey"),
    fileSize: getData(tags, "FileSize"),
    fileMime: getData(tags, "FileMime"),
    accessString: getData(tags, "AccessString"),
    contractAddress: getData(tags, "ContractAddress"),
    chain: getData(tags, "Chain"),
    timestamp: getData(tags, "CreatedAt"),
  };
  return VaultItem;
};

const getData = (tags: Tag[], type: string) => {
  const data = tags.filter((tag: any) => tag.name == type);
  if (data.length > 0) {
    return data[0].value;
  }
  return "";
};
