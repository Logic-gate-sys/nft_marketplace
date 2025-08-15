import FormData, { promises } from "form-data";
import { connectWallet, fetchUserId } from "../ether/wallet_interactions.js";
import { mintNFT, createCollection } from "../ether/contract_interaction.js";
import axios from "axios";
import { useState } from "react";









export const MintForm = ({setWantsToMint, col_id}) => {
  const [isloading, setLoading] = useState(false);
  const [wantToMint, setWantToMint] = useState(false);

  //------- form data should look this way --------------
  const [formData, setFormData] = useState({
    background_col: "Galaxy",
    body: "Robot",
    eye: "Laser",
    file: null,
  });


  // ----------------- handle changes in form ----------------------------------
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  //------------- submit nft for minting -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // start loader
      const payload = new FormData();

      for (const key in formData) {
        payload.append(key, formData[key]);
      }
      // get wallet of user and use it to get id
      const { signer, wallet } = await connectWallet();
      console.log("USER WALLET ADDRESS : ", wallet);
      // use wallet to fetch id
      const id  = await fetchUserId(wallet);
      // append rest of data to formdata payload
      console.log("USER ID FROM FETCH: ", id);
      payload.append("col_id", col_id);
      payload.append("owner_id", id);

      // 
      const res2 = await axios.get(`http://localhost:3000/api/collections/${col_id}`);
      if (!res2) {
        console.log("NO CONTRACT ADDRESS");
      }
      const { contract_addr } = res2.data;
      console.log("CONTRACT ADDRESS: ", contract_addr);

      // post data to endpoint: this returns the json containing ipfs_uri
      const result1 = await axios.post(
        `http://localhost:3000/api/nfts`,
        payload
      );
      if (!result1) {
        console.log("NO RESULT 1");
      }
      console.log("DB UPLOAD: ", result1.data);
      //ipfs_uri
      const { ipfs_uri } = result1.data;
      // now mint to address
      const mint_receipt = await mintNFT(signer, contract_addr, ipfs_uri);
      console.log("MINT RECEIPT: ", mint_receipt);
      setMintSuccess(true); //<-------------- mint success
      //stop loading
      setLoading(false);
      return;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      // close mint form
      setWantToMint(false);
    }
  };

  return (
    <>
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="fixed opacity-95 z-999 inset-40 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl bg-[#1e1e2f] p-6 rounded-xl mt-6"
    >
      {/* Left column */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <label htmlFor="background_col" className="w-32 font-medium">
            Background
          </label>
          <select
            id="background_col"
            name="background_col"
            value={formData.background_col}
            onChange={handleChange}
            className="flex-1 p-2 rounded bg-gray-700"
          >
            <option value="Galaxy">Galaxy</option>
            <option value="Sunset">Sunset</option>
            <option value="Matrix">Matrix</option>
            <option value="White">White</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="body" className="w-32 font-medium">
            Body
          </label>
          <select
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            className="flex-1 p-2 rounded bg-gray-700"
          >
            <option value="Robot">Robot</option>
            <option value="Alien">Alien</option>
            <option value="Human">Human</option>
            <option value="Zombie">Zombie</option>
          </select>
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <label htmlFor="eye" className="w-32 font-medium">
            Eye Style
          </label>
          <select
            id="eye"
            name="eye"
            value={formData.eye}
            onChange={handleChange}
            className="flex-1 p-2 rounded bg-gray-700"
          >
            <option value="Laser">Laser</option>
            <option value="Glowing">Glowing</option>
            <option value="Blindfold">Blindfold</option>
            <option value="Sleepy">Sleepy</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="file" className="font-medium">
            Artwork File
          </label>
          <input
            type="file"
            name="file"
            id="file"
            accept=".jpg,.jpeg,.png,.svg"
            onChange={handleChange}
            className="text-sm file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 bg-gray-700"
          />
        </div>

        <div className="flex gap-4 mt-4 self-end">
          <button
            type="submit"
            id="mint"
            className="bg-[#A259FF] px-5 py-2 rounded-2xl font-semibold text-lg hover:bg-purple-500"
          >
            Mint NFT
          </button>
          <button
            type="button"
            id="cancel"
            onClick={() => setWantsToMint(false)}
            className="bg-red-400 px-5 py-2 rounded-2xl font-semibold text-lg hover:bg-purple-500"
          >
            Cancel
          </button>
        </div>
      </div>
      </form>
      </>
  );
};
