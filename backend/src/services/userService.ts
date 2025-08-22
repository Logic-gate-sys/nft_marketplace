import { ethers } from 'ethers';

/*
What the backend does:
Generates a random nonce message for each address

Sends it to the frontend

Receives the signed message from the frontend

Uses Ethers.js to recover the signer address

If recovered address == claimed address and nonce matches → ✅ Auth success
*/

export const getNonceMessage = async (address) => {
  const nonce = Math.floor(Math.random() * 1000000).toString();
  const message = `Sign in with Ethereum: ${address}\nNonce: ${nonce}`;
    return message;
}

export const verifyNonce=async(address,message,signature,expectedNonce) => {
  try {
    const recovered = ethers.verifyMessage(message, signature).toLowerCase();
    const nonceInMessage = message.split("Nonce: ")[1];

    if (recovered === address.toLowerCase() && expectedNonce === nonceInMessage) {
      return {success: true };
    } else {
      return { success: false, error: "Invalid signature or nonce." };
    }
  } catch (err) {
    throw err;
  }
}





/* 
🔹 1️⃣ NFT Business Logic
Your NFT services shouldn’t just run a single SQL update.
They should implement the rules of your marketplace, for example:

✅ Listing logic:

Only allow listing if the NFT is owned by the caller.

Update status to LISTED.

Maybe create a listing record with price and expiry
*/
