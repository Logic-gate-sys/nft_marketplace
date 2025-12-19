import React from 'react';
import { NFTCardProps } from '../../services/types';

const NFTCard: React.FC<NFTCardProps> = ({
  id,
  tokenId,
  name,
  image,
  collection,
  price,
  lastPrice,
  endTime,
  isListed = false,
  context = 'marketplace',
  onClick,
  onFavorite,
  onBuy,
  onList,
  onUnlist,
  isFavorited = false,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="card w-full">
        <div className="aspect-square skeleton" />
        <div className="p-2.5 space-y-2">
          <div className="h-3 skeleton" />
          <div className="h-4 skeleton w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="card hover-lift cursor-pointer group w-full"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-square bg-os-bg-hover overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-os-text-tertiary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Favorite button */}
        {onFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite();
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-os-bg-secondary/90 backdrop-blur-sm hover:bg-os-bg-elevated transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Favorite"
          >
            <svg
              className={`w-4 h-4 ${isFavorited ? 'fill-os-red text-os-red' : 'text-os-text-secondary'}`}
              fill={isFavorited ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}

        {/* Status Badge */}
        {context === 'studio' && isListed && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-os-green/10 text-os-green border border-os-green/20">
              Listed
            </span>
          </div>
        )}

        {/* Auction timer */}
        {endTime && (
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold">
            <svg className="w-2.5 h-2.5 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            2h 15m
          </div>
        )}
      </div>

      {/* Body - Compact OpenSea style */}
      <div className="p-2.5">
        {/* Collection name */}
        {collection && (
          <p className="text-[11px] text-os-text-tertiary mb-0.5 truncate font-medium">
            {collection}
          </p>
        )}

        {/* NFT name */}
        <h3 className="text-os-text-primary font-semibold text-[13px] mb-2 truncate leading-tight">
          {name || `#${tokenId}`}
        </h3>

        {/* Price section */}
        <div className="flex items-end justify-between gap-2">
          <div className="flex-1 min-w-0">
            {price != null ? (
              <div>
                <p className="text-[10px] text-os-text-tertiary mb-0.5 font-medium">Price</p>
                <div className="flex items-baseline gap-1">
                  <svg className="w-2 h-3.5 flex-shrink-0 opacity-60" viewBox="0 0 320 512" fill="currentColor">
                    <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
                  </svg>
                  <p className="text-os-text-primary font-semibold text-sm truncate">
                    {price}
                  </p>
                </div>
              </div>
            ) : lastPrice != null ? (
              <div>
                <p className="text-[10px] text-os-text-tertiary mb-0.5 font-medium">Last</p>
                <div className="flex items-baseline gap-1">
                  <svg className="w-2 h-3.5 flex-shrink-0 opacity-60" viewBox="0 0 320 512" fill="currentColor">
                    <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
                  </svg>
                  <p className="text-os-text-secondary font-medium text-sm truncate">
                    {lastPrice}
                  </p>
                </div>
              </div>
            ) : context === 'studio' && !isListed ? (
              <p className="text-[11px] text-os-text-tertiary font-medium">Not listed</p>
            ) : null}
          </div>

          {/* Context-aware action buttons */}
          {context === 'marketplace' && price != null && onBuy && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBuy();
              }}
              className="px-2.5 py-1 bg-opensea-blue hover:bg-opensea-blue-light text-white text-[11px] font-semibold rounded-md transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
            >
              Buy
            </button>
          )}

          {context === 'studio' && (
            <>
              {isListed ? (
                onUnlist && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnlist();
                    }}
                    className="px-2.5 py-1 bg-os-bg-hover hover:bg-os-border text-os-text-primary border border-os-border text-[11px] font-semibold rounded-md transition-colors flex-shrink-0"
                  >
                    Unlist
                  </button>
                )
              ) : (
                onList && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onList();
                    }}
                    className="px-2.5 py-1 bg-opensea-blue hover:bg-opensea-blue-light text-white text-[11px] font-semibold rounded-md transition-colors flex-shrink-0"
                  >
                    List
                  </button>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
