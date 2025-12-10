import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from 'swiper/modules'
import { CollectionCard } from "./collection-card";
import { CollectionProp, Collections } from "../../services/types";



export const CollectionsCarousel = ({ collections }: Collections) =>{
  return (
    <div className="w-full py-8 flex  gap-2 flex-wrap md:flex-nowrap">
      <Swiper
        modules={[ Autoplay]}
        autoplay={{ delay: 5000 }}
        spaceBetween={0}
        slidesPerView={1}
      >
        {collections.map((col, idx) => (
          <SwiperSlide key={col.id}>
                <CollectionCard
                    id = {col.id}
                    name={col.name}
                    cover={col.cover}
                    items={col.items}
                    floorPrice = {col.floorPrice}
                    creator ={col.creator}
                />
          </SwiperSlide>
        ))}
          </Swiper>
          <section className="lg:w-1/3 bg-white/4 backdrop-blur-lg border border-white/30 rounded-xl p-6 shadow-lg flex flex-col gap-4">
        <div className="mt-4 flex flex-col gap-3">
          {/* Best For */}
          <div className="flex justify-between items-center p-4 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-md">
            <span className="text-white font-bold text-sm">Best For</span>
            <span className="text-white/80 text-sm">Occasional Gift</span>
          </div>

          {/* Rarity */}
          <div className="flex justify-between items-center p-4 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-md">
            <span className="text-white font-bold text-sm">Rarity</span>
            <span className="text-white/80 text-sm text-right">
              Unique 1/1 & Limited Editions
            </span>
          </div>

          {/* Holders */}
          <div className="flex justify-between items-center p-4 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-md">
            <span className="text-white font-bold text-sm">Holders</span>
            <span className="text-white/80 text-sm text-right">
              12.3k collectors
            </span>
          </div>

          {/* Activity */}
          <div className="flex justify-between items-center p-4 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-md">
            <span className="text-white font-bold text-sm">Activity</span>
            <span className="text-white/80 text-sm text-right">
              Avg. 150 transactions/day
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}



