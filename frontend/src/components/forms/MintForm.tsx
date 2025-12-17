import { useState, ChangeEvent, FormEvent } from "react";
import {
  getWriteContractInstance,
  getReadOnlyContractInstance,
  mintOnChain,
  mintOffChain,
} from "../../ether/contract_interaction";
import { getTransferLogs, getTokenURI } from "../../services/nft-indexing";
import { Loader, Spinner, PopupMessageBox } from "../index";
import { useAuth } from "../../context/AuthContext";
import { fetchContractABI } from "../../ether/contract_interaction";

interface MintFormProps {
  col_id: string;
  col_address: string;
  col_owner: string;
  type: string;
}

export const MintForm = ({ col_id, col_address, col_owner, type }: MintFormProps) => {
  const [formData, setFormData] = useState<any>({
    id: 0, // collection id
    image: null,
    attributes: {
      rarity: "Common",
      occasion: "Birthday",
      redeemable: true,
      type: "",
      background: "cyan",
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const { signer, provider, token } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        setFormData({ ...formData, image: fileInput.files[0] });
      }
    } else if (name in formData.attributes) {
      setFormData({
        ...formData,
        attributes: { ...formData.attributes, [name]: value },
      });
    }
  };

  const handleOffChainMint = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!token) {
        return;
     }
    const NFT_contractABI = await fetchContractABI(col_address, token);
    if (!provider || !signer) {
        setError(true);
        setMessage("Connect wallet first , dummy !");
        return;
      }
      const payload = new FormData();
      payload.append("attributes", JSON.stringify(formData.attributes));
      if (formData.image) payload.append("file", formData.image);

      payload.append("colId", col_id);
      payload.append("ownerId", col_owner);
     
      const readContract = await getReadOnlyContractInstance(col_address, NFT_contractABI, provider);
      if (!readContract) {
        return;
      }
      const nextId = await readContract.getNextTokenId();
      payload.append("tokenId", nextId.toString());

      const res = await fetch(`${import.meta.env.BASE_URL}/api/nfts`,
        { method: "POST", body: payload });
      const { nft_uri } = await res.json();

      const writeContract = await getWriteContractInstance(col_address, NFT_contractABI, signer);
      await mintOffChain(writeContract, nft_uri);

      setMessage("NFT minted successfully!");
      setSuccess(true);
    } catch (err: any) {
      console.log(err);
      setError(true);
      setMessage(err.message || "Minting failed.");
    }
    setLoading(false);
  };

  return (
    <main className="fixed opacity-99 z-50 inset-[15%] bg-[#1e1e2f] rounded-xl p-6 w-[600px] flex flex-col gap-6">
      {type === "Off-Chain" && (
        <form onSubmit={handleOffChainMint} encType="multipart/form-data" className="flex flex-col gap-4">
          {/* Rarity */}
          <label>
            Rarity:
            <select name="rarity" value={formData.attributes.rarity} onChange={handleChange} className="p-2 rounded bg-gray-700">
              <option value="Common">Common</option>
              <option value="Rare">Rare</option>
              <option value="Epic">Epic</option>
              <option value="Legendary">Legendary</option>
            </select>
          </label>

          {/* Occasion */}
          <label>
            Occasion:
            <select name="occasion" value={formData.attributes.occasion} onChange={handleChange} className="p-2 rounded bg-gray-700">
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Holiday">Holiday</option>
              <option value="Custom">Custom</option>
            </select>
          </label>

          {/* Type */}
          <label>
            Type:
            <select name="type" value={formData.attributes.type} onChange={handleChange} className="p-2 rounded bg-gray-700">
              <option value="Digital">Digital</option>
              <option value="Physical">Physical</option>
              <option value="Voucher">Voucher</option>
            </select>
          </label>

          {/* Background */}
          <label>
            Background:
            <select name="background" value={formData.attributes.background} onChange={handleChange} className="p-2 rounded bg-gray-700">
              <option value="Galaxy">Galaxy</option>
              <option value="Sunset">Sunset</option>
              <option value="Matrix">Matrix</option>
              <option value="White">White</option>
            </select>
          </label>

          {/* Redeemable */}
          <label>
            Redeemable:
            <select
              name="redeemable"
              value={formData.attributes.redeemable ? "true" : "false"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  attributes: { ...formData.attributes, redeemable: e.target.value === "true" },
                })
              }
              className="p-2 rounded bg-gray-700"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>

          {/* Image upload */}
          <input
            type="file"
            name="image"
            accept=".jpg,.png,.jpeg,.svg"
            required
            onChange={handleChange}
            className="p-2 bg-gray-700 rounded"
          />

          <div className="flex gap-4 mt-4 self-end">
            <button type="submit" className="bg-purple-500 px-6 py-2 rounded-xl font-semibold">
              {loading ? "Minting..." : "Mint Off-Chain"}
            </button>
            <button type="button" className="bg-red-500 px-6 py-2 rounded-xl" onClick={() => setWantsToMint(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <Spinner />}
      {success && <PopupMessageBox message={message} onClose={() => setSuccess(false)} />}
      {error && <PopupMessageBox message={message} onClose={() => setError(false)} />}
    </main>
  );
};
