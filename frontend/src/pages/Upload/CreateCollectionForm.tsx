import React, { useState } from "react";
import { connectWallet } from "../../ether/wallet_interactions";
import {
  fetchAbiFromEtherscan,
  getWriteContractInstance,
} from "../../ether/contract_interaction";
import { getUserId, createUser, createCollection } from "../../services/api";

//--------------------- types --------------------------------------
type FormProp = {
  setShowForm: (val: boolean) => void;
};

const CreateCollectionForm = ({ setShowForm }: FormProp) => {
  //----------------- hooks -------------------------------
  const [previewImage, setPreviewImage] = useState<string>("");
  const [userID, setUserId] = useState<string>("");
  const [userWallet, setUserWallet] = useState<string>("");

  //form data
  const [formData, setFormData] = useState({
    title: "",
    contractAddress: "",
    description: "",
    symbol: "",
    type: "",
    file: null as File | null,
  });
//title, contractAddress, description, symbol, type, user_id
  //------------------------- handle form input data --------------------------------
  const handleFormFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "file" && files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      console.log("FILE: ", URL.createObjectURL(files[0]));
      //set preview image
      setPreviewImage(() => URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  //--------------- handler descript text area ------------
  const handleDescriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //----------------------------- handle form submit --------------------------------
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // retrieve contract address
    const contractAddress = formData.contractAddress;
    try {
      //use etherscan to get contract abi
      const abi = await fetchAbiFromEtherscan(contractAddress.trim());
      console.log("ABI: ", abi);
      //if abi does not exist ; contract is invalid
      if (!abi) {
        console.error("Invalid contract address");
        return;
      }

      //get user wallet

      const connection = await connectWallet();
      if (!connection) return;
      const {  provider, signer, wallet } = connection;
      if (wallet) {
        console.log("Wallet Found ---------------> : ", wallet)
        setUserWallet(wallet);
      }
      //--- get userId or if user does not exist, create user which returns an id
      const user_id = await getUserId(wallet);
      console.log("USER ID FOUND FIREST : ", user_id);
      if (!user_id) {
        const user_id = await createUser(wallet);
        setUserId(user_id);
      }
      setUserId(user_id);

      //---- copy all user inputs into a new form data
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          //if it's a file
          if (value instanceof File) {
            fd.append(key, value, value.name);
          } else {
            fd.append(key, value);
          }
        }
      });
      //add user id
      fd.append("user_id", user_id);
      console.log(">>----APPROACHING FINAL PHASE -------->>>>>")

      // ------ create collection
      const new_collection = await createCollection(fd);
      if (!new_collection) {
        console.log("Could not create collection: !! ");
        return;
      }
      alert("Collection created sucessfully");
      setShowForm(false)

    } catch (err) {
      console.log(err);
      return;
    }
  };
  
// fixed inset-x-[15%] inset-y-[6%]
  return (
    <div  className="fixed inset-1 z-30 flex items-center justify-center w-full h-full bg-gray-900/95">
    <div className=" z-22 w-[%80] bg-gray-900 opacity-95 shadow-lg rounded-2xl p-3 border">
      <h2 className="text-xl font-semibold">Create a New Collection</h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title:
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Example: Bored Ape Yacht Club"
            className="mt-1 w-full border rounded-xl p-2"
            required
            onChange={handleFormFieldChange}
          />
        </div>
        {/* contract address  */}
        <div>
          <label
            htmlFor="contractAddress"
            className="block text-sm font-medium"
          >
            Contract Address:
          </label>
          <input
            id="contractAddress"
            name="contractAddress"
            type="text"
            placeholder="Example: 0x......3040sKD"
            className="mt-1 w-full border rounded-xl p-2"
            required
            onChange={handleFormFieldChange}
          />
        </div>
        {/* Description  */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description :
          </label>
          <textarea
            name="description"
            id="title"
            placeholder="Example: Bored Ape Yacht Club"
            className="mt-1 w-full border rounded-xl p-2"
            rows={3}
            required
            onChange={handleDescriptChange}
          />
        </div>

        {/* ---------------------------- Symbol & Type ------------------------------------------ */}
        <div className="flex ">
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium">
              Symbol:
            </label>
            <input
              type="text"
              name="symbol"
              id="symbol"
              placeholder="e.g. BAYC"
              className="mt-1 w-full border rounded-xl p-2"
              required
              onChange={handleFormFieldChange}
            />
          </div>
          {/* Type */}
          <div className="ml-auto flex flex-col ">
            <label htmlFor="type"> Type: </label>
            <select
              name="type"
              id="type"
              required
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              className="bg-gray-900 text-white font-semibold border-1 outline-amber-100 px-8 py-2 rounded-lg "
            >
              <option value="On-Chain"> On-Chain </option>
              <option value="Off-Chain">Off-Chain</option>
            </select>
          </div>
        </div>

        {/* -------------------------------------------  Collection Image ---------------------------------------------------*/}
        <div>
          <label className="block text-sm font-medium mb-2">
            Collection Image:
          </label>

          <div className="grid grid-cols-2 gap-4">
            {/* Preview Section */}
            <div className="flex items-center justify-center border border-gray-300 rounded-xl bg-gray-900 h-40">
              {/* Replace with state-driven preview later */}

              {!previewImage ? (
                <span className="text-gray-500 text-sm">No image selected</span>
              ) : (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-full w-auto rounded-xl object-contain"
                />
              )}
            </div>

            {/* Upload Section */}
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-800">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-10 h-10 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 12V8m0 0l-4 4m4-4l4 4"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPEG, or SVG (max 10MB)
                </p>
              </div>
              <input
                type="file"
                id="image"
                name="file"
                accept=".png,.jpeg,.jpg,.svg"
                className="hidden"
                required
                onChange={handleFormFieldChange}
              />
            </label>
          </div>
        </div>

        {/* Chain */}
        {/* <div>
      <label className="block text-sm font-medium">Select Chain </label>
      <select className="mt-1 w-full border rounded-xl p-2">
        <option value="anvil">Anvil (Local)</option>
        <option value="sepolia">Sepolia</option>
        <option value="arbitrum">Arbitrum</option>
        <option value="zksync">zkSync</option>
      </select>
    </div> */}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            Create
          </button>
          <button
            className="bg-red-400 px-4 py-2 rounded-xl"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
      </div>
  );
};

export default CreateCollectionForm;
