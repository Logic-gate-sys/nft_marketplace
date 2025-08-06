import { useState } from "react";
import axios from 'axios';
import { Spinner, Popup, connectWallet ,CollectionCard} from '../components/helperComponents.jsx';
import FormData from 'form-data';
import { MintForm } from "../components/MintForm.jsx";


const UploadPage = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [user_id, setUserId] = useState("");
    const [isloading, setLoading] = useState(false);
    const [wantToMint, setWantToMint] = useState(false);
    const [formErrors, setFormErrors] = useState({})
    // form data should look this way
    const [formData, setFormData] = useState({
        name: "Cyber Ape",
        desc: "",
        background_col: "Galaxy",
        body: "Robot",
        eye: "Laser",
        file: null,
    });
// backend should handle token id counter
     
   
  //on change 
  const handleChange = (e) => {
      const { name, value, type, files } = e.target;
      
    if (type === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
   
    // ------------ handle wallet connect -------------------
  const handleWallectConnect = async () => {
    try {
      const address = await connectWallet();
      if (address) {
        setWalletAddress(address);
        setWantToMint(true)
      }
      console.log("USER WALLET : ", address);
    } catch (error) {
      console.log(error);
    }
    }
    
    // ------------------ get user id from db -----------------------
  const getUserId = async () => {
    try {
      //user id 
      const { data } = await axios.get(`http://localhost:3000/api/users/wallet/${walletAddress}`);
      // if user is not found
      if (!data) console.error();
      const { id } = data;
      console.log("ID FROM GET REQUEST: ", id);
      // set user id 
      setUserId(id);
      return id;
    } catch (error) {
      console.log(error);
    }
    }

    // ------------- handle submit ---------------------
    const handleSubmit = async (e) => {
      e.preventDefault();
        try {
           // --- Validate form ---------------
        if (!validateForm()) {
            alert("All fields in form must be entered");
            setWantToMint(true)
            return ;
        }
        //---------- start loader -------------------
        setLoading(true);
         
          //---------- get id --------------
          if (!walletAddress) {
            console.log("No User Address Yet");
            return;
          }
          const id = await getUserId();
          
        // --------- Work with Formdata ----------------

          const payload = new FormData();
          for (const key in formData) {
              payload.append(key, formData[key]);
          }
          const res = await axios.post(`http://localhost:3000/api/nfts/${id}`, payload);
          console.log("RESULT OF MINTING ", res.data);
          
      } catch (error) {
          console.log(error);
      }
      finally {
          setLoading(false);
          // close mint form 
          setWantToMint(false)
      }
 };
    
     // validate form
    const validateForm = () => {
        let errors = {}
        if (!formData.name.trim()) errors.name = "Name field cannot be empty";
        if (!formData.desc.trim()) errors.desc = "Description cannot be empty";
        if (formData.desc.trim().length > 150) errors.desc = "Description should not be more than 150 characters";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }
   
    return (
      <div id='upload-page'>
      <div className="p-6 text-white flex flex-col items-center">
      <div className="flex flex-col">
      <h1 className="text-3xl font-extrabold mb-3 text-center">UPLOAD WORK FOR MINTING</h1>
      <p className="text-lg text-gray-300 mb-6 max-w-3xl text-center">
       Store up to  1,000 unique collectible characters with proof of ownership stored on the Ethereum blockchain.
          </p>
              {!wantToMint && <button onClick={handleWallectConnect} className="bg-[#A259FF] border-0 rounded-2xl px-6 py-2 text-md font-semibold self-end">Mint NFT</button>}
        </div>
                {wantToMint &&
                    <MintForm setWantToMint={setWantToMint} handleChange={handleChange} handleSubmit={handleSubmit} formData={formData} formErrors={formErrors}/>          
                }
            </div>
             <div id="user-collection" className="flex flex-col ">
                <h1 className="text-3xl font-bold mb-4"> My Collection </h1>
                <div className="flex flex-col">
                  <CollectionCard/>
                </div>
             
         </div>
            {isloading && <Spinner />}
        </div>
  );
};

export default UploadPage;
