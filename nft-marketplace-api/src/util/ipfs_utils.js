import config from "../config/db.js";
const { pinata } = config;

// upload file : file is mainly the image
export const upload_file = async (blobBody, original_name, file_mime) => {
  try {
    const file = new File([blobBody], original_name, { type: file_mime });
    const upload = await pinata.upload.public.file(file); //upload to pinata
    const image_uri = upload["cid"];
    if (!image_uri) throw new error();
    return image_uri;
  } catch (error) {
    throw new Error();
  }
};

// metadata upload
export const upload_nft_metadata = async (
  name,
  id,
  description,
  img_uri,
  background_col,
  body,
  eye
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

// upload collection metadat
export const upload_collection_metadata = async (
  name,
  description,
  image_uri
) => {
  //metadata <--- following opensea's standard for metadata
  const metadata = {
    name: name,
    image: image_uri,
    description: description,
    external_link: "https://dano-sour.com",
    seller_fee_basis_points: 500,
    fee_recipient: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"  // to be upadated later with deployers address
  };

  //metadata blob
  const metadataBlob = new Blob([JSON.stringify(metadata)], {
    type: "application/json",
  });
  const file = new File([metadataBlob], `${name}.json`, {
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
