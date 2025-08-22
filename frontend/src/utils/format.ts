 export const formatIpfsUrl = (cid)=> {
  if (!cid) return "";
  // If already prefixed with ipfs://, strip it
  if (cid.startsWith("ipfs://")) {
    cid = cid.replace("ipfs://", "");
  }
  // Return a gateway URL
  return `https://ipfs.io/ipfs/${cid}`;
  }
  