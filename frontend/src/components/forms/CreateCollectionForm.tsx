import React, { useState } from "react";
import {
  CreateCollectionFormProps,
  CollectionFormData,
} from "../../services/types";
import { refreshToken } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import PopupMessageBox from "./../msg_boxes/PopUpMessageBox"

const CreateCollectionForm: React.FC<CreateCollectionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { user, token } = useAuth();

  const [collectionType, setCollectionType] = useState<"onchain" | "offchain">("onchain");
  const [formData, setFormData] = useState<CollectionFormData>({
    owner_id: 0,
    contractAddress: "",
    name: "",
    description: "",
    symbol: "",
    category: "art",
    royalties: 5,
    coverImage: null,
    logoImage: null,
  });

  const [coverPreview, setCoverPreview] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Record<keyof CollectionFormData, string>>>({});
  
  // Status tracking states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error" | "warning">("success");
  const [messageText, setMessageText] = useState("");

  if (!isOpen) return null;

  const showPopupMessage = (type: "success" | "error" | "warning", message: string) => {
    setMessageType(type);
    setMessageText(message);
    setShowMessage(true);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cover" | "logo"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 8MB)
      if (file.size > 8 * 1024 * 1024) {
        showPopupMessage("error", "File size must be less than 8MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        showPopupMessage("error", "Please upload a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "cover") {
          setCoverPreview(reader.result as string);
          setFormData({ ...formData, coverImage: file });
        } else {
          setLogoPreview(reader.result as string);
          setFormData({ ...formData, logoImage: file });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isValidEthereumAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CollectionFormData, string>> = {};

    // Contract Address validation
    if (!formData.contractAddress?.trim()) {
      newErrors.contractAddress = "Contract address is required";
    } else if (!isValidEthereumAddress(formData.contractAddress)) {
      newErrors.contractAddress =
        "Invalid Ethereum address format (must be 0x followed by 40 hex characters)";
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Collection name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Symbol validation
    if (!formData.symbol.trim()) {
      newErrors.symbol = "Symbol is required";
    } else if (formData.symbol.length > 5) {
      newErrors.symbol = "Symbol must be 5 characters or less";
    } else if (formData.symbol.length < 2) {
      newErrors.symbol = "Symbol must be at least 2 characters";
    }

    // Royalties validation
    if (formData.royalties < 0 || formData.royalties > 10) {
      newErrors.royalties = "Royalties must be between 0% and 10%";
    }

    // Off-chain collections require cover image
    if (collectionType === "offchain" && !formData.coverImage) {
      newErrors.coverImage = "Cover image is required for off-chain collections";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handle_collection_creation = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!token || !user) {
      showPopupMessage("warning", "Please connect your wallet to create a collection");
      return;
    }

    // Validate form
    if (!validate()) {
      showPopupMessage("error", "Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    // Helper function to create FormData (for retries)
    const createFormData = () => {
      const uploadFormdata = new FormData();
      uploadFormdata.append("owner_id", String(user.id));
      uploadFormdata.append("contractAddress", formData.contractAddress);
      uploadFormdata.append("name", formData.name);
      uploadFormdata.append("description", formData.description);
      uploadFormdata.append("symbol", formData.symbol);
      uploadFormdata.append("category", formData.category);
      uploadFormdata.append("royalties", formData.royalties.toString());
      uploadFormdata.append("type", collectionType);

      if (formData.coverImage) {
        uploadFormdata.append("files", formData.coverImage);
      }
      if (formData.logoImage) {
        uploadFormdata.append("files", formData.logoImage);
      }

      return uploadFormdata;
    };

    try {
      // First attempt
      let res = await fetch(`${BASE_URL}/collections/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: createFormData(),
      });

      // If 401, try to refresh token and retry
      if (res.status === 401) {
        const newToken = await refreshToken();

        if (newToken) {
          // Retry with new token
          res = await fetch(`${BASE_URL}/collections/create`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
            body: createFormData(),
          });
        } else {
          throw new Error("Session expired. Please reconnect your wallet.");
        }
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create collection");
      }

      const responseData = await res.json();
      
      // Success
      showPopupMessage("success", `Collection "${formData.name}" created successfully!`);
      
      // Call parent onSubmit if provided
      if (onSubmit) {
        onSubmit({ ...formData, type: collectionType });
      }

      // Reset form and close after a delay
      setTimeout(() => {
        handleReset();
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error("Error creating collection:", err);
      showPopupMessage("error", err.message || "Failed to create collection. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      owner_id: 0,
      contractAddress: "",
      name: "",
      description: "",
      symbol: "",
      category: "art",
      royalties: 5,
      coverImage: null,
      logoImage: null,
    });
    setCoverPreview("");
    setLogoPreview("");
    setErrors({});
    setCollectionType("onchain");
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in"
        onClick={!isSubmitting ? onClose : undefined}
      >
        <div
          className="bg-os-bg-secondary border border-os-border rounded-xl sm:rounded-2xl shadow-os-lg w-full max-w-2xl max-h-[95vh] flex flex-col animate-slide-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="flex items-start sm:items-center justify-between p-4 sm:p-6 border-b border-os-border flex-shrink-0">
            <div className="flex-1 pr-4">
              <h2 className="text-xl sm:text-2xl font-bold text-os-text-primary">
                Create Collection
              </h2>
              <p className="text-xs sm:text-sm text-os-text-secondary mt-1">
                Import your deployed NFT collection
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-lg hover:bg-os-bg-hover transition-colors text-os-text-secondary hover:text-os-text-primary flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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

          {/* Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
              <div className="bg-os-bg-secondary border border-os-border rounded-xl p-8 flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="w-16 h-16 border-4 border-opensea-blue/30 border-t-opensea-blue rounded-full animate-spin" />
                <div className="text-center">
                  <p className="text-os-text-primary font-semibold text-lg mb-1">
                    Creating Collection...
                  </p>
                  <p className="text-os-text-secondary text-sm">
                    Please wait while we process your request
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form - Scrollable */}
          <form onSubmit={handle_collection_creation} className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Collection Type Selector */}
              <div>
                <label className="block text-sm font-semibold text-os-text-primary mb-3">
                  Collection Type <span className="text-os-red">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCollectionType("onchain")}
                    disabled={isSubmitting}
                    className={`p-4 rounded-xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      collectionType === "onchain"
                        ? "border-opensea-blue bg-opensea-blue/10"
                        : "border-os-border bg-os-bg-hover hover:border-os-border-light"
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <svg
                        className="w-6 h-6 text-opensea-blue"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-os-text-primary mb-1">
                      On-Chain
                    </h3>
                    <p className="text-xs text-os-text-tertiary">
                      Fully decentralized (ERC-721)
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCollectionType("offchain")}
                    disabled={isSubmitting}
                    className={`p-4 rounded-xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      collectionType === "offchain"
                        ? "border-opensea-blue bg-opensea-blue/10"
                        : "border-os-border bg-os-bg-hover hover:border-os-border-light"
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <svg
                        className="w-6 h-6 text-os-purple"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-os-text-primary mb-1">
                      Off-Chain
                    </h3>
                    <p className="text-xs text-os-text-tertiary">Lower gas fees</p>
                  </button>
                </div>
              </div>

              {/* Contract Address */}
              <div>
                <label className="block text-sm font-semibold text-os-text-primary mb-2">
                  Deployed Contract Address <span className="text-os-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.contractAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contractAddress: e.target.value.trim(),
                      })
                    }
                    disabled={isSubmitting}
                    placeholder="0x..."
                    className={`input font-mono text-sm pr-10 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.contractAddress ? "border-os-red focus:ring-os-red" : ""
                    }`}
                  />
                  {formData.contractAddress &&
                    isValidEthereumAddress(formData.contractAddress) && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg
                          className="w-5 h-5 text-os-green"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    )}
                </div>
                {errors.contractAddress && (
                  <p className="text-xs text-os-red mt-1">{errors.contractAddress}</p>
                )}
                <div className="mt-2 p-3 bg-opensea-blue/5 border border-opensea-blue/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-opensea-blue mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-xs text-os-text-secondary">
                      Enter the Ethereum contract address of your deployed ERC-721 NFT
                      collection. Must start with "0x" followed by 40 hexadecimal
                      characters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Collection Name & Symbol */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-os-text-primary mb-2">
                    Collection Name <span className="text-os-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={isSubmitting}
                    placeholder="e.g., Crypto Punks"
                    className={`input disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.name ? "border-os-red focus:ring-os-red" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-os-red mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-os-text-primary mb-2">
                    Symbol <span className="text-os-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.symbol}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        symbol: e.target.value.toUpperCase(),
                      })
                    }
                    disabled={isSubmitting}
                    placeholder="e.g., PUNK"
                    maxLength={5}
                    className={`input disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.symbol ? "border-os-red focus:ring-os-red" : ""
                    }`}
                  />
                  {errors.symbol && (
                    <p className="text-xs text-os-red mt-1">{errors.symbol}</p>
                  )}
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-os-text-primary mb-2">
                  Cover Image{" "}
                  {collectionType === "offchain" ? (
                    <span className="text-os-red">*</span>
                  ) : (
                    <span className="text-os-text-tertiary font-normal">(Optional)</span>
                  )}
                </label>
                <div
                  className={`relative h-32 sm:h-48 border-2 border-dashed rounded-xl overflow-hidden bg-os-bg-hover transition-colors ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    errors.coverImage
                      ? "border-os-red"
                      : "border-os-border hover:border-opensea-blue"
                  }`}
                >
                  {coverPreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverPreview("");
                          setFormData({ ...formData, coverImage: null });
                        }}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 p-1.5 sm:p-2 bg-os-bg-secondary/90 backdrop-blur-sm rounded-lg hover:bg-os-bg-elevated transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-os-text-primary"
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
                  ) : (
                    <label
                      className={`flex flex-col items-center justify-center h-full ${
                        isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      <svg
                        className="w-8 h-8 sm:w-12 sm:h-12 text-os-text-tertiary mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-xs sm:text-sm text-os-text-secondary text-center px-2">
                        Click to upload cover
                      </span>
                      <span className="text-[10px] sm:text-xs text-os-text-tertiary mt-1">
                        Recommended: 1400 x 400px (Max 8MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "cover")}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {errors.coverImage && (
                  <p className="text-xs text-os-red mt-1">{errors.coverImage}</p>
                )}
              </div>

              {/* Logo Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-os-text-primary mb-2">
                  Collection Logo{" "}
                  <span className="text-os-text-tertiary font-normal">(Optional)</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div
                    className={`relative w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed border-os-border rounded-xl overflow-hidden bg-os-bg-hover hover:border-opensea-blue transition-colors flex-shrink-0 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {logoPreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setLogoPreview("");
                            setFormData({ ...formData, logoImage: null });
                          }}
                          disabled={isSubmitting}
                          className="absolute top-1 right-1 p-1 bg-os-bg-secondary/90 backdrop-blur-sm rounded-lg hover:bg-os-bg-elevated transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 text-os-text-primary"
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
                    ) : (
                      <label
                        className={`flex flex-col items-center justify-center h-full ${
                          isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        <svg
                          className="w-6 h-6 sm:w-8 sm:h-8 text-os-text-tertiary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "logo")}
                          disabled={isSubmitting}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-os-text-secondary mb-1">
                      Collection logo image
                    </p>
                    <p className="text-[10px] sm:text-xs text-os-text-tertiary">
                      Recommended: 350 x 350px (Square, Max 8MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-os-text-primary mb-2">
                  Description{" "}
                  <span className="text-os-text-tertiary font-normal">(Optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={isSubmitting}
                  placeholder="Describe your collection..."
                  rows={3}
                  maxLength={500}
                  className="input resize-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-os-text-tertiary mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Category & Royalties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-os-text-primary mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="input disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="art">Art</option>
                    <option value="special">Specials</option>
                    <option value="collectibles">Collectibles</option>
                    <option value="rarest">Rarest</option>
                    <option value="notes_with_love">Love Notes</option>
                    <option value="photography">Photography</option>
                    <option value="music">Music</option>
                    <option value="gaming">Gaming</option>
                    <option value="pfps">PFPs</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-os-text-primary mb-2">
                    Creator Royalties (%)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={formData.royalties}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          royalties: parseFloat(e.target.value),
                        })
                      }
                      disabled={isSubmitting}
                      className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={formData.royalties}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          royalties: parseFloat(e.target.value) || 0,
                        })
                      }
                      disabled={isSubmitting}
                      className="input text-center py-2 w-16 sm:w-20 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  {errors.royalties && (
                    <p className="text-xs text-os-red mt-1">{errors.royalties}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="p-4 sm:p-6 border-t border-os-border bg-os-bg-tertiary flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="btn-secondary order-3 sm:order-1 sm:flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="btn-ghost order-2 sm:flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary order-1 sm:order-3 sm:flex-1 disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 inline-block mr-2 -mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create Collection
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Popup Message */}
      {showMessage && (
        <PopupMessageBox
          message={messageText}
          type={messageType}
          onClose={() => setShowMessage(false)}
          autoClose={true}
          autoCloseDuration={messageType === "success" ? 3000 : 5000}
        />
      )}
    </>
  );
};

export default CreateCollectionForm;
