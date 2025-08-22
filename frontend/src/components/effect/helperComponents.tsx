 import React, { useEffect, useState } from 'react';
 import axios from 'axios';
 import { ethers } from 'ethers';
 


// --------------- pop up for message ---------------------------------

export const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg shadow-xl w-80">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};




//------------------------------ Loader / Spinner -------------------------
export const Spinner =() => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-100 bg-gray-500 opacity-60">
        <div className="  w-24 h-24 border-8 border-purple-400 border-t-transparent rounded-full animate-spin">
            </div>
        </div>
       
   )
}

export const Loader =() => {
    return (
        <div >
        <div className="  w-12 h-12 border-6 border-purple-400 border-t-transparent rounded-full animate-spin">
            </div>
        </div>
       
   )
}






// ---------------------- Collection Card - -------------------------------
export const CollectionCard = ({data}) => {
  const {image, name,token_id,status } = data;
  return (
    <>
    <div
    id="collection-card"
    className ="w-[%100] flex items-center gap-4 bg-gray-700 shadow-2xl opacity-80 p-4 rounded-xl hover:shadow-2xl transition-shadow duration-300"
  >
    {/* Image */}
    <img
      src={image}
      alt="Collection Cover"
      className="w-16 h-8 rounded-md object-cover"
    />

    {/* Collection Name */}
    <h3 className="text-lg font-semibold text-gray-800">{name}</h3>

    {/* Buttons */}
    <div className="ml-auto flex gap-4">
      <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition">
        Details
      </button>
    </div>
      </div>
  </>
  )
}
