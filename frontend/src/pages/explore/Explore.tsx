import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  NFTCard, 
  CardGrid,
  SectionHeader,
} from '../../components';
import { CollectionsCarousel } from '../../components/carousel/ColCarousel';
import { collections, nfts } from '../../data/sampledata';

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Get trending NFTs (listed NFTs only)
  const trendingNFTs = nfts.filter(nft => nft.isListed).slice(0, 10);

  // Get featured collections (sorted by volume)
  const featuredCollections = [...collections]
    .sort((a, b) => (b.volume || 0) - (a.volume || 0))
    .slice(0, 6);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCollectionClick = (collectionId: string | number) => {
    navigate(`/collection/${collectionId}`);
  };

  const handleNFTClick = (nftId: number) => {
    navigate(`/nft/${nftId}`);
  };

  return (
    <div className="min-h-screen bg-os-bg-primary">
      {/* Hero Section */}
      <section className="relative bg-os-bg-secondary border-b border-os-border overflow-hidden">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-opensea-blue/5 via-os-purple/5 to-transparent" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232081e2' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} 
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-os-text-primary mb-4 leading-tight">
              Gift memorable moments as NFTs
            </h1>
            <p className="text-lg sm:text-xl text-os-text-secondary mb-8 leading-relaxed">
              Create, collect, and share meaningful NFT gifts with Memora
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <label htmlFor="search" className="sr-only">
                Search gift collections, NFTs, and creators
              </label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg 
                  className="h-5 w-5 text-os-text-tertiary" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gift collections, NFTs, and creators"
                className="w-full pl-12 pr-4 py-4 bg-os-bg-elevated border border-os-border rounded-xl text-os-text-primary placeholder-os-text-tertiary focus:outline-none focus:ring-2 focus:ring-opensea-blue focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-os-text-tertiary hover:text-opensea-blue transition-colors"
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button 
                onClick={() => navigate('/marketplace')}
                className="btn-primary"
                aria-label="Explore NFT gifts"
              >
                Explore Gifts
              </button>
              <button 
                onClick={() => navigate('/studio')}
                className="btn-secondary"
                aria-label="Create new NFT gift"
              >
                Create Gift
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-os-border bg-os-bg-secondary" aria-label="Platform statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            <div className="text-center sm:text-left">
              <p className="text-2xl sm:text-3xl font-bold text-os-text-primary mb-1">
                10M+
              </p>
              <p className="text-xs sm:text-sm text-os-text-secondary">
                Gifts Given
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-2xl sm:text-3xl font-bold text-os-text-primary mb-1">
                500K+
              </p>
              <p className="text-xs sm:text-sm text-os-text-secondary">
                Gift Collections
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-2xl sm:text-3xl font-bold text-os-text-primary mb-1">
                2M+
              </p>
              <p className="text-xs sm:text-sm text-os-text-secondary">
                Happy Recipients
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8 sm:py-12 space-y-16">
        {/* Featured Collections Carousel - Full Width OpenSea Style */}
        <section aria-labelledby="featured-collections" className="relative">
          {/* Section Header - Inside Container for Alignment */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <SectionHeader
              title="Notable collections"
              subtitle=""
              action={
                <button 
                  onClick={() => navigate('/marketplace')}
                  className="text-opensea-blue hover:text-opensea-blue-light font-semibold text-sm transition-colors flex items-center gap-1"
                  aria-label="View all featured collections"
                >
                  View all
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              }
            />
          </div>
          
          {/* Carousel - Full Bleed with Internal Padding */}
          {/* {collections && collections.length > 0 ? (
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
              <CollectionsCarousel 
                collections={collections} 
                onCollectionClick={handleCollectionClick}
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12 bg-os-bg-secondary/50 backdrop-blur-xl border border-white/10 rounded-2xl">
                <svg className="w-16 h-16 text-os-text-tertiary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-os-text-secondary">No collections available at the moment</p>
              </div>
            </div>
          )} */}
        </section>

        {/* Trending NFT Gifts */}
        <section aria-labelledby="trending-nfts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Trending in gifts"
            subtitle=""
            action={
              <button 
                onClick={() => navigate('/marketplace')}
                className="text-opensea-blue hover:text-opensea-blue-light font-semibold text-sm transition-colors flex items-center gap-1"
                aria-label="View all trending NFTs"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            }
          />
          
          {trendingNFTs.length > 0 ? (
            <CardGrid cols={{ sm: 3, md: 3, lg: 4, xl: 5 }}>
              {trendingNFTs.map((nft) => (
                <NFTCard
                  key={nft.id}
                  {...nft}
                  context="marketplace"
                  loading={false}
                  onClick={() => handleNFTClick(nft.id)}
                  onFavorite={() => console.log('Favorite NFT:', nft.id)}
                  onBuy={() => console.log('Buy NFT:', nft.id)}
                />
              ))}
            </CardGrid>
          ) : (
            <div className="text-center py-12 bg-os-bg-secondary border border-os-border rounded-xl">
              <svg className="w-16 h-16 text-os-text-tertiary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-os-text-secondary">No trending NFTs available</p>
            </div>
          )}
        </section>

        {/* Top Gift Collections */}
        <section aria-labelledby="top-collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Top collections over last 7 days"
            subtitle=""
            action={
              <button 
                onClick={() => navigate('/marketplace')}
                className="text-opensea-blue hover:text-opensea-blue-light font-semibold text-sm transition-colors flex items-center gap-1"
                aria-label="View all top collections"
              >
                View rankings
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            }
          />
          
          {/* Collection Rankings Table */}
          <div className="bg-os-bg-secondary border border-os-border rounded-xl overflow-hidden shadow-os-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-os-bg-hover border-b border-os-border">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-os-text-secondary uppercase tracking-wider">
                      Collection
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-os-text-secondary uppercase tracking-wider">
                      Floor Price
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-os-text-secondary uppercase tracking-wider hidden sm:table-cell">
                      Volume
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-os-border">
                  {featuredCollections.length > 0 ? (
                    featuredCollections.map((collection, index) => (
                      <tr 
                        key={collection.id}
                        onClick={() => handleCollectionClick(collection.id)}
                        className="hover:bg-os-bg-hover transition-colors cursor-pointer group"
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleCollectionClick(collection.id);
                          }
                        }}
                      >
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-os-text-tertiary font-semibold text-sm w-4 sm:w-6" aria-label={`Rank ${index + 1}`}>
                              {index + 1}
                            </span>
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-os-bg-elevated flex-shrink-0 group-hover:scale-105 transition-transform">
                              {collection.cover ? (
                                <img 
                                  src={collection.cover} 
                                  alt={`${collection.name} collection`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-opensea-blue to-os-purple">
                                  <span className="text-white font-bold">
                                    {collection.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-os-text-primary font-semibold text-sm sm:text-base truncate group-hover:text-opensea-blue transition-colors">
                                {collection.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-os-text-tertiary" fill="currentColor" viewBox="0 0 320 512">
                              <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
                            </svg>
                            <p className="text-os-text-primary font-semibold text-sm sm:text-base">
                              {collection.floorPrice}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-os-text-tertiary" fill="currentColor" viewBox="0 0 320 512">
                              <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
                            </svg>
                            <p className="text-os-text-primary font-semibold">
                              {collection.volume || 0}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-os-text-secondary">
                        No collection data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* How Memora Works */}
        <section className="bg-gradient-to-br from-os-bg-secondary to-os-bg-elevated border-y border-os-border py-16" aria-labelledby="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 id="how-it-works" className="text-3xl sm:text-4xl font-bold text-os-text-primary mb-4">
                  Create and sell your NFTs
                </h2>
                <p className="text-lg text-os-text-secondary mb-10">
                  Memora makes it easy to turn special moments into unique digital gifts that last forever on the blockchain.
                </p>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: (
                        <svg className="w-6 h-6 text-opensea-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ),
                      title: 'Set up your wallet',
                      description: "Once you've set up your wallet of choice, connect it to Memora by clicking the wallet icon"
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6 text-opensea-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      ),
                      title: 'Create your collection',
                      description: 'Click Create and set up your collection. Add social links, a description, profile & banner images'
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6 text-opensea-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      ),
                      title: 'Add your NFTs',
                      description: 'Upload your work, add a title and description, and customize your NFTs with properties and stats'
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6 text-opensea-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      ),
                      title: 'List them for sale',
                      description: 'Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell'
                    }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-xl bg-opensea-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-opensea-blue/20 transition-colors">
                        {step.icon}
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="font-bold text-os-text-primary mb-2 text-lg">
                          {step.title}
                        </h3>
                        <p className="text-sm text-os-text-secondary leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Illustration */}
              <div className="hidden lg:block">
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-opensea-blue via-os-purple to-opensea-blue p-1">
                  <div className="w-full h-full bg-os-bg-secondary rounded-3xl flex items-center justify-center backdrop-blur-xl">
                    <div className="text-center p-12">
                      <svg className="w-40 h-40 text-os-text-tertiary mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                      <p className="text-os-text-secondary text-sm">Start your NFT journey today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Explore;
