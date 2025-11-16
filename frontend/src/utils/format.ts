import { BytesLike } from "ethers";

 export const formatIpfsUrl = (cid: string)=> {
   if (!cid) return "";
   //if it's and onchain image just return
   if (cid.startsWith("data")) {
     return cid;
   }
  // If already prefixed with ipfs://, strip it
  if (cid.startsWith("ipfs://")) {
    cid = cid.replace("ipfs://", "");
  }
  // Return a gateway URL
  return `https://ipfs.io/ipfs/${cid}`;
  }
  



export const decodeBase64Utf8=(base64: any) => {
  const binary = atob(base64); // binary string 
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i<binary.length; i++){
    bytes[i] = binary.charCodeAt(i);
  }
  return new  TextDecoder().decode(bytes); // decode UTF-8
  }
