import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers";

export const typeDefs = `

#-------------------- Schemas ------------------------------------------------------------
    type User {
    user_id: ID!
    username: String 
    wallet: String!
    email:  String
    collections: [Collection!]!
   }

type Collection {
  id:  ID!
  URI: String!
  createdAt: String
  owner: User!
  nfts: [NFT] 
}

type NFT {
id: ID!
tokenId: String!
name: String!
nftURI: String
owner: User!
parentCollection: Collection!
}

#-------------------------- Queries ---------------------------------------------------

type Query {
getUserByWallet(wallet:String!): [User]                          # get a specific user
getCollectionByUserId(user_id: String!): [Collection]
getCollections: [Collection!]!                                   # get all collections
getNFTsByCollectionId(col_id: ID!): [NFT]                        # get all nfts in a collection

}

#------------------------ Mutations --------------------------------------------------
type Mutation {
  createUser(username: String, wallet: String!, email: String): User!
}
`
  ;

export const schema = makeExecutableSchema({ typeDefs, resolvers });
