import { useState, ChangeEvent, FormEvent, useEffect } from "react";
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
import { ConsoleSqlOutlined } from "@ant-design/icons";

interface MintFormProps {
  col_id: string;
  col_address: string;
  owner_id: string;
  col_owner: string;
  type: string;
  setWantToMint: (val: boolean) => void;
}

export const MintForm = ({
  col_id,
  col_address,
  owner_id,
  col_owner,
  type,
  setWantToMint,
}: MintFormProps) => {
  // submit form data ;
  const [formData, setFormData] = useState<any>({
    id: 0, // collection id
    image: null,
    attributes: {
      rarity: "Common",
      occasion: "Birthday",
      redeemable: true,
      type: "",
      background: "cyan",
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const { signer, provider, token, wallet, readProvider } = useAuth();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  /**
   *
   * @param e : Form event
   * @returns
   */
  const handleOffChainMint = async (e: FormEvent) => {
    console.log(
      "----------------------------- OFF CHAIN MINTING STARTED ---------------------------"
    );
    e.preventDefault();
    // start loader
    setLoading(true);

    if (!token || !wallet || !provider || !signer) {
      setError(true);
      setMessage("Connect wallet first to mint");
      setLoading(false);
      return;
    }
    // contract abi
    const NFT_contractABI = await fetchContractABI(col_address, token);
    if (!NFT_contractABI) {
      setError(true);
      setMessage("Connect wallet first to mint");
      setLoading(false);
      return;
    }

    // Upload metadata
    if (!formData.image) {
      setError(true);
      setMessage("Image required ");
      setLoading(false);
      return;
    }
    const uploadData = new FormData();
    if (formData.image) uploadData.append("file", formData.image);
    uploadData.append("attributes", JSON.stringify(formData.attributes));
    uploadData.append("col_id", col_id);
    uploadData.append("owner_id", col_owner);
    
    //milestone 2
    console.log("MILESTONE 2 ------------ ABOUT TO UPLOAD TO IPFS");
    const uploadRes = await fetch(
      `${import.meta.env.VITE_BASE_URL}/nfts/mint/uploads`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      }
    );

        console.log("MILESTONE 3 ------------ FINISHED UPLOADING TO IPFS");

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      setError(true);
      setMessage("Upload failed");
      setLoading(false);
      return;
    }
    // token uri
    const { tokenURI } = await uploadRes.json();
    if (!tokenURI) {
      setError(true);
      setMessage("Could not get token URI");
      setLoading(false);
      return;
    }
   console.log("TOKEN URL RESULT :: ", tokenURI);


    const writeContract = getWriteContractInstance(
      col_address,
      NFT_contractABI,
      signer
    );
    const mRes = await mintOffChain(writeContract, tokenURI);
    if (!mRes) {
      setError(true);
      setMessage("Minting failed");
      setLoading(false);
      return;
    }
    const {from,to, tokenId } = mRes;

    console.log("TOKEN ID", tokenId);

    // Save to DB
    const mintRes = await fetch(`${import.meta.env.VITE_BASE_URL}/nfts/mint`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token_id: tokenId.toString(),
        col_id: col_id.toString(),
        nft_uri: tokenURI,
        owner_id: owner_id.toString(),
        attributes: { type: "offchain" },
      }),
    });

    if (!mintRes.ok) {
      setError(true);
      setMessage("Failed to save nft to db");
      setLoading(false);
      return;
    }
    console.log('FINAL UPLOAD TO DB ', mintRes);
    //final displays
    setSuccess(true);
    setMessage("Off-chain minting successful!");
    setLoading(false);
  };

  const handleOnchainMint = async (e: FormEvent) => {
    console.log(
      "-------------  STARTING ON-CHAIN MINTING  -------------------------------"
    );
    console.count("handleOnchainMint called");

    e.preventDefault();
    //start loader
    setLoading(true);
    // get the collection id
    const collectionAddress = col_address;
    if (!token || !signer || !provider || !wallet) {
      setLoading(false);
      setError(true);
      setMessage(
        "Failed to get token or signer or provider, please connect wallet"
      );
      return;
    }
    console.log("WALLET : ", wallet);
    const collectionABI = await fetchContractABI(collectionAddress, token);
    console.log("COLLECTION ABI : ", collectionABI);
    if (!collectionABI) {
      setError(true);
      setLoading(false);
      setMessage("Failed to fetch collection ABI");
    }
    const contract_instance = getWriteContractInstance(
      collectionAddress,
      collectionABI,
      signer
    );
    console.log("Contract type: ", typeof contract_instance);

    // mint with with the contract instance
    const mintRes = await mintOnChain(contract_instance, wallet);
    if (!mintRes) {
      setError(true);
      setLoading(false);
      setMessage("Could not mint and retrieve mint details");
      return;
    }
    const { from, to, tokenId } = mintRes;
    console.log("TOKEN ID ", tokenId);
    // send token url and details to backend for db persistence
    const readContractInstance = getReadOnlyContractInstance(
      collectionAddress,
      collectionABI,
      readProvider
    );
    if (!readContractInstance) {
      setLoading(false);
      setError(true);
      setMessage("Could not get read contract instance");
      return;
    }
    const tokenURI = await getTokenURI(readContractInstance, tokenId);
    if (!tokenURI) {
      setLoading(false);
      setMessage("No token uril found ");
      setError(true);
      return;
    }
    console.log("TOKEN URL ", tokenURI);

    // upload to db
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/nfts/mint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        token_id: tokenId.toString(), // convert BigInt to string
        col_id: col_id.toString(), // if col_id is number
        nft_uri: tokenURI.toString(),
        owner_id: owner_id.toString(), // if owner_id is number
        attributes: {
          type: "onchain",
        },
      }),
    });
    if (!res.ok) {
      setLoading(false);
      setError(true);
      setMessage("Onchain mint data insertion failed");
      return;
    }
    setLoading(false);
    setSuccess(true);
    setMessage("Minting sucessful ");
    // set wants to mint to false
    () => setWantToMint(false);
    return;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <main className="w-[60%] max-w-3xl h-[88%] max-h-[90vh] bg-[#1e1e2f] rounded-2xl border border-white/10 shadow-[0_20px_70px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/5 via-transparent to-transparent">
          <div>
            <h2 className="text-white text-lg font-semibold tracking-tight">
              Mint NFT
            </h2>
            <p className="text-white/70 text-xs mt-1">
              Upload your artwork and choose attributes.
            </p>
          </div>

          <button
            type="button"
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/15 active:bg-white/20 transition px-3 py-2 rounded-xl text-sm
                     focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:ring-offset-0"
            onClick={() => setWantToMint(false)}
          >
            Close
          </button>
        </header>

        {/* Body */}
        <section className="p-6 overflow-y-auto flex-1">
          {type === "offchain" && (
            <form
              onSubmit={handleOffChainMint}
              encType="multipart/form-data"
              className="flex flex-col gap-6"
            >
              {/* Card wrapper for fields */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Rarity */}
                  <label className="text-sm text-white/90 flex flex-col gap-2">
                    <span className="text-white/70">Rarity</span>
                    <select
                      name="rarity"
                      value={formData.attributes.rarity}
                      onChange={handleChange}
                      className="w-full p-2.5 rounded-xl bg-gray-900/40 border border-white/10 text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-white/20
                               hover:border-white/20 transition"
                    >
                      <option value="Common">Common</option>
                      <option value="Rare">Rare</option>
                      <option value="Epic">Epic</option>
                      <option value="Legendary">Legendary</option>
                    </select>
                  </label>

                  {/* Occasion */}
                  <label className="text-sm text-white/90 flex flex-col gap-2">
                    <span className="text-white/70">Occasion</span>
                    <select
                      name="occasion"
                      value={formData.attributes.occasion}
                      onChange={handleChange}
                      className="w-full p-2.5 rounded-xl bg-gray-900/40 border border-white/10 text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-white/20
                               hover:border-white/20 transition"
                    >
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Holiday">Holiday</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </label>

                  {/* Type */}
                  <label className="text-sm text-white/90 flex flex-col gap-2">
                    <span className="text-white/70">Type</span>
                    <select
                      name="type"
                      value={formData.attributes.type}
                      onChange={handleChange}
                      className="w-full p-2.5 rounded-xl bg-gray-900/40 border border-white/10 text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-white/20
                               hover:border-white/20 transition"
                    >
                      <option value="Digital">Digital</option>
                      <option value="Physical">Physical</option>
                      <option value="Voucher">Voucher</option>
                    </select>
                  </label>

                  {/* Background */}
                  <label className="text-sm text-white/90 flex flex-col gap-2">
                    <span className="text-white/70">Background</span>
                    <select
                      name="background"
                      value={formData.attributes.background}
                      onChange={handleChange}
                      className="w-full p-2.5 rounded-xl bg-gray-900/40 border border-white/10 text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-white/20
                               hover:border-white/20 transition"
                    >
                      <option value="Galaxy">Galaxy</option>
                      <option value="Sunset">Sunset</option>
                      <option value="Matrix">Matrix</option>
                      <option value="White">White</option>
                      <option value="Pure">Pure</option>
                    </select>
                  </label>

                  {/* Redeemable */}
                  <label className="text-sm text-white/90 flex flex-col gap-2 sm:col-span-2">
                    <span className="text-white/70">Redeemable</span>
                    <select
                      name="redeemable"
                      value={formData.attributes.redeemable ? "true" : "false"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          attributes: {
                            ...formData.attributes,
                            redeemable: e.target.value === "true",
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-gray-900/40 border border-white/10 text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-white/20
                               hover:border-white/20 transition"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </label>

                  {/* Image upload */}
                  <label className="text-sm text-white/90 flex flex-col gap-2 sm:col-span-2">
                    <span className="text-white/70">Image</span>
                    <div className="rounded-2xl border border-dashed border-white/20 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5">
                      <input
                        type="file"
                        name="image"
                        accept=".jpg,.png,.jpeg,.svg"
                        required
                        onChange={handleChange}
                        className="block w-full text-sm text-white/80
                                 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0
                                 file:bg-gradient-to-r file:from-purple-500 file:to-fuchsia-500 file:text-white
                                 hover:file:opacity-90 transition"
                      />
                      <p className="mt-2 text-xs text-white/50">
                        JPG, PNG, JPEG, SVG accepted.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer actions */}
              <div className="pt-2 flex gap-3 justify-end">
                <button
                  type="button"
                  className="bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-xl transition
                           focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  onClick={() => setWantToMint(false)}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-semibold text-white
                           bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:opacity-95 active:opacity-90 transition
                           disabled:opacity-60 disabled:cursor-not-allowed
                           focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60"
                  disabled={loading}
                >
                  {loading ? "Minting..." : "Mint Off-Chain"}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* -------------------- ONCHAIN MINT ------------------------------------ */}
        {type == "onchain" && (
          <section className="px-6 pb-6">
            <form
              onSubmit={handleOnchainMint}
              encType="multipart/form-data"
              className="flex flex-col gap-6"
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="pt-2 flex gap-3 justify-end">
                  <button
                    type="button"
                    className="bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-xl transition
                           focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    onClick={() => setWantToMint(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-semibold text-white
                           bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:opacity-95 active:opacity-90 transition
                           disabled:opacity-60 disabled:cursor-not-allowed
                           focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60"
                    disabled={loading}
                  >
                    {loading ? "Minting..." : "Mint On-Chain"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}

        {/* Status */}
        <div className="px-6 pb-6">
          {loading && <Spinner />}
          {success && (
            <PopupMessageBox
              message={message}
              onClose={() => setSuccess(false)}
            />
          )}
          {error && (
            <PopupMessageBox
              message={message}
              onClose={() => setError(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
};
