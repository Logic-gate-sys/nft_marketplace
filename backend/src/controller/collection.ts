import { prisma } from './../lib/prisma';
import { Request, Response } from 'express';
import {
  uploadImageToPinata,
  uploadCollectionMetaData,
  upload_nft_metadata,
} from '../utils/ifpfs';
import { fetchAbiFromEtherscan } from '@/utils/ABI';
import {
  ipfsCIDToHttp,
  ipfsToHttp,
  fetchIpfsMetadata,
  formatCollectionMetadata,
  decodeOnChainTokenURI,
} from '../utils/ifpfs';
import { JsonWebTokenError } from 'jsonwebtoken';
import { urlToHttpOptions } from 'node:url';
import nftRouter from '@/route/nftRoute';
import { decode } from 'node:punycode';



// creacte collection
export const create_offchain_collection = async (
  req: Request,
  res: Response
) => {
  // get fields require to create collection
  const {
    owner_id,
    type,
    contractAddress,
    name,
    description,
    symbol,
    category,
    royalties,
  } = req.body;
  //--------- for On-chain there is no need for ipfs
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
    return res.status(403).json({
      error: 'Upload failed',
      message: 'Could not upload file 2 to pinata',
    });
  }
  //upload collection data to ipfs

  const col_uri = await uploadCollectionMetaData(
    type,
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
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'oldest') orderBy = { createdAt: 'asc' };

    // Fetch collections with NFTs and counts
    const collections = await prisma.collection.findMany({
      where: whereClause,
      include: {
        _count: { select: { Nft: true } },
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
        const meta = await fetchIpfsMetadata(col.col_uri);

        const transformedNfts = await Promise.all(
          (col.Nft ?? []).map(async (nft) => {
            // OFF-CHAIN NFT
            if (meta.type === 'offchain') {
              if (!nft.uri) {
                return;
              }
              const metadata = await fetchIpfsMetadata(nft.uri);

              return {
                id: nft.id,
                tokenId: nft.token_id,
                uri: ipfsCIDToHttp(metadata.image) ?? '',
                status: nft?.status,
                basePrice: nft?.base_price,
                currentPrice: nft?.current_price,
                attributes: metadata.attributes ?? {},
                ownerId: nft.User.id,
                ownerWallet: nft.User.wallet,
                ownerName: nft.User.username ?? 'Unnamed',
              };
            }

            // ON-CHAIN NFT
            if (!nft.uri) {
              return;
            }
            // decodec
            const decoded = decodeOnChainTokenURI(nft.uri);

            // URL
            return {
              id: nft.id,
              tokenId: nft.token_id,
              uri: decoded.image ?? '',
              status: nft?.status,
              basePrice: nft?.base_price,
              currentPrice: nft?.current_price,
              attributes: decoded.metadata ?? {},
              ownerId: nft.User.id,
              ownerWallet: nft.User.wallet,
              ownerName: nft.User.username ?? 'Unnamed',
            };
          })
        );

        return {
          id: col.id.toString(),
          type:meta?.type,
          name: meta.name ?? 'Unnamed Collection',
          cover: ipfsCIDToHttp(meta.cover) ?? '',
          logo: ipfsCIDToHttp(meta.logo) ?? '',
          description: meta.description ?? '',
          symbol: meta.symbol ?? '',
          category: meta.category ?? 'other',
          contractAddress: meta.contractAddress ?? '',
          items: col._count.Nft,
          // listedItems: col._count.Listings,
          nfts: transformedNfts,
          floorPrice: 0,
          volume: 0,
          creator: col.User.wallet,
          creatorName: col.User.username ?? 'Unnamed',
          creatorId: col.User.id,
          createdAt: col.createdAt,
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
    const userId = req.user?.userId;
    const skip = Number(req.query.skip ?? 0);
    const take = Number(req.query.take ?? 10);
    const sortBy = req.query.sortBy ?? 'recent';

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required',
      });
    }

    const collections = await prisma.collection.findMany({
      where: { user_id: userId },
      include: {
        _count: { select: { Nft: true} },
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
        },
      },
      skip,
      take,
      orderBy: { createdAt: 'asc' },
    });

    const totalCollections = await prisma.collection.count({
      where: { user_id: userId },
    });

    const transformedCollections = await Promise.all(
      collections.map(async (col) => {
        const meta = await fetchIpfsMetadata(col.col_uri);

        const transformedNfts = await Promise.all(
          (col.Nft ?? []).map(async (nft) => {
            // OFF-CHAIN NFT
            if (meta.type === 'offchain') {
              if (!nft.uri) {
                return;
              }
              const metadata = await fetchIpfsMetadata(nft.uri);

              return {
                id: nft.id,
                tokenId: nft.token_id,
                uri: ipfsCIDToHttp(metadata.image) ?? '',
                basePrice: nft?.base_price,
                currentPrice:nft?.current_price,
                status: nft?.status,
                attributes: metadata.attributes ?? {},
                ownerId: nft.User.id,
                ownerWallet: nft.User.wallet,
                ownerName: nft.User.username ?? 'Unnamed',
              };
            }

            // ON-CHAIN NFT
            if (!nft.uri) {
              return;
            }
            // decodec
            const decoded = decodeOnChainTokenURI(nft.uri);

            // URL
            return {
              id: nft.id,
              tokenId: nft.token_id,
              uri: decoded.image ?? '',
              basePrice: nft?.base_price,
              currentPrice:nft?.current_price,
              status: nft?.status,
              attributes: decoded.metadata ?? {},
              ownerId: nft.User.id,
              ownerWallet: nft.User.wallet,
              ownerName: nft.User.username ?? 'Unnamed',
            };
          })
        );

        return {
          id: col.id.toString(),
          type:meta?.type,
          name: meta.name ?? 'Unnamed Collection',
          cover: ipfsCIDToHttp(meta.cover) ?? '',
          logo: ipfsCIDToHttp(meta.logo) ?? '',
          description: meta.description ?? '',
          symbol: meta.symbol ?? '',
          category: meta.category ?? 'other',
          contractAddress: meta.contractAddress ?? '',
          items: col._count.Nft,
          nfts: transformedNfts,
          floorPrice: 0,
          volume: 0,
          creator: col.User.wallet,
          creatorName: col.User.username ?? 'Unnamed',
          creatorId: col.User.id,
          createdAt: col.createdAt,
        };
      })
    );

    if (sortBy === 'items') {
      transformedCollections.sort((a, b) => b.items - a.items);
    }

    return res.json({
      success: true,
      data: transformedCollections,
      pagination: { total: totalCollections },
    });
  } catch (error) {
    console.error('Error fetching user collections:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user collections',
    });
  }
};

