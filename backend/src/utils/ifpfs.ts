import { pinata } from '../config/config'

//-----------------------  Define the argument types ------------------------------
export const uploadImageToPinata = async (blobBody: any, original_name: string, file_mime: string): Promise<string> => {
  
  const blob = new Blob([blobBody], { type: file_mime });

  const file = new File([blob], original_name, { type: file_mime });
  const upload: any = await pinata.upload.public.file(file);
  const cid = upload.cid as string;
  if (!cid) throw new Error("CID missing from Pinata response");
  return cid;
};



// ------off-chain nft metadata upload ----------------------
export const upload_nft_metadata = async (
  name:string,
  id:number,
  description:string,
  img_uri:string,
  background_col:string,
  body:string,
  eye:string
) => {
  // metadata
  const metadata = {
    name: `${name} #${id}`,
    description: description,
    image: img_uri,
    attributes: [
      { trait_type: "Background", value: background_col },
      { trait_type: "Body", value: body },
      { trait_type: "Eyes", value: eye },
    ],
  };

  try {
    //metadata into json blob
    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });
    const file = new File([metadataBlob], `${name}.json`, {
      type: "application/json",
    });

    const upload = await pinata.upload.public.file(file);
    if (!upload?.cid) throw new Error("Upload failed.");
    const token_uri = `ipfs://${upload.cid}`;
    return token_uri;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload metadata");
  }
};

// ------------------------ upload collection metadat
export const uploadCollectionMetaData = async (
  title: string,
  contractAddress: string,
  description:string,
  symbol: string,
  type:string,
  image_uri: string,
) => {
  //metadata <--- following opensea's standard for metadata
  const metadata = {
    title: title,
    contractAddress: contractAddress,
    description: description,
    symbol: symbol,
    type: type,
    image_uri:image_uri,
    external_link: "https://dano-sour.com",
    seller_fee_basis_points: 500,
    fee_recipient: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",  // to be upadated later with deployers address
  };

  //metadata blob
  const metadataBlob = new Blob([JSON.stringify(metadata)], {
    type: "application/json",
  });
  const file = new File([metadataBlob], `${title}.json`, {
    type: "application/json",
  });
  try {
    const upload = await pinata.upload.public.file(file);
    if (!upload?.cid) throw new Error("Upload failed.");
    const collection_uri = `ipfs://${upload.cid}`;
    return collection_uri;
  } catch (error) {
    throw error;
    return;
  }
}
