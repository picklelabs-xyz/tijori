import { DocumentNode } from "graphql";
import { GraphQLClient } from "graphql-request";
import { ARWEAVE_GRAPHQL_ENDPOINT } from "../../constants";

export const fetchGraphQuery = async ({
  query,
  variables,
}: {
  query: DocumentNode | string;
  variables: Record<string, unknown>;
}) => {
  const client = new GraphQLClient(ARWEAVE_GRAPHQL_ENDPOINT);
  const data = await client.request(query, variables);
  return data;
};
