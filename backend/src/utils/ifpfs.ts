import { pinata } from '../config/config';

//-----------------------  Define the argument types ------------------------------
export const uploadImageToPinata = async (
  blobBody: any,
  original_name: string,
  file_mime: string
): Promise<string> => {
  const blob = new Blob([blobBody], { type: file_mime });

  const file = new File([blob], original_name, { type: file_mime });
  const upload: any = await pinata.upload.public.file(file);
  const cid = upload.cid as string;
  if (!cid) throw new Error('CID missing from Pinata response');
  return cid;
};

// ------off-chain nft metadata upload ----------------------
export const upload_nft_metadata = async (
  name: string,
  id: number,
  description: string,
  img_uri: string,
  background_col: string,
  body: string,
  eye: string
) => {
  // metadata
  const metadata = {
    name: `${name} #${id}`,
    description: description,
    image: img_uri,
    attributes: [
      { trait_type: 'Background', value: background_col },
      { trait_type: 'Body', value: body },
      { trait_type: 'Eyes', value: eye },
    ],
  };

  try {
    //metadata into json blob
    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    });
    const file = new File([metadataBlob], `${name}.json`, {
      type: 'application/json',
    });

    const upload = await pinata.upload.public.file(file);
    if (!upload?.cid) throw new Error('Upload failed.');
    const token_uri = `ipfs://${upload.cid}`;
    return token_uri;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload metadata');
  }
};

// ------------------------ upload collection metadat

export const uploadCollectionMetaData = async (
  type: string ,
  contractAddress: string,
  name: string,
  description: string,
  symbol: string,
  category: string,
  royalties: number,
  cover: string,
  logo: string
) => {
  //metadata <--- following opensea's standard for metadata
  const metadata = {
    type: type,
    contractAddress: contractAddress,
    name: name,
    description: description,
    symbol: symbol,
    category: category,
    royalties: royalties,
    cover: cover,
    logo: logo,
  };

  //metadata blob
  const metadataBlob = new Blob([JSON.stringify(metadata)], {
    type: 'application/json',
  });
  const file = new File([metadataBlob], `${name}.json`, {
    type: 'application/json',
  });
  try {
    const upload = await pinata.upload.public.file(file);
    if (!upload?.cid) throw new Error('Upload failed.');
    const col_uri = `ipfs://${upload.cid}`;
    return col_uri;
  } catch (error) {
    throw error;
    return;
  }
};

/**
 * nft_id    Int    @id @default(autoincrement())
  token_id  String
  col_id    Int
  nft_uri   String?
  name      String
  owner_id  String

 */
export const upload_nftMetaData_pinata = async (image:string, attributes: any) => {
  const metaData = { image: image, attributes: attributes};
  try {
    //create a blob
    const metaDataBlob = new Blob([JSON.stringify(metaData)], {
      type: 'application/json',
    });
    //create file from blob
    const file = new File([metaDataBlob], `.json`, {
      type: 'application/json',
    });
    const upload = await pinata.upload.public.file(file);
    if (!upload?.cid) throw new Error();
    return `ipfs://${upload.cid}`;
  } catch (err) {
    throw new Error();
  }
};


// Convert ipfs:// URI to HTTP URL
export const ipfsToHttp = (ipfsUri: string) => {
  // Remove ipfs:// and add /ipfs/ path
  const hash = ipfsUri.replace("ipfs://", "");
  return `https://coffee-permanent-aardwolf-723.mypinata.cloud/ipfs/${hash}`;
}

// Fetch metadata from IPFS
export const fetchIpfsMetadata = async (ipfsUri: string) => {
  const http_url = ipfsToHttp(ipfsUri);
  console.log('Fetching metadata from:', http_url);
  
  const res = await fetch(http_url);
  if (!res.ok) {
    throw new Error(`Failed to fetch IPFS metadata: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// Convert CID to HTTP URL
export const ipfsCIDToHttp = (cid: string) => {
  return `https://coffee-permanent-aardwolf-723.mypinata.cloud/ipfs/${cid}`;
}

type RawMetadata = {
  contractAddress: string;
  name: string;
  description: string;
  symbol: string;
  category: string;
  royalties: string | number;
  cover?: string;
  logo?: string;
};

export function formatCollectionMetadata(meta: RawMetadata) {
  const IPFS_GATEWAY = "https://coffee-permanent-aardwolf-723.mypinata.cloud";
  
  // Helper to convert IPFS hash/CID to HTTP URL
  const toHttp = (cid?: string) => {
    if (!cid) return null;
    
    // If already HTTP URL, return as is
    if (cid.startsWith('http')) return cid;
    
    // Remove ipfs:// if present
    const hash = cid.replace('ipfs://', '');
    
    return `${IPFS_GATEWAY}/ipfs/${hash}`;
  };

  return {
    contractAddress: meta.contractAddress,
    name: meta.name,
    description: meta.description,
    symbol: meta.symbol,
    category: meta.category,
    royalties: Number(meta.royalties),
    cover: toHttp(meta.cover),
    logo: toHttp(meta.logo),
  };
}


// onchain image and metadata extraction 
export const decodeOnChainTokenURI = (tokenURI: string) => {
  if (!tokenURI) {
    throw new Error("tokenURI is empty");
  }

  const trimmed = tokenURI.trim();

  // Not base64 → treat as normal URL
  if (!trimmed.startsWith("data:application/json;base64,")) {
    return {
      metadata: {},
      image: trimmed,
    };
  }

  const base64Json = trimmed.split(",")[1];
  const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
  const metadata = JSON.parse(jsonString);

  if (!metadata.image) {
    throw new Error("No image field in metadata");
  }

  return {
    metadata,
    image: metadata.image,
  };
};
