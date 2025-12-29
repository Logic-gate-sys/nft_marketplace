import React from 'react';
import { NFTCardProps } from '../../services/types';

const NFTCard: React.FC<NFTCardProps> = ({
  id,
  tokenId,
  image,
  price ='0.44',       // treat as currentPrice
  lastPrice ='0.55',   // treat as basePrice
  status,
  context = 'marketplace',
  col_name,
  onClick,
  onBuy,
  onList,
  onUnlist,
  loading = false,
}) => {
  console.log('NFT STATUS : ', status);

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

  // derive appreciation if both prices exist (no logic change, just a derived display value)
  let appreciationLabel: string | null = null;
  if (price != null && lastPrice != null) {
    const current = Number(price);
    const base = Number(lastPrice);
    if (!Number.isNaN(current) && !Number.isNaN(base) && base > 0) {
      const pct = ((current - base) / base) * 100;
      const sign = pct >= 0 ? '+' : '';
      appreciationLabel = `${sign}${pct.toFixed(2)}%`;
    }
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
            alt={col_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-os-text-tertiary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {/* Status Badge */}
        {context === 'studio' && status === 'listed' && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-os-green/10 text-os-green border border-os-green/20">
              <button onClick={onUnlist} className='px-2.5 py-1 bg-opensea-blue hover:bg-opensea-blue-light text-white text-[11px] font-semibold rounded-md transition-colors flex-shrink-0 active:scale-95'>
                Unlist
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Body - Compact OpenSea style */}
      <div className="p-2.5">
        {/* NFT name */}
        <h3 className="text-os-text-primary font-semibold text-[13px] mb-2 truncate leading-tight">
          {col_name + ` #${tokenId}`}
        </h3>

        {/* Price section */}
        <div className="flex items-end justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Marketplace: currentPrice, basePrice, appreciation */}
            {context === 'marketplace' && price != null && lastPrice != null && (
              <div className="space-y-1">
                {/* Current price */}
                <div>
                  <p className="text-[10px] text-os-text-tertiary mb-0.5 font-medium">
                    Current price
                  </p>
                  <div className="flex items-baseline gap-1">
                    <svg
                      className="w-2 h-3.5 flex-shrink-0 opacity-60"
                      viewBox="0 0 320 512"
                      fill="currentColor"
                    >
                      <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                    </svg>
                    <p className="text-os-text-primary font-semibold text-sm truncate">
                      {price}
                    </p>
                  </div>
                </div>

                {/* Base price */}
                <div>
                  <p className="text-[10px] text-os-text-tertiary mb-0.5 font-medium">
                    Base price
                  </p>
                  <p className="text-os-text-secondary text-[11px] truncate">
                    {lastPrice}
                  </p>
                </div>

                {/* Appreciation */}
                {appreciationLabel && (
                  <div>
                    <p className="text-[10px] text-os-text-tertiary mb-0.5 font-medium">
                      Appreciation
                    </p>
                    <p className="text-os-text-secondary text-[11px] truncate">
                      {appreciationLabel}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Studio: currentPrice & basePrice only */}
            {context === 'studio' && price != null && lastPrice != null && (
              <div className="space-y-1">
                <div>
                  <p className="text-[10px] text-os-text-tertiary mb-0.5 font-medium">
                    Current price
                  </p>
                  <p className="text-os-text-primary font-semibold text-sm truncate">
                    {price}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-os-text-tertiary mb-0.5 font-medium">
                    Base price
                  </p>
                  <p className="text-os-text-secondary text-[11px] truncate">
                    {lastPrice}
                  </p>
                </div>
              </div>
            )}

            {/* Studio: not listed */}
            {context === 'studio' &&
              status !== 'listed' &&
              price == null &&
              lastPrice == null && (
                <p className="text-[11px] text-os-text-tertiary font-medium">
                  Not listed
                </p>
              )}

            {/* Fallback for marketplace if only one price is present (keeps original behavior close) */}
            {context === 'marketplace' &&
              (price == null || lastPrice == null) &&
              (price != null || lastPrice != null) && (
                <div>
                  <p className="text-[10px] text-os-text-tertiary mb-0.5 font-medium">
                    Price
                  </p>
                  <div className="flex items-baseline gap-1">
                    <svg
                      className="w-2 h-3.5 flex-shrink-0 opacity-60"
                      viewBox="0 0 320 512"
                      fill="currentColor"
                    >
                      <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                    </svg>
                    <p className="text-os-text-primary font-semibold text-sm truncate">
                      {price ?? lastPrice}
                    </p>
                  </div>
                </div>
              )}
          </div>

          {/* Context-aware action buttons (unchanged logic) */}
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
              {status === 'listed'
                ? onUnlist && (
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
                : onList && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onList();
                      }}
                      className="px-2.5 py-1 bg-opensea-blue hover:bg-opensea-blue-light text-white text-[11px] font-semibold rounded-md transition-colors flex-shrink-0"
                    >
                      List
                    </button>
                  )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
