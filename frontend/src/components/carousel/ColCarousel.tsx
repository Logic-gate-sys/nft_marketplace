import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import CollectionCard  from '../ui/CollectionCard'
import { CollectionCardProps } from "../../services/types";

interface Collections{
  collections: CollectionCardProps[];
}

export const CollectionsCarousel = ({ collections, onCollectionClick }: Collections & { onCollectionClick?: (id: string | number) => void }) => {
  if (!collections || collections.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <div className="bg-os-bg-secondary/50 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
          <svg className="w-16 h-16 text-os-text-tertiary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-os-text-secondary text-sm">No collections available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 flex flex-col lg:flex-row gap-6">
      {/* Carousel Section with Glassmorphism */}
      <div className="flex-1 relative">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-opensea-blue/20 via-os-purple/20 to-opensea-blue/20 blur-3xl opacity-30 pointer-events-none" />
        
        <div className="relative">
          <Swiper
            modules={[EffectCoverflow, Autoplay, Pagination]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 15,
              stretch: 0,
              depth: 150,
              modifier: 1.5,
              slideShadows: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            loop={collections.length > 3}
            className="!pb-14"
          >
            {collections.map((col) => (
              <SwiperSlide 
                key={col.id}
                className="!w-[300px] sm:!w-[350px] lg:!w-[400px]"
              >
                <div className="transform transition-all duration-300 hover:scale-105">
                  <CollectionCard
                    id={col.id}
                    name={col.name}
                    cover={col.cover}
                    items={col.items}
                    floorPrice={col.floorPrice}
                    creator={col.creator}
                    volume={col.volume}
                    loading={false}
                    onClick={() => onCollectionClick?.(col.id)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Glass Info Panel - Desktop Only */}
      <aside className="hidden lg:block lg:w-80 flex-shrink-0">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-4">
          {/* Header with Glass Effect */}
          <div className="mb-6 pb-4 border-b border-white/10">
            <h3 className="text-lg font-bold text-os-text-primary flex items-center gap-2">
              <svg className="w-5 h-5 text-opensea-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Collection Insights
            </h3>
            <p className="text-xs text-os-text-tertiary mt-1">Live marketplace data</p>
          </div>

          {/* Info Cards with Glassmorphism */}
          <div className="space-y-3">
            {[
              {
                label: "Best For",
                value: "Occasional Gifts",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                ),
                color: "from-opensea-blue/20 to-opensea-blue/5",
              },
              {
                label: "Rarity",
                value: "Unique 1/1",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
                color: "from-os-purple/20 to-os-purple/5",
              },
              {
                label: "Holders",
                value: "12.3K",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                color: "from-os-green/20 to-os-green/5",
              },
              {
                label: "Activity",
                value: "150 txns/day",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                color: "from-os-yellow/20 to-os-yellow/5",
              },
            ].map((info, index) => (
              <div
                key={index}
                className={`relative overflow-hidden p-4 rounded-xl bg-gradient-to-br ${info.color} backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 group`}
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-opensea-blue group-hover:scale-110 transition-transform duration-300">
                      {info.icon}
                    </div>
                    <span className="text-os-text-secondary text-sm font-medium">
                      {info.label}
                    </span>
                  </div>
                  <span className="text-os-text-primary text-sm font-bold">
                    {info.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-xs text-os-text-tertiary">
              <div className="w-2 h-2 rounded-full bg-os-green animate-pulse" />
              <span>Updated 2 min ago</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CollectionsCarousel;
