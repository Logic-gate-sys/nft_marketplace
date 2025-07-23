const UploadPage = () =>{
    return (
        <div id='upload-container' className="m-auto flex flex-col gap-3 items-center justify-center">
         <div id="info" className="flex flex-col gap-1 p-3">
            <h1 className="text-3xl font-extrabold p-2">UPLOAD WORK FOR MINTING</h1>
                <span className="text-xl font-semibold text-wrap tracking-wide text-justify">10,000 unique collectible characters with proof
                    of ownership stored on the Ethereum blockchain.
                </span>         
          </div>
            <div id="inputs-container" className="flex flex-wrap gap-4">
                <form id='file-details-inputs' action="" className=" w-max h-max flex  flex-col gap-2">
                 <input type="text" placeholder="Title"  className="border-1  p-3 rounded-xl bg-gray-700"/>
                 <textarea name="description" id="description"  placeholder="Description" className="min-h-80 border-1  p-2 rounded-xl bg-gray-700" />
                 <select name="license" id="license" className="border-1 p-3 rounded-xl bg-gray-700">
                      <option value="">-- Choose License --</option>
                      <option value="exclusive-rights">Exclusive Rights (Only One Buyer Owns All Rights)</option>
                      <option value="non-exclusive">Non-Exclusive Rights (Artist Retains Rights, Others Can License)</option>
                      <option value="personal-use">Personal Use Only (No Commercial Rights)</option>
                      <option value="commercial-use">Commercial Use (Buyer Can Use for Branding/Ads)</option>
                      <option value="royalty-free">Royalty-Free (One-Time Purchase, Broad Use Allowed)</option>
                    </select>
                    <input type="text"/>
                </form>
                <form id='file-upload' action="" className="bg-[#30275c]  flex flex-col justify-center items-center p-4 text-white ">
                    <label htmlFor="artwork" className="block text-sm font-medium text-white p-4">
                    Upload Artwork
                  </label>
                  <input
                    type ="file"
                    id ="artwork"
                    name ="artwork"
                    accept =".jpg,.jpeg,.png,.svg"
                        class ="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md 
                        file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                       />
                    </form>
                 </div>
                 <button type='submit' className="bg-[#A259FF] p-2 rounded-xl font-semi-bod text-lg">Mint into NFT</button>
        </div>
    )
}

export default UploadPage;