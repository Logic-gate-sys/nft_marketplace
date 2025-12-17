
import { TTLCache } from '@isaacs/ttlcache';

const cache = new TTLCache({
    max: 50, // 12 hourse TTL
    ttl: 12 * 60 *60 * 1000,
    checkAgeOnGet: true
})

// set some value
/**
 * 
 * @param address : string address of the contract whose abi is cached in lowercase letters
 * @param abi : abi of the contract as an array
 * @summary Set abi as a TTL node memory cache
 */
export const setABI = (address:string, abi:any[]) => {
    cache.set(address, abi);
}

/**
 * 
 * @param address : string address of the contract whose abi is cached in lowercase letters
 * @returns a boolean depending on whether abi was found or not
 */
export const ABIexists = (address: string) => {
    return cache.has(address);
}

/**
 * 
 * @param address : string address of the contract whose abi is cached in lowercase letters
 * @returns : cached abi using the contract address fromt the ttl in-process memory
 */
export const getABI_from_ttl_cache = (address: string) =>{
    return cache.get(address);
}


/**
 * @remarks
 * A countract that's not deployed on the local, we need to fetch it's abi from etherscan
 * This function fetches the verified contract ABI from Etherscan
 * @param address - The Ethereum contract address
 * @returns Parsed ABI (array of JSON objects)
 */
export const fetchAbiFromEtherscan = async (address: string) => {
    if (ABIexists(address)) {
        const ABI = getABI_from_ttl_cache(address);
        return ABI;
    }
    else {
        const etherscan_base_url = process.env.ETHERSCAN_BASE_URL;
        const ethescan_api_key = process.env.EHTERSCAN_API_KEY
  try {
        const url = `${etherscan_base_url}?module=contract&action=getabi&address=${address}&apikey=${ethescan_api_key}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Etherscan error: ${res.status}`);
    }
    const  json  = await res.json(); // ABI as JS object
    if (json.status !== '1') {
      throw new Error("Etherscan fetch failed");
    }
      // set in cache
      const abi = JSON.parse(json.result);
      setABI(address, abi);

      // return abi
      return abi;
     
  } catch (err: any) {
    throw new Error(`Failed to fetch ABI: ${err.message}`);
  }
        
    }
    
}
