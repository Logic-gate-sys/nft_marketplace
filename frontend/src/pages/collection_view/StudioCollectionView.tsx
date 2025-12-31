import React, { useState, useMemo, useEffect } from "react";
import { PriceModal } from "../../components/ui/PriceModal";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getWriteContractInstance, UnlistToken } from "../../ether/contract_interaction";
import { MARKETPLACE_SEPOLIA_ABI, MARKETPLACE_SEPOLIA_ADDRESS } from "../../../../shared/constants/contracts";
import {
  NFTCard,
  CardGrid,
  TabNavigation,
  EmptyState,
  MintForm,
} from "../../components";
import type { Tab } from "../../components/sections/TabNavigation";
import { FetchedCollection } from "../../services/types";
import { fetchCollectionById } from "../../utils/fetchCollections";
import { useAuth } from "../../context/AuthContext";

const StudioCollectionView: React.FC = () => {
  //dynamic collection url id
  const { col_id } = useParams<{ col_id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<string>("items");
  const [filterStatus, setFilterStatus] = useState< "all" | "listed" | "unlisted" >("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [collection, setCollection] = useState<FetchedCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wantToMint, setWantToMint] = useState(false);

  // **NEW: Modal State**
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState<any | null>(null);
  const { signer } = useAuth();

  // Determine context from route
  const isStudioContext = location.pathname.includes("/studio/collection");

  // Fetch collection data
  useEffect(() => {
    const fetchCollection = async () => {
      if (!col_id) {
        setError("Collection ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        if (!col_id) {
          return;
        }
        const coll_id = Number(col_id);
        if (!coll_id || Number.isNaN(coll_id)) {
          setLoading(false);
          setError("Collection id is not defined !");
          return;
        }
        console.log("COLLECTION ID ", coll_id);
        const { collection } = await fetchCollectionById(coll_id);

        if (!collection) {
          throw new Error("Collection not found, Failed to fetch collection");
        }

        setCollection(collection);
      } catch (err: any) {
        console.error("Error fetching collection:", err);
        setError(err.message || "Failed to load collection");
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [col_id, wantToMint]);

  // Get NFTs from collection
  const collectionNFTs = useMemo(() => {
    if (!collection?.nfts || !Array.isArray(collection.nfts)) {
      return [];
    }
    return collection.nfts;
  }, [collection]);

  // Apply filters and sorting
  const filteredNFTs = useMemo(() => {
    let filtered = [...collectionNFTs];

    // Filter by status
    if (isStudioContext) {
      if (filterStatus === "listed") {
        filtered = filtered.filter((nft) => nft.isListed);
      } else if (filterStatus === "unlisted") {
        filtered = filtered.filter((nft) => !nft.isListed);
      }
    } else {
      // In marketplace, only show listed items
      filtered = filtered.filter((nft) => nft.isListed);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name":
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "recent":
      default:
        // Keep default order (most recent first)
        break;
    }

    return filtered;
  }, [collectionNFTs, filterStatus, sortBy, isStudioContext]);

  // Tab configuration
  const tabs: Tab[] = useMemo(
    () => [
      { id: "items", label: "Items", count: filteredNFTs.length },
      { id: "activity", label: "Activity" },
    ],
    [filteredNFTs.length]
  );

  // **MODIFIED: Open modal instead of direct listing**
  const handleSelection = (nft: any) => {
    setSelectedNft(nft);
    setPriceModalOpen(true);
  };


  

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-os-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-os-blue"></div>
          <p className="mt-4 text-os-text-secondary">Loading collection...</p>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !collection) {
    return (
      <div className="min-h-screen bg-os-bg-primary flex items-center justify-center">
        <EmptyState
          icon={
            <svg
              className="w-16 h-16 text-os-text-tertiary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="Collection not found"
          description={
            error || "This collection doesn't exist or has been removed"
          }
          action={
            <button
              className="btn-primary"
              onClick={() =>
                navigate(isStudioContext ? "/studio" : "/marketplace")
              }
            >
              {isStudioContext ? "Back to Studio" : "Back to Marketplace"}
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-os-bg-primary">
      {/* Collection Header */}
      <div className="relative bg-os-bg-secondary border-b border-os-border">
        {/* Banner */}
        <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
          {collection.cover ? (
            <img
              src={collection.cover}
              alt={`${collection.name} banner`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div
            className={`w-full h-full bg-gradient-to-br from-opensea-blue via-os-purple to-opensea-blue ${
              collection.cover ? "hidden" : ""
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-os-bg-secondary/80" />
        </div>

        {/* Collection Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-6">
          {/* Logo & Actions */}
          <div className="flex items-end justify-between gap-4 mb-6">
            <div className="flex items-end gap-4">
              {/* Logo */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-os-bg-secondary bg-os-bg-elevated overflow-hidden shadow-os-lg flex-shrink-0">
                {collection.logo || collection.cover ? (
                  <img
                    src={collection.logo || collection.cover}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove(
                        "hidden"
                      );
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-opensea-blue to-os-purple ${
                    collection.logo || collection.cover ? "hidden" : ""
                  }`}
                >
                  <span className="text-white text-4xl font-bold">
                    {collection.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Studio Context Only */}
            {isStudioContext && (
              <div className="flex gap-2 mb-2">
                <button className="btn-primary">{collection.type}</button>
              </div>
            )}
          </div>

          {/* Collection Details */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-os-text-primary">
              {collection.name}
            </h1>

            {collection.description && (
              <p className="text-os-text-secondary text-sm sm:text-base max-w-3xl">
                {collection.description}
              </p>
            )}

            <p className="text-os-text-secondary text-sm sm:text-base">
              Created by{" "}
              <span className="text-opensea-blue font-semibold">
                {collection.creatorName || collection.creator}
              </span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div>
                <p className="text-os-text-tertiary text-xs uppercase mb-1">
                  Items
                </p>
                <p className="text-os-text-primary text-xl font-bold">
                  {collection.items || 0}
                </p>
              </div>
              <div>
                <p className="text-os-text-tertiary text-xs uppercase mb-1">
                  Listed
                </p>
                <p className="text-os-text-primary text-xl font-bold">
                  {collection.listedItems || 0}
                </p>
              </div>
              {collection.floorPrice > 0 && (
                <div>
                  <p className="text-os-text-tertiary text-xs uppercase mb-1">
                    Floor Price
                  </p>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-os-text-tertiary"
                      fill="currentColor"
                      viewBox="0 0 320 512"
                    >
                      <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                    </svg>
                    <p className="text-os-text-primary text-xl font-bold">
                      {collection.floorPrice.toFixed(3)}
                    </p>
                  </div>
                </div>
              )}
              {collection.volume > 0 && (
                <div>
                  <p className="text-os-text-tertiary text-xs uppercase mb-1">
                    Total Volume
                  </p>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-os-text-tertiary"
                      fill="currentColor"
                      viewBox="0 0 320 512"
                    >
                      <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                    </svg>
                    <p className="text-os-text-primary text-xl font-bold">
                      {collection.volume.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "items" && (
          <div>
            {/* Filters & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-os-text-secondary text-sm">
                {filteredNFTs.length}{" "}
                {filteredNFTs.length === 1 ? "item" : "items"}
              </p>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {/* Mint Button - Studio Only */}
                {isStudioContext && (
                  <button
                    className="btn-primary"
                    onClick={() => setWantToMint(true)}
                  >
                    Mint NFT
                  </button>
                )}
              </div>
            </div>

            {/* NFT Grid */}
            {filteredNFTs.length === 0 ? (
              <EmptyState
                icon={
                  <svg
                    className="w-16 h-16 text-os-text-tertiary"
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
                }
                title={
                  filterStatus === "all"
                    ? "No items in this collection"
                    : `No ${filterStatus} items`
                }
                description={
                  isStudioContext
                    ? "Start by minting your first NFT into this collection"
                    : "Check back later for new items"
                }
                action={
                  isStudioContext ? (
                    <button
                      className="btn-primary"
                      onClick={() => setWantToMint(true)}
                    >
                      Mint Your First NFT
                    </button>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={() => navigate("/marketplace")}
                    >
                      Explore Marketplace
                    </button>
                  )
                }
              />
            ) : (
              <CardGrid cols={{ sm: 3, md: 3, lg: 4, xl: 5 }}>
                {filteredNFTs.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    tokenId={nft?.tokenId}
                    col_name={collection.name}
                    id={nft.id}
                    image={nft.uri}
                    price={nft?.currentPrice}
                    lastPrice={nft?.basePrice}
                    status={nft?.status }
                    context={isStudioContext ? "studio" : "marketplace"}
                    loading={false}
                    onUnlist={isStudioContext && nft.status==='listed' ? () => handleSelection(nft) : undefined}
                    onList={isStudioContext && nft.status==='unlisted' ? ()=> handleSelection(nft)  : undefined }
                  />
                ))}
              </CardGrid>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <EmptyState
            icon={
              <svg
                className="w-16 h-16 text-os-text-tertiary"
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
            }
            title="No activity yet"
            description="Collection activity will appear here"
          />
        )}
      </div>

      {/* Modals */}
      {wantToMint && (
        <MintForm
          type={collection.type}
          col_id={collection.id}
          col_address={collection.contractAddress}
          col_owner={collection.creator}
          owner_id={String(collection.creatorId)}
          setWantToMint={setWantToMint}
        />
      )}

      {/* **NEW: Price Modal** */}
      <PriceModal
        isOpen={priceModalOpen}
        tokenId={selectedNft?.tokenId || 0}
        nftAddress={collection?.contractAddress}
        listStatus={selectedNft?.status}
        onClose={() => {
        setPriceModalOpen(false);
        setSelectedNft(null);
        }}
      />
    </div>
  );
};

export default StudioCollectionView;
