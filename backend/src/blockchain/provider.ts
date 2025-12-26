import { JsonRpcProvider } from "ethers";

// RPC URL from .env
const RPC_URL = process.env.RPC_URL; 
if (!RPC_URL) {
  throw new Error("RPC_URL is not set in environment variables");
}

export const provider = new JsonRpcProvider(RPC_URL);


provider.getNetwork().then(network => {
    console.log(`Provider is connected to network ${network.name} with chain id ${network.chainId}`);
})