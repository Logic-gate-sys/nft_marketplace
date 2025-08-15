import { useState } from "react";
import { createCollection } from "../ether/contract_interaction.js";
import {
  connectWallet,
  fetchUserId,
} from "../ether/wallet_interactions.js";
import axios from "axios";





export const NFTCollectionForm = () => {
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    total_supply: 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "total_supply" ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // starting loading with the spinner
    setCreating(true);
    console.log("Form Data:", formData);

    try {
      //get signer
      const { signer, wallet } = await connectWallet();
      // should form fields be empty
      if (
        Object.values(formData).every(
          (val) => val === "" || val === null || val === undefined
        )
      ) {
        console.log("No form data passed ");
        setCreating(false);
        return;
      }
      const { collectionAddress } = await createCollection(
        signer,
        formData.name,
        formData.symbol,
        formData.total_supply
      );
      // should contract instance not be retrieved correctly
      if (!collectionAddress) {
        console.log("Could not get collection contract instance");
        setCreating(false);
        return;
      }
      //use
      const user_id = await fetchUserId(wallet);
      if (!user_id) {
        console.log("No user id given");
        setCreating(false);
        return;
      }

      // TODO: send data to your backend or blockchain contract
      const res = await axios.post(
        "http://localhost:3000/api/collections/user",
        {
          name: formData.name,
          description: formData.description,
          id: user_id,
          contract_addr: collectionAddress,
          total_supply: formData.total_supply,
        }
      );
      if (!res) {
        console.log("Could not store contract deatail in backend");
        setCreating(false);
      }
      console.log("Collection created: ", res.data);
      // when done set spinner to false
      setCreating(false);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  // Generate supply options: 5, 10, 20, 40...100
  const supplyOptions = [5, 10];
  for (let i = 20; i <= 100; i += 10) {
    supplyOptions.push(i);
  }
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className=" inset-30 z-999  text-white mx-auto p-8 bg-gray-800 opacity-95 shadow-lg rounded-2xl space-y-6"
      >
        <h2 className="text-2xl font-bold  text-center">
          Create NFT Collection
        </h2>
        <div>
          <label className="block text-sm font-medium">Collection Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium ">Symbol</label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <textarea
            name="description"
            id="description"
            placeholder="Write collection.... not more than 80 words"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium ">Total Supply</label>
          <select
            name="total_supply"
            value={formData.total_supply}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {supplyOptions.map((supply) => (
              <option key={supply} value={supply}>
                {supply}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-fit bg-indigo-600  py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Create Collection
        </button>
      </form>
      {creating && (
        <div className="fixed inset-0 flex items-center justify-center z-100 bg-gray-500 opacity-60">
          <div className="  w-24 h-24 border-8 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
