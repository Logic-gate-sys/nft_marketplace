import React from "react";
import { formatIpfsUrl } from "../../utils/format";
import { CollectionProp } from "../../services/types";

// export default function CollectionCard({ image, title, description }:any) {

//   return (
//     <section className="bg-zinc-800/90 grid grid-cols-[0.1fr_5fr] gap-4 pl- pr-2 pt-1 pb-1 rounded-lg ">
//     <img src={image} alt="collection image" className="h-full max-w-16 rounded-lg" />
//       <section className="flex flex-col gap-1 justify-center items-left ">
//         <p className="text-lg font-bold text-pink-400/60">{title}</p>
//         <article className="">{description?.slice(0,20)}...</article>
//     </section>
//   </section>
//   );
// }

export const CollectionCard = ({
  name,
  cover,
  items,
  floorPrice,
  creator,
}: CollectionProp) => {
  return (
    <div className="rounded-[18px] shadow-md overflow-hidden w-full h-[28rem] flex flex-col">
      {/* Background image */}
      <div
        className="relative w-full h-full bg-center bg-cover"
        style={{ backgroundImage: `url(${cover}) ` }}
      />

      <div className="absolute left-[2%] top-[55%] ">
        <section className="p-2 flex flex-col justify-between h-[50%] font-inter text-[#ffffff]">
          <h3 className="text-3xl font-extrabold truncate">{name}</h3>
          <p className="text-xl font-bold pb-2">
            Creator: <span className="">{creator}</span>
          </p>

          <div className="rounded-lg p-2 bg-white/20 backdrop-blur-lg border border-white/30 shadow-l grid grid-cols-4  text-md ">
            <div>
              <p className="font-bold ">Floor Price</p>
              <p className="p-2">{floorPrice} ETH</p>
            </div>
            <div>
              <p className="font-bold">Items</p>
              <p className="p-2">{items}</p>
            </div>
            <div>
              <p className="font-bold">Total Volume</p>
              <p className="p-2">{Math.round(items * floorPrice)} ETH</p>
            </div>
            <div>
              <p className="font-bold">Listed</p>
              <p className="p-2">{Math.floor(0.4 * items)} %</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
