import { parentPort } from "worker_threads";
import { getPrismaClient } from "../lib/prisma";




const prisma = getPrismaClient();

export const resolvers = {
    Query: {
        //------ get usr by their wallet + all their collections 
        getUserByWallet: async (_: any, args: { wallet: string }) => {
            return prisma.user.findFirst({ 
                where: { wallet: args.wallet },
                include:{collections: true}
            })
        },
        // ----- get all collection
        getCollections: async () => {
            return await prisma.collection.findMany(
                {include:{user: true, nfts: true}}
            );
        },
        //-----  get user + all the collections they own
        getCollectionByUserId: async (_: any, args: { user_id: string }) => {
            return await prisma.collection.findMany({
                where: { user_id: args.user_id },
                include: {user:true, nfts: true }
            })
        },
        //------ get all nfts in a collection
        getNFTsByCollectionId: async (_: any, args: { col_id: number }) => {
            return await prisma.nft.findMany({
                where: { col_id: args.col_id },
                include :{user:true, collection:true}
            })
        }
    },
    Mutation: {
        //create user
        createUser: async (_: any, args: { username?: string, wallet: string, email?: string }) => {
            return await prisma.user.create({
                data: { username: args.username, wallet: args.wallet, email: args.email }
            });
        } 
    },
    // --------------------------------------- Type Resolvers ------------------------------------------
    Collection: {
        id: (parent: any) => parent.col_id,
        URI: (parent: any) => parent.col_uri,
        createdAt: (parent: any) => parent.created_at,
        owner: (parent:any)=> parent.user,
        nfts: (parent: any) => parent.nfts
    },
    NFT: {
        id: (parent: any) => parent.nft_id,
        tokenId: (parent: any) => parent.token_id,
        nftURI: (parent: any) => parent.nft_uri,
        owner: (parent: any) => parent.user,
        parentCollection: (parent:any)=> parent.collection
    }

}