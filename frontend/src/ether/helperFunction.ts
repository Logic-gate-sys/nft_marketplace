  



export const fetchPinataMetaData = async (ipfs_url) => { 
    try {
      const cid = ipfs_url.replace('ipfs://', '');
      const gateway_uri = `https://gateway.pinata.cloud/ipfs/${cid}`;
      //let's now fetch metadata 
      const res = await fetch(gateway_uri);
      const metadata = await res.json();
      console.log("Metata data:  ", metadata);
      return metadata;
    } catch (error) {
      console.error('Error fetching metadata: ', error);
    }
  }