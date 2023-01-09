import { gql } from "graphql-request";
import { fetchGraphQuery } from "..";
import VaultItem from "../../../types/VaultItem";
import { Tag } from "../../bundlr";

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
