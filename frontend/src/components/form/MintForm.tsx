import { connectWallet,fetchUserId } from "../../ether/wallet_interactions";
import { mintNFT, getNextNFTID } from "../../ether/contract_interaction";
import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { Spinner } from "../effect/helperComponents";
// ------------ Types ----------------
interface MintFormProps {
  col_id: string;
  col_name: string;
}

interface FormDataState {
  description: string;
  background_col: string;
  body: string;
  eye: string;
  file: File | null;
}

export const MintForm: React.FC<MintFormProps> = ({ col_id, col_name }) => {
  const [isLoading, setLoading] = useState(false);
  const [wantToMint, setWantToMint] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // form data
  const [formData, setFormData] = useState<FormDataState>({
    description: "",
    background_col: "Galaxy",
    body: "Robot",
    eye: "Laser",
    file: null,
  });

  // handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        setFormData({ ...formData, file: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // build payload
      const payload = new FormData();
      payload.append("description", formData.description);
      payload.append("background_col", formData.background_col);
      payload.append("body", formData.body);
      payload.append("eye", formData.eye);
      if (formData.file) payload.append("file", formData.file);

      // connect wallet
      const { provider, signer, wallet } = await connectWallet();
      console.log("USER WALLET ADDRESS: ", wallet);

      const userId = await fetchUserId(wallet);
      console.log("USER ID: ", userId);

      // fetch collection contract
      const res2 = await axios.get<{ contract_addr: string }>(
        `http://localhost:3000/api/collections/${col_id}`
      );
      if (!res2.data?.contract_addr) throw new Error("No contract address found for collection");

      const { contract_addr } = res2.data;

      // get next NFT id
      const nft_id = await getNextNFTID(provider, contract_addr);

      // append extra
      payload.append("col_id", col_id);
      payload.append("id", nft_id.toString());
      payload.append("name", col_name);

      // upload metadata
      const uploadRes = await axios.post<{ ipfs_uri: string }>(
        `http://localhost:3000/api/nfts`,
        payload
      );
      if (!uploadRes.data?.ipfs_uri) throw new Error("File upload failed");

      const { ipfs_uri } = uploadRes.data;

      // mint NFT
      const mintReceipt = await mintNFT(signer, contract_addr, ipfs_uri);
      console.log("MINT RECEIPT: ", mintReceipt);

      setMintSuccess(true);
      setWantToMint(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Minting failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!wantToMint ? (
        <button
          onClick={() => setWantToMint(true)}
          className="bg-[#A259FF] px-5 py-2 rounded-2xl font-semibold text-lg hover:bg-purple-500"
        >
          Mint into Collection
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="fixed opacity-99 z-50 inset-4 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl bg-[#1e1e2f] p-6 rounded-xl mt-6"
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
                required
              >
                <option value="Galaxy">Galaxy</option>
                <option value="Sunset">Sunset</option>
                <option value="Matrix">Matrix</option>
                <option value="White">White</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label htmlFor="description" className="w-32 font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a brief NFT description (max 80 words)"
                maxLength={500}
                required
                className="bg-gray-700 font-bold p-4 flex-1 rounded"
              />
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
                required
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
                required
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
                required
                className="text-sm file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 bg-gray-700"
              />
            </div>

            <div className="flex gap-4 mt-4 self-end">
              <button
                type="submit"
                id="mint"
                disabled={isLoading}
                className="bg-[#A259FF] px-5 py-2 rounded-2xl font-semibold text-lg hover:bg-purple-500 disabled:opacity-50"
              >
                {isLoading ? "Minting..." : "Mint NFT"}
              </button>
              <button
                type="button"
                id="cancel"
                onClick={() => setWantToMint(false)}
                className="bg-red-400 px-5 py-2 rounded-2xl font-semibold text-lg hover:bg-purple-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
      {isLoading && <Spinner />}
      {mintSuccess && <p className="text-green-400 mt-2">✅ NFT minted successfully!</p>}
      {errorMsg && <p className="text-red-400 mt-2">⚠️ {errorMsg}</p>}
    </>
  );
};
