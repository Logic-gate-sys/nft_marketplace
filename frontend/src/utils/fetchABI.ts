
async function fetchABI(address: string, apiKey: string) {
  const url = `https://api.etherscan.io/api
    ?module=contract
    &action=getabi
    &address=${address}
    &apikey=${apiKey}`.replace(/\s+/g, "");

  const res = await fetch(url);
  const data = await res.json();

  // SUCCESS RESPONSE RETURNS 
  if (data.status !== "1") {
    throw new Error("Failed to fetch ABI: " + data.result);
  }

  // The ABI lives in data.result
  const abi = JSON.parse(data.result);

  return abi;
}


// CACHE ABI
function cacheABI(address:string, abi:string) {
  const key =`abi_${address.toLowerCase()}`;

  const payload = {
    abi,
    cachedAt: Date.now()
  };

  localStorage.setItem(key, JSON.stringify(payload));
}

// load from cache
function loadCachedABI(address:string) {
  const key = `abi_${address.toLowerCase()}`;
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}
