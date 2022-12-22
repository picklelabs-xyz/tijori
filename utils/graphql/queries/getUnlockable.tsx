import { graphql } from "graphql";
import { gql } from "graphql-request";
import { fetchGraphQuery } from "..";

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
) => {
  const params = {
    query,
    variables: {
      contractAddr: contractAddr,
      tokenId: tokenId,
    },
  };

  const data = await fetchGraphQuery(params);
  console.log(data);
};
