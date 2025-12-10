import React, { useState, ChangeEvent, FormEvent } from "react";
import { connectWallet,fetchUserId } from "../../utils/wallet_interactions";
import axios from "axios";

// Type for form data
interface NFTCollectionFormData {
  name: string;
  symbol: string;
  description: string;
  total_supply: number;
  file: File | null;
}

export const NFTCollectionForm: React.FC = () => {
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<NFTCollectionFormData>({
    name: "",
    symbol: "",
    description: "",
    total_supply: 10,
    file: null,
  });

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "file"
          ? files?.[0] ?? null
          : name === "total_supply"
          ? parseInt(value, 10) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    console.log("Form Data:", formData);

    try {
      const { signer, wallet } = await connectWallet();

      if (!wallet) {
        setCreating(false);
        return;
      }

      if (Object.values(formData).every((val) => val === "" || val === null || val === undefined)) {
        console.log("No form data passed");
        setCreating(false);
        return;
      }

      // Upload artwork to backend
      const fileFormData = new FormData();
      fileFormData.append("name", formData.name);
      fileFormData.append("description", formData.description);
      if (formData.file) fileFormData.append("file", formData.file);

      const uploadRes = await axios.post("http://localhost:3000/api/collections/upload", fileFormData);
      const collection_uri = uploadRes.data;
      console.log("Collection URI:", collection_uri);

      // Create smart contract collection
      const { collectionAddress } = await createCollection(
        signer,
        formData.name,
        formData.symbol,
        formData.total_supply,
        collection_uri
      );

      if (!collectionAddress) {
        console.log("Could not get collection contract instance");
        setCreating(false);
        return;
      }

      const user_id = await fetchUserId(wallet);
      if (!user_id) {
        console.log("No user ID found");
        setCreating(false);
        return;
      }

      // Store contract data in backend
      const res = await axios.post("http://localhost:3000/api/collections/create/collection", {
        id: user_id,
        contract_addr: collectionAddress,
        total_supply: formData.total_supply,
        collection_uri: collection_uri,
      });

      console.log("Collection created:", res.data);
    } catch (error) {
      console.error("Error creating collection:", error);
    } finally {
      setCreating(false);
    }
  };

  // Generate supply options
  const supplyOptions = [5, 10, ...Array.from({ length: 9 }, (_, i) => 20 + i * 10)];

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="inset-30 z-50 text-white mx-auto p-8 bg-gray-800 opacity-95 shadow-lg rounded-2xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Create NFT Collection</h2>

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
          <label className="block text-sm font-medium">Symbol</label>
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
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
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
          <label className="block text-sm font-medium">Total Supply</label>
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

        <button
          type="submit"
          className="w-fit bg-indigo-600 py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Create Collection
        </button>
      </form>

      {creating && (
        <div className="fixed inset-0 flex items-center justify-center z-100 bg-gray-500 opacity-60">
          <div className="w-24 h-24 border-8 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
