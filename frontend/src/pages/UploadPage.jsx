import { useState } from "react";
import axios from 'axios';
import { Spinner, Popup,connectWallet } from '../components/helperComponents.jsx';



const UploadPage = () => {
    const [userAddress, setUserAddress] = useState("");
    const [user_id, setUserId] = useState("");
    const [isloading, setIsLoading] = useState(false);
    const [wantToMint, setWanToMint] = useState(false);
    let tokenIdCounter = 0;
    // form data should look this way
    const [formData, setFormData] = useState({
        name: "Cyber Ape",
        desc: "",
        background_col: "Galaxy",
        body: "Robot",
        eye: "Laser",
        tokenId: ++tokenIdCounter,
        file: null,
    });
     
   
  //on change 
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
    const handleSubmit = async (e) => {
     setIsLoading(true);
      const userWallet = await connectWallet();
       if (!userWallet) {
        alert("Undefined user address ! ");
        return;
       }
     setUserAddress(userWallet);  
      e.preventDefault();
      try {
          const payload = new FormData();
          for (const key in formData) {
              payload.append(key, formData[key]);
          }
    
          //user id 
          const { data } = await axios.get(`http://localhost:3000/api/users/wallets/${userWallet}`);
          // if user is not found
          if (!data) console.error();
          const { id } = data;

          // set user id 
          setUserId(id)
          console.log(user_id);

          const res = await axios.post(`http://localhost:3000/api/nfts/${id}`, payload, { headers: { "Content-Type": "multipart/form-data" } });
          console.log("RESULT OF MINTING " , res);
      } catch (error) {
          console.log(error);
      }
      finally {
          setIsLoading(false);
          // close mint form 
          setWanToMint(false)
      }
  };

    return (
      <div id='upload-page'>
      <div className="p-6 text-white flex flex-col items-center">
      <div className="flex flex-col">
      <h1 className="text-3xl font-extrabold mb-3 text-center">UPLOAD WORK FOR MINTING</h1>
      <p className="text-lg text-gray-300 mb-6 max-w-3xl text-center">
       Store up to  1,000 unique collectible characters with proof of ownership stored on the Ethereum blockchain.
          </p>
              {!wantToMint && <button onClick={wantToMint => setWanToMint(true)} className="bg-[#A259FF] border-0 rounded-2xl px-6 py-2 text-md font-semibold self-end">Mint NFT</button>}
        </div>
          {wantToMint && <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl bg-[#1e1e2f] p-6 rounded-xl"
          >
              {/* Column 1 */}
              <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                      <label className="w-32 font-medium">NFT Title</label>
                      <select
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="flex-1 p-2 rounded bg-gray-700"
                      >
                          <option value="Cyber Ape">Cyber Ape</option>
                          <option value="Pixel Bot">Pixel Bot</option>
                          <option value="Neo Samurai">Neo Samurai</option>
                      </select>
                  </div>

                  <div className="flex items-start gap-4">
                      <label className="w-32 font-medium pt-2">Description</label>
                      <textarea
                          name="desc"
                          placeholder="A short description of NFT .... not more that 80 words"
                          value={formData.desc}
                          onChange={handleChange}
                          className="flex-1 p-2 rounded bg-gray-700 min-h-[120px]"
                      />
                  </div>

                  <div className="flex items-center gap-4">
                      <label className="w-32 font-medium">Background</label>
                      <select
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
                      <label className="w-32 font-medium">Body</label>
                      <select
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

              {/* Column 2 */}
              <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                      <label className="w-32 font-medium">Eye Style</label>
                      <select
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

                  <div className="flex items-center gap-4">
                      <label className="w-32 font-medium">Artwork</label>
                      <input
                          type="file"
                          name="file"
                          accept=".jpg,.jpeg,.png,.svg"
                          onChange={handleChange}
                          className="flex-1 text-sm file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 bg-gray-700"
                      />
                  </div>
                  <div className="self-end flex gap-4">
                  <button type="submit"
                      className="bg-[#A259FF] mt-3 px-5 py-2 rounded-2xl font-semibold text-lg active:scale-0.95 hover:bg-purple-500 w-fit self-center "
                  >
                      Mint NFT
                   </button>
                            <button
                            onClick={wantToMint =>setWanToMint(false)}
                      className="bg-red-400  mt-3 px-5 py-2 rounded-2xl font-semibold text-lg active:scale-0.95 hover:bg-purple-500 w-fit self-center "
                  >
                     Cancel
                    </button>
                 </div>
              </div>
                </form>
                }
            </div>
             <div id="user-collection" className="flex flex-col ">
                <h1 className="text-3xl font-bold mb-4">My Collection </h1>
                {!wantToMint && <div className="max-h-[400px] flex flex-col gap-3  w-auto overflow-x-auto whitespace-nowrap scrollbar-hide space-x-4">
                    <div className="min-w-[200px] bg-gray-300 p-4 rounded">Item 1</div>
                    <div className="min-w-[200px] bg-gray-300 p-4 rounded">Item 2</div>
                    <div className="min-w-[200px] bg-gray-300 p-4 rounded">Item 3</div>
                    <div className="min-w-[200px] bg-gray-300 p-4 rounded">Item 1</div>
                    <div className="min-w-[200px] bg-gray-300 p-4 rounded">Item 2</div>
                    <div className="min-w-[200px] bg-gray-300 p-4 rounded">Item 3</div>
                    <div className="min-w-[200px] bg-gray-300 p-4 rounded">Item 1</div>
                    <div className="min-w-[200px] bg-gray-300 p-4 rounded">Item 2</div>
                    <div className="min-w-[200px] bg-gray-300 p-4 rounded">Item 3</div>
                    <div className="min-w-[200px] bg-gray-300 p-4 rounded">Item 1</div>
                    <div className="min-w-[200px] bg-gray-300 p-4 rounded">Item 2</div>
                    <div className="min-w-[200px] bg-gray-300 p-4 rounded">Item 3</div>
                </div>}
         </div>
            {isloading && <Spinner />}
        </div>
  );
};

export default UploadPage;
