import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { CollectionCard } from "../ui/collection-card";
import { CollectionProp, Collections } from "../../services/types";

export const CollectionsCarousel = ({ collections }: Collections) => {
  return (
    <div className="w-full py-8 flex gap-1">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000}}
        spaceBetween={1}
        slidesPerView={1}
      >
        {collections.map((col) => (
          <SwiperSlide key={col.id} >
            <CollectionCard
              id={col.id}
              name={col.name}
              cover={col.cover}
              items={col.items} 
              floorPrice={col.floorPrice}
              creator={col.creator}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <section className="hidden lg:flex lg:w-1/3 bg-white/4 backdrop-blur-lg border border-white/30 rounded-xl p-6 shadow-lg flex-col gap-4">
        {[
          { label: "Best For", value: "Occasional Gift" },
          { label: "Rarity", value: "Unique 1/1 & Limited Editions" },
          { label: "Holders", value: "12.3k collectors" },
          { label: "Activity", value: "Avg. 150 transactions/day" },
        ].map((info) => (
          <div
            key={info.label}
            className="flex justify-between items-center p-4 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-md"
          >
            <span className="text-white font-bold text-sm">{info.label}</span>
            <span className="text-white/80 text-sm text-right">{info.value}</span>
          </div>
        ))}
      </section>
    </div>
  );
};
