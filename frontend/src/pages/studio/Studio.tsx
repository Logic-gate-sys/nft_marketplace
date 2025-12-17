import React, { useState, useEffect } from "react";
import { CollectionFormData, FetchedCollection } from "../../services/types";
import { useNavigate } from "react-router-dom";
import {
  CollectionCard,
  NFTCard,
  CardGrid,
  PageHeader,
  TabNavigation,
  SectionHeader,
  EmptyState,
  CreateCollectionForm,
  PopupMessageBox,
} from "../../components";
import type { Tab } from "../../components/sections/TabNavigation";
import { fetchUserCollection } from "../../utils/fetchCollections";
import { useAuth } from "../../context/AuthContext";

const Studio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("collections");
  const [filterStatus, setFilterStatus] = useState<"all" | "listed" | "unlisted" >("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [collections, setCollections] = useState<FetchedCollection[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { user, token, wallet} = useAuth();

  // Fetch user's collections
  useEffect(() => {
    if (!user || !token) {
      setError("Error , Please connect your wallet");
      return;
    }
    console.log("WALLET: ", wallet);
    setLoading(true);
    const loadCollections = async () => {
      // Only fetch if user is authenticated
      if (!user || !token) {
        console.log("No user/token, skipping collection fetch");
        setLoading(false);
        return;
      }

      try {
        setError(null);

        //
        const { collections, pagination } = await fetchUserCollection(token);

        if (!collections) {
          setError("No collections found");
          return;
        }
        //update collection state
        setCollections(collections);
        console.log("Loaded collections:", collections.length);
        setLoading(false)
      } catch (err: any) {
        console.error("Error loading collections:", err);
        setError(err.message || "Failed to load collections");
        setLoading(false);
        return;
      }
    };

    loadCollections();
  }, [user, token]);

  // Navigation Tabs on the Studio page
  const tabs: Tab[] = [
    { id: "collections", label: "Collections", count: collections.length },
    { id: "nfts", label: "NFTs", count: 0 },
    { id: "activity", label: "Activity" },
  ];

  const handleCreateCollection = (data: CollectionFormData) => {
    console.log("Creating collection with data:", data);
    // TODO: Implement actual collection creation logic
    setShowSuccessMessage(true);
  };

  return (
    <div className="min-h-screen bg-os-bg-primary">
      {/* Header */}
      <PageHeader
        title="My Studio"
        description="Manage your collections and NFTs"
      />

      {/* Tabs */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Collections Tab */}
        {activeTab === "collections" && (
          <div>
            <SectionHeader
              title="My Collections"
              subtitle={`${collections.length} ${
                collections.length === 1 ? "collection" : "collections"
              }`}
              action={
                <button
                  className="btn-primary"
                  onClick={() => setIsFormOpen(true)}
                >
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
                </button>
              }
            />

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-os-blue"></div>
                <p className="mt-4 text-os-text-secondary">
                  Loading collections...
                </p>
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

            {/* Empty State */}
            {!loading && !error && collections.length === 0 && (
              <EmptyState
                icon={
                  <svg
                    className="w-8 h-8 text-os-text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                }
                title="No collections yet"
                description="Create your first collection to get started"
                action={
                  <button
                    className="btn-primary"
                    onClick={() => setIsFormOpen(true)}
                  >
                    Create Collection
                  </button>
                }
              />
            )}

            {/* Collections Grid */}
            {!loading && !error && collections.length > 0 && (
              <CardGrid cols={{ sm: 3, md: 4, lg: 6, xl: 8 }}>
                {collections.map((col) => (
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
                    onClick={() => navigate(`/studio/collection/${col.id}`)}
                  />
                ))}
              </CardGrid>
            )}
          </div>
        )}

        {/* NFTs Tab */}
        {activeTab === "nfts" && (
          <div>
            <SectionHeader
              title="My NFTs"
              subtitle="Coming soon"
              action={
                <div className="flex gap-2">
                  <select
                    className="input text-sm py-2"
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(
                        e.target.value as "all" | "listed" | "unlisted"
                      )
                    }
                  >
                    <option value="all">All NFTs</option>
                    <option value="listed">Listed</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                </div>
              }
            />

            <EmptyState
              icon={
                <svg
                  className="w-8 h-8 text-os-text-tertiary"
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
              title="NFT view coming soon"
              description="Individual NFT management will be available soon"
              action={
                <button
                  className="btn-primary"
                  onClick={() => setActiveTab("collections")}
                >
                  View Collections
                </button>
              }
            />
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <EmptyState
            icon={
              <svg
                className="w-8 h-8 text-os-text-tertiary"
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
            description="Your transaction history will appear here"
          />
        )}
      </div>

      {/* Create Collection Modal */}
      <CreateCollectionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateCollection}
      />

      {/* Success Message */}
      {showSuccessMessage && (
        <PopupMessageBox
          message="Collection created successfully! Your collection is now live on the blockchain."
          type="success"
          onClose={() => setShowSuccessMessage(false)}
          autoClose={true}
          autoCloseDuration={5000}
        />
      )}
    </div>
  );
};

export default Studio;