export const fetchCollectionById = async (req: Request, res: Response) => {
  try {
    const collectionId = parseInt(req.params.col_id);

    if (!collectionId) {
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
    const meta = await fetchIpfsMetadata(collection.col_uri);

    const transformedNfts = await Promise.all(
      (collection.Nft ?? []).map(async (nft) => {
        // OFF-CHAIN NFT
        if (meta.type === 'offchain') {
          if (!nft.uri) {
            return;
          }
          const metadata = await fetchIpfsMetadata(nft.uri);

          return {
            id: nft.id,
            tokenId: nft.token_id,
            uri: ipfsCIDToHttp(metadata.image) ?? '',
            basePrice: nft?.base_price,
            currentPrice:nft?.current_price,
            status: nft?.status,
            attributes: metadata.attributes ?? {},
            ownerId: nft.User.id,
            ownerWallet: nft.User.wallet,
            ownerName: nft.User.username ?? 'Unnamed',
          };
        }

        // ON-CHAIN NFT
        if (!nft.uri) {
          return;
        }
        // decodec
        const decoded = decodeOnChainTokenURI(nft.uri);

        // URL
        return {
          id: nft.id,
          tokenId: nft.token_id,
          uri: decoded.image ?? '',
          basePrice: nft?.base_price,
          currentPrice:nft?.current_price,
          status: nft?.status,
          attributes: decoded.metadata ?? {},
          ownerId: nft.User.id,
          ownerWallet: nft.User.wallet,
          ownerName: nft.User.username ?? 'Unnamed',
        };
      })
    );

    const transformedCollection = {
      id: collection.id.toString(),
      type: meta?.type,
      name: meta.name ?? 'Unnamed Collection',
      cover: ipfsCIDToHttp(meta.cover) ?? '',
      logo: ipfsCIDToHttp(meta.logo) ?? '',
      description: meta.description ?? '',
      symbol: meta.symbol ?? '',
      category: meta.category ?? 'other',
      contractAddress: meta.contractAddress ?? '',
      items: collection._count.Nft,
      nfts: transformedNfts,
      floorPrice: 0,
      volume: 0,
      creator: collection.User.wallet,
      creatorName: collection.User.username ?? 'Unnamed',
      creatorId: collection.User.id,
      createdAt: collection.createdAt,
    };

    return res.json({
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

// fech collction abi
/**
 *
 * @param req ; request object that the user has been attached to after authentication
 * @param res  result that is returned after request executes successfully
 * @returns
 */
export const fetchCollectionABI = async (req: any, res: Response) => {
  try {
    const { contractAddress } = req.query;
    const user_id = req.user?.userId;
    if (!user_id || !contractAddress) {
      return res.status(400).json({
        success: false,
        message:
          'User id or contract address or collection address is not provided',
        error: 'Bad request body',
      });
    }
    // getting all the necessary abi
    const ABI = await fetchAbiFromEtherscan(contractAddress);
    if (!ABI) {
      return res.status(404).json({
        success: false,
        message: 'No ABI found from ethersan',
      });
    }
    // Student
    return res.status(200).json({
      success: true,
      data: ABI,
      message: 'ABI returned  successfully',
    });
  } catch (e: any) {
    console.log(e);
    console.log(e.message);
    return;
  }
};
