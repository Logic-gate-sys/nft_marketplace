import config from '../config/db.js';
const { pinata } = config;
 


// upload file : file is mainly the image 
export const upload_file = async (blobBody, original_name,file_mime) => {
 
    try {
        const file = new File([blobBody], original_name, { type: file_mime });
        const upload = await pinata.upload.public.file(file); //upload to pinata
        const image_uri = upload['cid'];
        if (!image_uri) throw new error();
        return image_uri;
    }catch (error) {
        throw new Error();
    }
}


// metadata upload 
export const upload_metadata = async (name, desc, img_uri, background_col, body, eye, tokenId ) => {
    // metadata
  const metadata = {
    name: `${name} #${tokenId}`,
    description: desc,
    image: img_uri,
    attributes: [
      { trait_type: "Background", value: background_col },
      { trait_type: "Body", value: body },
      { trait_type: "Eyes", value: eye }
    ]
  }

    try {
      //metadata into json blob
      const metadataBlob = new Blob(
          [JSON.stringify(metadata)],
          { type: 'application/json' }
      );
      const file = new File([metadataBlob], `${name}_${tokenId}.json`, {
          type: 'application/json'
      });

    const upload = await pinata.upload.public.file(file)
    if (!upload?.cid) throw new Error("Upload failed.")
    const token_uri = `ipfs://${upload.cid}`
    return token_uri
  } catch (error) {
    console.error("Upload error:", error)
    throw new Error("Failed to upload metadata")
  }
}

