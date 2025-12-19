import React, { useEffect, useState } from "react";
import {
  NFTCard,
  CollectionCard,
  CardGrid,
  PageHeader,
  TabNavigation,
  FilterBar,
  StatsBar,
} from "../../components";
import { fetchAllCollections } from "../../utils/fetchCollections";
import type { Tab } from "../../components/sections/TabNavigation";
import { FetchedCollection } from "../../services/types";

const MarketPlace: React.FC = () => {
  const [collections, setCollections] = useState<FetchedCollection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("nfts");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  const categories = [
    { id: "all", label: "All" },
    { id: "art", label: "Art" },
    { id: "special", label: "Unmatched" },
    { id: "collections", label: "Collectibles" },
    { id: "rarest", label: "Rare Items" },
    { id: "special", label: "Special Occassion" },
    { id: "music", label: "Special Notes" },
  ];

  // Fetch collections - FIX: Call the function!
  useEffect(() => {
    const loadCollections = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { collections: fetchedCollections, pagination } = await fetchAllCollections();
        
        if (!fetchedCollections) {
          setError("No collections found");
          return;
        }
        
        setCollections(fetchedCollections);
      } catch (err: any) {
        console.error("Error loading collections:", err);
        setError(err.message || "Failed to load collections");
      } finally {
        setLoading(false);
      }
    };

    // CALL THE FUNCTION!
    loadCollections();
  }, [activeCategory, sortBy]); // Re-fetch when filters change

  // Calculate NFTs from collections
  const listedNFTs =
    collections?.reduce((acc, col) => {
      const nfts = col.nfts?.filter((n) => n.isListed) ?? [];
      return acc.concat(nfts);
    }, [] as any[]) ?? [];

  // Calculate stats
  const totalVolume = collections.reduce((sum, col) => sum + (col.volume || 0), 0);
  const lowestFloorPrice = collections
    .filter((col) => col.floorPrice > 0)
    .reduce((min, col) => Math.min(min, col.floorPrice), Infinity);

  const tabs: Tab[] = [
    { id: "nfts", label: "NFTs", count: listedNFTs.length },
    { id: "collections", label: "Collections", count: collections.length },
  ];

  // Filter collections by category
  const filteredCollections =
    activeCategory === "all"
      ? collections
      : collections.filter((col) => col.category === activeCategory);

  return (
    <div className="min-h-screen bg-os-bg-primary">
      {/* Header */}
      <PageHeader
        title="Explore NFTs"
        description="Discover, collect, and sell extraordinary NFTs"
      />

      {/* Tabs & Filters */}
      <div className="border-b border-os-border bg-os-bg-tertiary sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="pt-4 pb-4">
            <FilterBar
              filters={categories}
              activeFilter={activeCategory}
              onFilterChange={setActiveCategory}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <StatsBar
          stats={[
            {
              label: "Total Volume",
              value: totalVolume > 0 ? `${totalVolume.toFixed(1)} ETH` : "0 ETH",
            },
            {
              label: "Floor Price",
              value:
                lowestFloorPrice !== Infinity
                  ? `${lowestFloorPrice.toFixed(2)} ETH`
                  : "0.08 ETH",
            },
            {
              label: "Items",
              value:
                activeTab === "nfts"
                  ? listedNFTs.length
                  : filteredCollections.length,
            },
          ]}
          action={
            <select
              className="input text-sm py-2 w-48"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Recently Listed</option>
              <option value="oldest">Oldest First</option>
              <option value="items">Most Items</option>
            </select>
          }
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-os-blue"></div>
            <p className="mt-4 text-os-text-secondary">Loading collections...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-os-red mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        )}

        {/* NFTs Grid */}
        {activeTab === "nfts" && !loading && !error && (
          <>
            {listedNFTs.length > 0 ? (
              <CardGrid cols={{ sm: 3, md: 4, lg: 6, xl: 8 }}>
                {listedNFTs.map((nft: any) => (
                  <NFTCard
                    key={nft.id}
                    {...nft}
                    context="marketplace"
                    loading={false}
                    onClick={() => console.log("View NFT:", nft.id)} 
                    onFavorite={() => console.log("Favorite:", nft.id)}
                    onBuy={() => console.log("Buy NFT:", nft.id)}
                  />
                ))}
              </CardGrid>
            ) : (
              <div className="text-center py-12">
                <p className="text-os-text-secondary">No NFTs listed yet</p>
              </div>
            )}
          </>
        )}

        {/* Collections Grid */}
        {activeTab === "collections" && !loading && !error && (
          <>
            {filteredCollections.length > 0 ? (
              <CardGrid cols={{ sm: 2, md: 3, lg: 5, xl: 7 }}>
                {filteredCollections.map((col) => (
                  <CollectionCard
                    key={col.id}
                    id={Number(col.id)}
                    name={col.name}
                    cover={col.cover}
                    items={col.items}
                    floorPrice={BigInt(col.floorPrice)}
                    volume={col.volume}
                    creator={col.creator}
                    loading={false}
                    onClick={() => {
                      // Navigate to collection page
                      window.location.href = `/collection/${col.id}`;
                    }}
                  />
                ))}
              </CardGrid>
            ) : (
              <div className="text-center py-12">
                <p className="text-os-text-secondary">
                  No collections found in this category
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MarketPlace;
