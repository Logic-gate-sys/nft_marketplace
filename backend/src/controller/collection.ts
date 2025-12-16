import { prisma } from './../lib/prisma';
import { Request, Response } from 'express';
import { uploadImageToPinata, uploadCollectionMetaData } from '../utils/ifpfs';
import {
  ipfsCIDToHttp,
  ipfsToHttp,
  fetchIpfsMetadata,
  formatCollectionMetadata,
} from '../utils/ifpfs';

// coverImage: null,
// logoImage: null,

// creacte collection
export const create_offchain_collection = async (
  req: Request,
  res: Response
) => {
  // get fields require to create collection
  const {
    owner_id,
    contractAddress,
    name,
    description,
    symbol,
    category,
    royalties,
  } = req.body;
  //------------ for On-chain there is no need for ipfs
  // file
  const files = req.files as Express.Multer.File[];
  if (!files) {
    return res
      .status(400)
      .json({ error: 'Bad request', message: 'Tow files must be provided' });
  }
  const cover = files[0]; // cover
  const logo = files[1]; // logo

  //image uri
  const cover_uri = await uploadImageToPinata(
    cover.buffer,
    cover.originalname,
    cover.mimetype
  );
  //upload file to ipfs and get the cid
  if (!cover_uri) {
    return res
      .status(403)
      .json({ error: 'Upload failed', message: 'Could not upload file 1' });
  }
  const logo_uri = await uploadImageToPinata(
    logo.buffer,
    logo.originalname,
    logo.mimetype
  );
  if (!logo_uri) {
    return res
      .status(403)
      .json({
        error: 'Upload failed',
        message: 'Could not upload file 2 to pinata',
      });
  }
  //upload collection data to ipfs

  const col_uri = await uploadCollectionMetaData(
    contractAddress,
    name,
    description,
    symbol,
    category,
    royalties,
    cover_uri,
    logo_uri
  );
  if (!col_uri) {
    return res.json({ error: 'Failed to upload Contract metadata to ifpfs' });
  }
  // upload to DB using prisma
  const new_collection = await prisma.collection.create({
    data: {
      user_id: Number(owner_id),
      col_uri: col_uri,
    },
  });

  if (!new_collection) {
    return res
      .status(400)
      .json({ error: 'Could not create collection instance in DB' });
  }
  return res.status(201).json({
    success: true,
    data: new_collection,
    message: 'Off chain collection created successfully',
  });
};

