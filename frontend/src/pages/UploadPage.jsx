import { useState ,useEffect} from "react";
import axios from 'axios';
import { Spinner, Popup ,CollectionCard,Loader} from '../components/helperComponents.jsx';
import FormData, { promises } from 'form-data';
import { MintForm } from "../components/MintForm.jsx";
import { connectWallet } from "../ether/contract_interaction_sepolia.js";


const UploadPage = ({id}) => {
  const [isloading, setLoading] = useState(false);
  const [wantToMint, setWantToMint] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [mintSuccess, setMintSuccess] = useState(false);

  //-------- collections fetching  ---------------------
  const [collections, setCollections] = useState([]);
  const [fetchingCols, setFetchingCols] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);

  //------- form data should look this way --------------
  const [formData, setFormData] = useState({
        name: "Cyber Ape",
        desc: "",
        background_col: "Galaxy",
        body: "Robot",
        eye: "Laser",
        file: null,
    });
  
  if (!id) {
    console.log("Please connect your wallet ! to see your collection or mint");
  }


  //------------------- useEffects -------------------------------------------
  const fetchPinataMetaData = async (ipfs_url) => { 
    try {
      const cid = ipfs_url.replace('ipfs://', '');
      const gateway_uri = `https://gateway.pinata.cloud/ipfs/${cid}`;
      //let's now fetch metadata 
      const res = await fetch(gateway_uri);
      const metadata = await res.json();
      console.log("Metata data:  ", metadata);
      return metadata;
    } catch (error) {
      console.error('Error fetching metadata: ', error);
    }
  }


  useEffect(() => {
   const getCollection = async () => {
       // set loader for data fetching
       setFetchingCols(true);
       if (id) {
         try {
           const response = await axios.get(`http://localhost:3000/api/nfts/users/${id}`);
           const nft_raw = response.data;

          const withMetadata = await Promise.all(
          nft_raw.map(async (nft) => {
            const metadata = await fetchPinataMetaData(nft.ipfs_url);
          return { ...nft, metadata };
          })
    );
           setCollections(withMetadata);
           setSelectedNFT(withMetadata[1]);
           //stop fetching loader 
           console.log("WITH METADATA: ", withMetadata);
           console.log("Collections ", collections);
           setFetchingCols(false);
         } catch (err) {
           console.error("Failed to fetch collections:", err);
         }
       }
     };
    getCollection();
   }, [id,mintSuccess]);
  
  // ----------------- handle changes in form ----------------------------------
  const handleChange = (e) => {
      const { name, value, type, files } = e.target;
      
    if (type === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
   
//------------- submit nft for minting -----------------------
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          
        if (!validateForm()) {
            alert("All fields in form must be entered");
            setWantToMint(true)
            return ;
        }
        setLoading(true); // start loader 

          const payload = new FormData();
          for (const key in formData) {
              payload.append(key, formData[key]);
          }
          const res = await axios.post(`http://localhost:3000/api/nfts/${id}`, payload);
          console.log("RESULT OF MINTING ", res.data);
        alert("NFT CREATED SUCESSFULLY", res.data);
        setMintSuccess(true); //<-------------- mint success
        return;
      } catch (error) {
          console.log(error);
      }
      finally {
          setLoading(false);
          // close mint form 
          setWantToMint(false)
      }
    };
  
  
  
    
  // --------------- validate form ---------------------------------------------
  
    const validateForm = () => {
        let errors = {}
        if (!formData.name.trim()) errors.name = "Name field cannot be empty";
        if (!formData.desc.trim()) errors.desc = "Description cannot be empty";
        if (formData.desc.trim().length > 150) errors.desc = "Description should not be more than 150 characters";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }
   
    return (
      <div id='upload-page' className="pb-2">
      <div className="p-6 text-white flex flex-col items-center">
      <div className="flex flex-col">
      <h1 className="text-3xl font-extrabold mb-3 text-center">UPLOAD WORK FOR MINTING</h1>
      <p className="text-lg text-gray-300 mb-6 max-w-3xl text-center">
       Store up to  1,000 unique collectible characters with proof of ownership stored on the Ethereum blockchain.
          </p>
              {!wantToMint && <button onClick={()=>setWantToMint(true)} className="bg-[#A259FF] border-0 rounded-2xl px-6 py-2 text-md font-semibold self-end ">Mint NFT</button>}
        </div>
                {wantToMint &&
                    <MintForm setWantToMint={setWantToMint} handleChange={handleChange} handleSubmit={handleSubmit} formData={formData} formErrors={formErrors}/>          
                }
            </div>
          <div id="user-collection" className=" flex flex-col ">
          <h1 className=" text-3xl font-bold mb-4 "> My Collection </h1>
          {fetchingCols ? "Loading...." :
            <div id="col-sub" className="ml-10 mr-10 mt-4 md:flex  flex gap-6 flex-wrap ">
              <div id='user-collections' className="w-fit h-130 p-8  overflow-y-auto overflow-x-hidden bg-gray-600 opacity-70 shadow-xl flex flex-col gap-3">
                {collections.map((nft) => (
                  <div onClick={() => {
                    console.log("SELECTED NFT: ", nft);
                    setSelectedNFT(nft);
                  }} key={nft.id}>
                    <CollectionCard
                      key={nft.id}
                      d data={{
                        image: `https://gateway.pinata.cloud/ipfs/${nft.metadata.image}`,
                        name: nft.metadata.name,
                        token_id: nft.id,
                        status: nft.listed ? "Listed" : "Unlisted",
                      }}
                    />
                  </div>
                ))}
              </div>
              {selectedNFT
                && <div
                  id="item-details"
                  className="h-[130px] w-1/2 flex flex-col bg-gray-800 p-4 rounded-lg gap-4"
                >
                  {/* Image */}
                  <div id="image" className=" border border-amber-50 rounded-lg overflow-hidden">
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${selectedNFT.metadata.image}`}
                      alt={selectedNFT.metadata.name}
                      className=" object-cover"
                    />
                  </div>

                  {/* Description */}
                  <div id="description" className="text-white">
                    <h1 className="text-lg font-bold">{selectedNFT.metadata.name} #{selectedNFT.id}</h1>
                    <p className="text-sm text-gray-400">{selectedNFT.metadata.description}</p>
                  </div>

                  {/* Buttons */}
                  <div id="detail-btn" className="flex gap-2">
                    <button className="bg-[#A259FF] text-white px-3 py-1 rounded-lg hover:bg-purple-700">
                      List
                    </button>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600">
                      Unlist
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
                      Remove
                    </button>
                  </div>
                </div>}
            </div>
          }   
          </div>
            {isloading && <Spinner />}
        </div>
  );
};

export default UploadPage;
