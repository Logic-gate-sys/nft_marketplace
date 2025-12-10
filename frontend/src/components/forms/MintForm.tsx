import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { Spinner } from "../effects/helperComponents";
import { connectWallet } from "../../utils/wallet_interactions";
import { getWriteContractInstance,getReadOnlyContractInstance, mintOnChain, mintOffChain } from "../../ether/contract_interaction";
import { cakeNFTAbi, workHorseAbi } from '../../../../shared/constants/contract-constants';
import { Popup } from "../effects/helperComponents";
import { getTransferLogs, getTokenURI } from "../../services/nft-indexing";






// ------------ Types ----------------
interface MintFormProps {
  col_id: string;
  col_name: string;
  type: string;
  col_address: string;
  col_owner: string;
  setWantsToMint:(wantsToMint: boolean) => void;
}

interface FormDataState {
  description: string;
  background_col: string;
  body: string;
  eye: string;
  file: File | null;
}

export const MintForm = ({ col_id, col_name, type, col_address, col_owner, setWantsToMint }: MintFormProps) => {
  console.log("OWNER ID : >>>>>>>>>>>>>>>>>>>> ---- ", col_owner)
  const [isLoading, setLoading] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // ------------------ form data --------------------------------
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

  //========================================= Submit Forms =====================================================
  // for off-chain submit <<<---------------
  const handleOffChainMint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // -------->>> build payload
      const payload = new FormData();
      payload.append("description", formData.description);
      payload.append("background_col", formData.background_col);
      payload.append("body", formData.body);
      payload.append("eye", formData.eye);
      if (formData.file) payload.append("file", formData.file);
      // ------>>> connect wallet
      const { provider, signer, wallet } = await connectWallet();

      // ------>>> get contract instance
      const writeContractInstance = await getWriteContractInstance(col_address, workHorseAbi, signer);
      if (!writeContractInstance) {
        setMessage("No contract instance found !");
        setLoading(false);
        setErrorMsg(true);
        return;
      }

      // ----->>> append extra
      payload.append("colId", col_id);
      payload.append("col_type", type);
      payload.append("name", col_name);
      payload.append("ownerId", col_owner);

      // get nest tokenId fromt he contract instance 
      const readContractInstance = await getReadOnlyContractInstance(col_address, workHorseAbi, provider);
      if (!readContractInstance) {
        setLoading(false);
        setErrorMsg(true);
        setMessage("No read contract instance found");
        return;
      }
      const result = await readContractInstance?.getNextTokenId();
      const tokenId = result.toString();
      console.log("TOKEN ID RETURNED: ", tokenId);
      // if no tokenI d
      if (!tokenId) {
        setMessage("Could read contract state to find next token Id");
        setErrorMsg(true);
        setLoading(false);
        return;
      }
      // append tokenId to payload
      payload.append("tokenId", tokenId);

      // upload metadata
      const res = await fetch("http://localhost:3000/api/nfts", {
        method: "POST",
        body: payload
      })
      //upload results
      const newNFT = await res.json();
      if (!newNFT) {
        setMessage("Could not create nft instance");
        setErrorMsg(true);
        setLoading(false);
        return; 
      }
      const { nft_uri } = newNFT;
      // -------->>> mint NFT
      const mintReceipt = await mintOffChain(writeContractInstance, nft_uri);
      console.log("MINT RECEIPT: ", mintReceipt);
      setMessage("NFT Minted Successfully");
      setMintSuccess(true);
      setLoading(false);
      setWantsToMint(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Minting failed");
    } finally {
      setLoading(false);
    }
  };

  //for onchain submit <<<-------------------
  const handleOnchainMint = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    // prevent default submit
    e.preventDefault();
    //get signer,wallet
    const { provider, wallet, signer } = await connectWallet();
    if (!wallet || !signer) {
      setErrorMsg(true);
      setLoading(false);
      setMessage(() => "Could not get wallet or signer !");
      return;
    }
    //get read contract instance
    const readContractInstance = await getWriteContractInstance(col_address, cakeNFTAbi, provider);
    //get contract instance
    const writeContractInstance = await getWriteContractInstance(col_address, cakeNFTAbi, signer);
    if (!writeContractInstance) {
      console.log("No Contract instance !");
      setLoading(false);
      setMessage(() => "Could not get contract instance !");
      return;
    }
    //call the mint functions && retrive receipt
    const receipt = await mintOnChain( writeContractInstance);
    if (!receipt) {
      setErrorMsg(true);
      setMessage("No mint receipts returns !, looks like minting was not successful");
      setLoading(false);
      return
    }
    // get event logs from receipt
    const transferloags = getTransferLogs("Transfer", receipt);
    if (!transferloags) { 
      console.log("No matching logs found");
      setLoading(false);
      setErrorMsg(true);
      setMessage("Could not retrieve transfer event logs");
      return;
    }
    const { from, to, tokenId } = transferloags;
    // get tokenURI
    const tokenURI = await getTokenURI(readContractInstance, tokenId);
    if (!tokenURI) {
      setLoading(false);
      setMessage("Could not get Token URI!");
      setErrorMsg(true);
      return;
    }
    // post token details
    const res = await fetch("http://localhost:3000/api/nfts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "colId": col_id,
        "col_type": type,
        "tokenId": tokenId,
        "tokenURI": tokenURI,
        "name": col_name,
        "ownerId": col_owner
      })
    });
    const data = await res.json();
    if (!data) {
      setErrorMsg(true);
      setMessage("Could not upload to DB!, please try again");
      setLoading(false);
      return;
    }
    setMessage("NFT minted successfully !");
    setMintSuccess(true);
    setLoading(false);
    //inform of mint status
  }
    
  if (type === "On-Chain") {
    return (
      <main id='onchain-maint form' className="fixed opacity-99 z-50 inset-[15%] flex flex-col justify-center items-center gap-12 p-6  bg-[#1e1e2f] rounded-xl">
        <section className=" flex flex-col gap-2">
          <h1 className="text-2xl text-blue-500 font-bold">Mint into <span className="text-orange-400">{col_name}</span></h1>
          <p className="text-xl font-semibold text-gray-400">This collection is {type}</p>
        </section>
        <form onSubmit={handleOnchainMint} className=" flex gap-5">
          <button type="submit" className="bg-blue-600 p-3 px-8 rounded-2xl text-xl font-bold "> mint Nft </button>
           <button onClick={()=> setWantsToMint(false)} className="bg-red-400 p-3 px-8 rounded-2xl text-xl font-bold "> cancel </button>
        </form>
        {isLoading && <Spinner />}
        {mintSuccess &&<Popup message={message} onClose={()=>setMintSuccess(false)} />}
        {errorMsg && <Popup message={message} onClose={()=>setErrorMsg(false)} />}
      </main>
    )
  } else {

    return (
      <>
          <form
            onSubmit={handleOffChainMint}
            encType="multipart/form-data"
            className="fixed opacity-99 z-50 inset-[15%] flex flex-col gap-4 p-6  bg-[#1e1e2f] rounded-xl "
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
                className="text-sm file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-indigo-100 file:text-indigo-700
                   hover:file:bg-indigo-200 bg-gray-700"
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
                  onClick={() => setWantsToMint(false)}
                  className="bg-red-400 px-5 py-2 rounded-2xl font-semibold text-lg hover:bg-purple-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        {isLoading && <Spinner />}
        {mintSuccess && <p className="text-green-400 mt-2">{message}</p>}
        {errorMsg && <p className="text-red-400 mt-2">⚠️ {message}</p>}
      </>
    );
  }
};
