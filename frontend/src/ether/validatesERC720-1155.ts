import { ethers,Signer,Provider } from "ethers";

// ------------------- ABI for ERC165 -------------------
// ERC165 is the "interface detection" standard in Ethereum.
// Any contract that implements ERC165 must provide a function `supportsInterface(bytes4)`
// which lets us ask: "Do you support interface X?".
// We only need this single function in the ABI to call it.
const ERC165_ABI = [
  "function supportsInterface(bytes4 interfaceId) external view returns (bool)"
];

// ------------------- Known Interface IDs -------------------
// Each ERC standard has a unique interface ID (bytes4).
// These IDs are defined by the EIP (Ethereum Improvement Proposal).
// For example, ERC721 = 0x80ac58cd, ERC1155 = 0xd9b67a26, etc.
const INTERFACE_IDS = {
  ERC165: "0x01ffc9a7",         // Base ERC165 itself
  ERC721: "0x80ac58cd",         // Core ERC721 (NFT standard)
  ERC721_METADATA: "0x5b5e139f",// ERC721 optional Metadata extension (name, symbol, tokenURI)
  ERC1155: "0xd9b67a26",        // ERC1155 (multi-token standard)
  ERC1155_METADATA: "0x0e89341c"// ERC1155 optional Metadata extension (URI)
};

// ------------------- Main Function -------------------
// This function detects whether a given contract address
// is an ERC721, ERC1155, or neither.
export async function detectNFTStandard(contractAddress: string, provider:Provider): Promise<"ERC721" | "ERC1155" | "Unknown"> {
  try {
    // Create a contract instance with the minimal ERC165 ABI
    // We can now call supportsInterface() on this contract
    const contract = new ethers.Contract(contractAddress, ERC165_ABI, provider);

    // ---- Check if it's ERC721 ----
    // Ask: "Do you support the ERC721 interface ID?"
    const isERC721 = await contract.supportsInterface(INTERFACE_IDS.ERC721);
    if (isERC721) {
      return "ERC721"; //  It’s an ERC721 contract
    }

    // ---- Check if it's ERC1155 ----
    // Ask: "Do you support the ERC1155 interface ID?"
    const isERC1155 = await contract.supportsInterface(INTERFACE_IDS.ERC1155);
    if (isERC1155) {
      return "ERC1155"; //  It’s an ERC1155 contract
    }

    // If it supports neither interface, we don’t know what it is
    return "Unknown";
  } catch (err) {
    // If something goes wrong (bad address, not a contract, etc.)
    // return "Unknown" and log the error
    console.error("Error checking interface:", err);
    return "Unknown";
  }
}
