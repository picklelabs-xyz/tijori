import { graphql } from "graphql";
import { gql } from "graphql-request";
import { isConstructorDeclaration } from "typescript";
import { fetchGraphQuery } from "..";
import VaultItem from "../../../types/VaultItem";

const query = gql`
  query GetQuery($contractAddr: String!, $tokenId: String!) {
    transactions(
      tags: [
        { name: "ContractAddress", values: [$contractAddr] }
        { name: "TokenId", values: [$tokenId] }
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

export const getTransactions = async (
  contractAddr: string,
  tokenId: string
): Promise<VaultItem[]> => {
  const params = {
    query,
    variables: {
      contractAddr: contractAddr,
      tokenId: tokenId,
    },
  };

  const data = await fetchGraphQuery(params);
  const items = data.transactions.edges.map((edge: any) => {
    // console.log(edge.node.tags);
    return mapItem(edge.node.tags);
  });
  return items;
};

const mapItem = (item: any): VaultItem => {
  const VaultItem = {
    name: item.filter((tag: any) => tag.name == "name")[0],
    description: item.filter((tag: any) => tag.name == "description")[0],
    encryptedKey: item.filter((tag: any) => tag.name == "EncryptedKey")[0]
      .value,
    fileSize: 2024,
    arweaveTxnId: item.filter((tag: any) => tag.name == "ArweaveTxnId")[0]
      .value,
    timestamp: "123213123",
  };
  return VaultItem;
};
