import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  fetchContractABI,
  getWriteContractInstance,
} from "../../ether/contract_interaction";
import { useAuth } from "../../context/AuthContext";
import {
  approveMarketPlace,
  listToken,
} from "../../ether/contract_interaction";
import {
  MARKETPLACE_SEPOLIA_ABI,
  MARKETPLACE_SEPOLIA_ADDRESS,
} from "../../../../shared/constants/contracts";
import { Loader, Spinner, PopupMessageBox } from "../index";




// **NEW: Price Modal Component**
interface PriceModalProps {
  isOpen: boolean;
  tokenId: number;
  nftAddress?: string;
  currentPrice?: number;
  onClose: () => void;
}

export const PriceModal: React.FC<PriceModalProps> = ({
  isOpen,
  nftAddress,
  tokenId,
  currentPrice,
  onClose,
}) => {
  const [price, setPrice] = useState(currentPrice?.toString() || "");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { wallet, token, signer } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setPrice(currentPrice?.toString() || "");
      setError("");
    }
  }, [isOpen, currentPrice]);

  console.log(
    "SELECTED NFT DETAILS IN  PRICEMODAL COMPONENT",
    nftAddress,
    "Token Id",
    tokenId
  );

  // listing
  const handleListing = async (e: React.FormEvent) => {
    // prevent defualt submit behaviour
    e.preventDefault();
    setIsLoading(true);
    if (!price) {
      setStatus({ type: "error", message: "Provide listing price to contiue" });
      setError(true);
      setIsLoading(false);
      return;
    }

    // convert price to wei
    const price_in_wei = ethers.parseEther(price);
    console.log("PRICE IN WEI", price_in_wei);

    // approve marketPlace
    if (!nftAddress) {
      setStatus({ type: "error", message: "Failed to get nft address" });
      setError(true);
      setIsLoading(false);
      return;
    }

    // signer , token and user validation
    if (!signer || !wallet || !token) {
      setStatus({
        type: "error",
        message: "Dummy, connect wallet first !, haaha",
      });
      setError(true);
      setIsLoading(false);
      return;
    }
    const nftABI = await fetchContractABI(nftAddress, token);

    if (!nftABI) {
      setStatus({
        type: "error",
        message: "Failed to get nft ABI from etherscan",
      });
      setError(true);
      setIsLoading(false);
      return;
    }

    const nftContract = getWriteContractInstance(nftAddress, nftABI, signer);
    // approve market place
    const m_isapproved = await approveMarketPlace(
      nftContract,
      MARKETPLACE_SEPOLIA_ADDRESS,
      tokenId
    );

    if (!m_isapproved) {
      setStatus({
        type: "error",
        message: "NFT approval for marketplace failed",
      });
      setError(true);
      setIsLoading(false);
      return;
    }
    // marketPlace contract
    const marketPlace = getWriteContractInstance(
      MARKETPLACE_SEPOLIA_ADDRESS,
      MARKETPLACE_SEPOLIA_ABI,
      signer
    );

    // finally list token
    const listed = await listToken(
      marketPlace,
      BigInt(tokenId),
      nftAddress,
      price_in_wei
    );
    console.log("Listing Result ======> ", listed);
    if (!listed) {
      setStatus({
        type: "error",
        message: "Could not retrieve listing result",
      });
      setError(true);
      setIsLoading(false);
      return;
    }

    // finally close
    setIsLoading(false);
    setSuccess(true);
    setStatus({ type: "success", message: "Provide listing price to contiue" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-os-bg-elevated rounded-2xl shadow-os-xl p-6 w-full max-w-md mx-4 border border-os-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-os-text-primary">
            Set Listing Price
          </h2>
          <button
            onClick={onClose}
            className="text-os-text-tertiary hover:text-os-text-primary transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleListing}>
          <div className="mb-6">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-os-text-secondary mb-2"
            >
              Price in ETH
            </label>
            <div className="relative">
              <input
                id="price"
                type="number"
                step="0.001"
                min="0"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setError("");
                }}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-os-bg-secondary border border-os-border rounded-xl text-os-text-primary placeholder-os-text-tertiary focus:outline-none focus:ring-2 focus:ring-opensea-blue focus:border-transparent"
                required
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-os-text-tertiary"
                  fill="currentColor"
                  viewBox="0 0 320 512"
                >
                  <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                </svg>
                <span className="text-sm text-os-text-tertiary">ETH</span>
              </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-os-bg-secondary text-os-text-primary rounded-xl hover:bg-os-bg-tertiary transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-opensea-blue text-white rounded-xl hover:bg-opensea-blue/90 transition-colors font-medium"
            >
              List NFT
            </button>
          </div>
        </form>
      </div>
      {error && (
        <PopupMessageBox
          message={status?.message}
          type="error"
          onClose={() => setError(false)}
        />
      )}
      {success && (
        <PopupMessageBox
          message={status?.message}
          type="success"
          onClose={() => setError(false)}
        />
      )}
      {isloading && <Spinner />}
    </div>
  );
};
