import { gql } from "@apollo/client";

export const GET_USER_COLLECTIONS = gql`
 query getUserCollections($userId: String!){
   getCollectionByUserId(user_id: $userId){
    col_id
    col_uri
    created_at
    owner{
       username
       wallet
    }
    nfts{
       nft_id
       tokenId
       nft_uri
       owner{
        wallet
       }
    }
   }
 }
`;


