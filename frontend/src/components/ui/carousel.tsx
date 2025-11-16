import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from 'swiper/modules'
import { CollectionCard } from "./collection-card";
import { CollectionProp, Collections } from "../../services/types";



export const CollectionsCarousel = ({ collections }: Collections) =>{
  return (
    <div className="w-full py-8">
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
    </div>
  );
}



