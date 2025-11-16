import { gql } from "@apollo/client";

export const GET_USER_COLLECTIONS = gql`
  query GetCollectionByUserId($userId: String!) {
  getCollectionByUserId(user_id: $userId) {
    id
    URI
    createdAt
    owner {
      user_id
      wallet
    }
    nfts {
      id
      tokenId
      name
      nftURI
    }
  }
}
`;