export const fetchAllCollections = async (req: Request, res: Response) => {
  try {
    // Query params
    const {
      category,
      sortBy = 'recent',
      page = '1',
      limit = '20',
      search,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause: any = {};
    if (category && category !== 'all') {
      whereClause.col_uri = { contains: `"category":"${category}"` };
    }
    if (search) {
      whereClause.col_uri = {
        ...whereClause.col_uri,
        contains: search as string,
      };
    }

    // OrderBy clause
    let orderBy: any = { create_at: 'desc' };
    if (sortBy === 'oldest') orderBy = { create_at: 'asc' };

    // Fetch collections with NFTs and counts
    const collections = await prisma.collection.findMany({
      where: whereClause,
      include: {
        _count: { select: { Nft: true, Listings: true } },
        User: { select: { id: true, username: true, wallet: true } },
        Nft: {
          include: {
            User: {
              select: {
                id: true,
                username: true,
                wallet: true,
              },
            },
          },
        }, // include NFT owner info
      },
      orderBy: orderBy,
      skip,
      take: limitNum,
    });

    // Total count
    const totalCollections = await prisma.collection.count({
      where: whereClause,
    });

    // Transform collections
    const transformedCollections = await Promise.all(
      collections.map(async (col) => {
        // Fetch collection metadata
        const meta = await fetchIpfsMetadata(col.col_uri);

        // Transform NFTs in this collection
        const transformedNfts = col.Nft.map((nft) => ({
          id: nft.id,
          tokenId: nft.token_id,
          uri: nft.uri ?? '',
          ownerId: nft.User.id,
          ownerWallet: nft.User.wallet,
          ownerName: nft.User.username ?? 'Unnamed',
        }));

        return {
          id: col.id.toString(),
          name: meta.name ?? 'Unnamed Collection',
          cover: ipfsCIDToHttp(meta.cover) ?? '',
          logo: ipfsCIDToHttp(meta.logo) ?? '',
          description: meta.description ?? '',
          symbol: meta.symbol ?? '',
          category: meta.category ?? 'other',
          contractAddress: meta.contractAddress ?? '',
          items: col._count.Nft,
          listedItems: col._count.Listings,
          nfts: transformedNfts,
          floorPrice: 0, // TODO: calculate from listings
          volume: 0, // TODO: calculate from sales
          creator: col.User.wallet,
          creatorName: col.User.username ?? 'Unnamed',
          creatorId: col.User.id,
          createdAt: col.create_at,
        };
      })
    );

    // Sort by items if requested
    if (sortBy === 'items') {
      transformedCollections.sort((a, b) => b.items - a.items);
    }

    // Pagination metadata
    const totalPages = Math.ceil(totalCollections / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      success: true,
      data: transformedCollections,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCollections,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error: any) {
    console.error('Error fetching all collections:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch collections',
    });
  }
};

export const fetchUserCollections = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    const requestedUserId = parseInt(req.params.userId);

    // Validate authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User authentication required',
      });
    }

    // Check if user is requesting their own collections
    if (userId !== requestedUserId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You can only access your own collections',
      });
    }

    // Optional query parameters
    const { sortBy = 'recent', category } = req.query;

    // Build where clause
    const whereClause: any = {
      user_id: userId,
    };

    if (category && category !== 'all') {
      whereClause.col_uri = {
        contains: `"category":"${category}"`,
      };
    }

    // Build orderBy clause
    let orderBy: any = { create_at: 'desc' };

    if (sortBy === 'oldest') {
      orderBy = { create_at: 'asc' };
    } else if (sortBy === 'name') {
      // Will sort by name after fetching
    }

   const collections = await prisma.collection.findMany({
      where: whereClause,
      include: {
        _count: { select: { Nft: true, Listings: true } },
        User: { select: { id: true, username: true, wallet: true } },
        Nft: {
          include: {
            User: {
              select: {
                id: true,
                username: true,
                wallet: true,
              },
            },
          },
        }, // include NFT owner info
      },
      orderBy: orderBy,
    });

    // Total count
    const totalCollections = await prisma.collection.count({
      where: whereClause,
    });

    // Transform collections
    const transformedCollections = await Promise.all(
      collections.map(async (col) => {
        // Fetch collection metadata
        const meta = await fetchIpfsMetadata(col.col_uri);

        // Transform NFTs in this collection
        const transformedNfts = col.Nft.map((nft) => ({
          id: nft.id,
          tokenId: nft.token_id,
          uri: nft.uri ?? '',
          ownerId: nft.User.id,
          ownerWallet: nft.User.wallet,
          ownerName: nft.User.username ?? 'Unnamed',
        }));

        return {
          id: col.id.toString(),
          name: meta.name ?? 'Unnamed Collection',
          cover: ipfsCIDToHttp(meta.cover) ?? '',
          logo: ipfsCIDToHttp(meta.logo) ?? '',
          description: meta.description ?? '',
          symbol: meta.symbol ?? '',
          category: meta.category ?? 'other',
          contractAddress: meta.contractAddress ?? '',
          items: col._count.Nft,
          listedItems: col._count.Listings,
          nfts: transformedNfts,
          floorPrice: 0, // TODO: calculate from listings
          volume: 0, // TODO: calculate from sales
          creator: col.User.wallet,
          creatorName: col.User.username ?? 'Unnamed',
          creatorId: col.User.id,
          createdAt: col.create_at,
        };
      })
    );

    // Sort by items if requested
    if (sortBy === 'items') {
      transformedCollections.sort((a, b) => b.items - a.items);
    }
    // Pagination metadata
    res.json({
      success: true,
      data: transformedCollections,
      pagination: {
        total: totalCollections,
      },
    });
  } catch (error: any) {
    console.error('Error fetching user collections:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch user collections',
    });
  }
};




export const fetchCollectionById = async (req: Request, res: Response) => {
  try {
    const collectionId = parseInt(req.params.col_id);

    if (isNaN(collectionId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'Collection ID must be a valid number',
      });
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        _count: {
          select: {
            Nft: true,
            Listings: true,
          },
        },
        Nft: {
          include: {
            User: {
              select: {
                id: true,
                wallet: true,
                username: true,
              },
            },
          },
        },
        User: {
          select: {
            id: true,
            username: true,
            wallet: true,
          },
        },
      },
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Collection not found',
      });
    }

    // Fetch IPFS metadata
    const meta = await fetchIpfsMetadata(collection.col_uri).catch(() => null);

    // Transform NFTs
    const transformedNfts = collection.Nft.map((nft) => ({
      id: nft.id,
      tokenId: nft.token_id,
      uri: nft.uri ?? '',
      ownerId: nft.User.id,
      ownerWallet: nft.User.wallet,
      ownerName: nft.User.username ?? 'Unnamed',
      isListed: false, // TODO: derive from Listings table
    }));

    const transformedCollection = {
      id: collection.id.toString(),
      name: meta?.name ?? 'Unnamed Collection',
      cover: meta?.cover ? ipfsCIDToHttp(meta.cover) : '',
      logo: meta?.logo ? ipfsCIDToHttp(meta.logo) : '',
      description: meta?.description ?? '',
      symbol: meta?.symbol ?? '',
      category: meta?.category ?? 'other',
      contractAddress: meta?.contractAddress ?? '',

      items: collection._count.Nft,
      listedItems: collection._count.Listings,
      nfts: transformedNfts,

      floorPrice: 0, // TODO: calculate from lowest listing
      volume: 0, // TODO: calculate from Sold table

      creator: collection.User.wallet,
      creatorName: collection.User.username ?? 'Unnamed',
      creatorId: collection.User.id,
      createdAt: collection.create_at,
    };

    res.json({
      success: true,
      data: transformedCollection,
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch collection',
    });
  }
};

// Helper function
function parseCollectionUri(uri: string | null): any {
  if (!uri) return {};
  try {
    return JSON.parse(uri);
  } catch {
    return {};
  }
}
