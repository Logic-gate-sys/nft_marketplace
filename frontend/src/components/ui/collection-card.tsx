import React from "react";
import { formatIpfsUrl } from "../../utils/format";

export default function CollectionCard({ image, title, description }:any) {
  
  return (
    <section className="bg-zinc-800/90 grid grid-cols-[0.1fr_5fr] gap-4 pl- pr-2 pt-1 pb-1 rounded-lg ">
    <img src={image} alt="collection image" className="h-full max-w-16 rounded-lg" />
      <section className="flex flex-col gap-1 justify-center items-left ">
        <p className="text-lg font-bold text-pink-400/60">{title}</p>
        <article className="">{description?.slice(0,20)}...</article>
    </section>
  </section>
  );
}
