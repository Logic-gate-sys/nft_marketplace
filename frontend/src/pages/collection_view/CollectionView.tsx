import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  NFTCard, 
  CardGrid,
  PageHeader,
  TabNavigation,
  EmptyState,
} from '../../components';
import { collections, nfts } from '../../data/sampledata';
import type { Tab } from '../../components/sections/TabNavigation';

const CollectionView: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('items');
  const [filterStatus, setFilterStatus] = useState<'all' | 'listed' | 'unlisted'>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  // Determine context from route
  const isStudioContext = location.pathname.includes('/studio/collection');

  // Find the collection
  const collection = collections.find(col => col.id.toString() === collectionId);

  // Filter NFTs by collection
  const collectionNFTs = useMemo(() => {
    return nfts.filter(nft => nft.collectionId === collectionId);
  }, [collectionId]);

  // Apply filters
  const filteredNFTs = useMemo(() => {
    let filtered = [...collectionNFTs];

    // Filter by status (Studio only)
    if (isStudioContext) {
      if (filterStatus === 'listed') filtered = filtered.filter(nft => nft.isListed);
      if (filterStatus === 'unlisted') filtered = filtered.filter(nft => !nft.isListed);
    } else {
      // Marketplace: only show listed items
      filtered = filtered.filter(nft => nft.isListed);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Recent (default order)
        break;
    }

    return filtered;
  }, [collectionNFTs, filterStatus, sortBy, isStudioContext]);

  const tabs: Tab[] = [
    { id: 'items', label: 'Items', count: filteredNFTs.length },
    { id: 'activity', label: 'Activity' },
  ];

  if (!collection) {
    return (
      <div className="min-h-screen bg-os-bg-primary flex items-center justify-center">
        <EmptyState
          icon={
            <svg className="w-16 h-16 text-os-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Collection not found"
          description="This collection doesn't exist or has been removed"
          action={
            <button 
              className="btn-primary"
              onClick={() => navigate(isStudioContext ? '/studio' : '/marketplace')}
            >
              {isStudioContext ? 'Back to Studio' : 'Back to Marketplace'}
            </button>
          }
        />
      </div>
    );
  }

  const handleNFTClick = (nftId: number) => {
    navigate(`/nft/${nftId}`);
  };

  const handleList = (nftId: number) => {
    alert(`List NFT #${nftId} for sale`);
    // TODO: Implement listing logic
  };

  const handleUnlist = (nftId: number) => {
    alert(`Unlist NFT #${nftId} from sale`);
    // TODO: Implement unlisting logic
  };

  const handleBuy = (nftId: number) => {
    alert(`Buy NFT #${nftId}`);
    // TODO: Implement buy logic
  };

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
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-opensea-blue via-os-purple to-opensea-blue" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-os-bg-secondary/80" />
        </div>

        {/* Collection Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-6">
          {/* Logo */}
          <div className="flex items-end gap-6 mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-os-bg-secondary bg-os-bg-elevated overflow-hidden shadow-os-lg flex-shrink-0">
              {collection.cover ? (
                <img 
                  src={collection.cover} 
                  alt={collection.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-opensea-blue to-os-purple">
                  <span className="text-white text-4xl font-bold">
                    {collection.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {isStudioContext && (
              <button 
                className="btn-secondary mb-2"
                onClick={() => navigate(`/studio/collection/${collectionId}/edit`)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Collection
              </button>
            )}
          </div>

          {/* Collection Details */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-os-text-primary">
              {collection.name}
            </h1>
            
            <p className="text-os-text-secondary text-sm sm:text-base max-w-3xl">
              Created by <span className="text-opensea-blue font-semibold">{collection.creator}</span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div>
                <p className="text-os-text-tertiary text-xs uppercase mb-1">Items</p>
                <p className="text-os-text-primary text-xl font-bold">{collection.items}</p>
              </div>
              <div>
                <p className="text-os-text-tertiary text-xs uppercase mb-1">Floor Price</p>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-os-text-tertiary" fill="currentColor" viewBox="0 0 320 512">
                    <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
                  </svg>
                  <p className="text-os-text-primary text-xl font-bold">{collection.floorPrice}</p>
                </div>
              </div>
              {collection.volume && (
                <div>
                  <p className="text-os-text-tertiary text-xs uppercase mb-1">Total Volume</p>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-os-text-tertiary" fill="currentColor" viewBox="0 0 320 512">
                      <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
                    </svg>
                    <p className="text-os-text-primary text-xl font-bold">{collection.volume}</p>
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
        {activeTab === 'items' && (
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-os-text-secondary text-sm">
                {filteredNFTs.length} {filteredNFTs.length === 1 ? 'item' : 'items'}
              </p>
              
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {isStudioContext && (
                  <select 
                    className="input text-sm py-2 flex-1 sm:flex-none"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'listed' | 'unlisted')}
                  >
                    <option value="all">All Items</option>
                    <option value="listed">Listed</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                )}
                
                <select 
                  className="input text-sm py-2 flex-1 sm:flex-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Recently Added</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* NFT Grid */}
            {filteredNFTs.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="w-16 h-16 text-os-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                title={filterStatus === 'all' ? 'No items in this collection' : `No ${filterStatus} items`}
                description={
                  isStudioContext 
                    ? "Start by minting your first NFT" 
                    : "Check back later for new items"
                }
                action={
                  isStudioContext ? (
                    <button className="btn-primary" onClick={() => navigate('/studio/mint')}>
                      Mint NFT
                    </button>
                  ) : (
                    <button className="btn-primary" onClick={() => navigate('/marketplace')}>
                      Explore Marketplace
                    </button>
                  )
                }
              />
            ) : (
              <CardGrid cols={{ sm: 3, md: 5, lg: 5, xl: 8}}>
                {filteredNFTs.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    {...nft}
                    context={isStudioContext ? 'studio' : 'marketplace'}
                    loading={false}
                    onClick={() => handleNFTClick(nft.id)}
                    onFavorite={() => console.log('Favorited:', nft.id)}
                    onList={isStudioContext ? () => handleList(nft.id) : undefined}
                    onUnlist={isStudioContext ? () => handleUnlist(nft.id) : undefined}
                    onBuy={!isStudioContext ? () => handleBuy(nft.id) : undefined}
                  />
                ))}
              </CardGrid>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <EmptyState
            icon={
              <svg className="w-16 h-16 text-os-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="No activity yet"
            description="Collection activity will appear here"
          />
        )}
      </div>
    </div>
  );
};

export default CollectionView;
