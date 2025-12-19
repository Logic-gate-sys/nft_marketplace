import { FetchedCollection, Pagination } from "../services/types";


const BASE_URL = import.meta.env.VITE_BASE_URL 

export async function fetchAllCollections() {
  const query = new URLSearchParams();
  const res = await fetch(`${BASE_URL}/collections`);

  if (!res.ok) {
    throw new Error("Failed to fetch collections");
  }

  const json = await res.json();

  return {
    collections: json.data as FetchedCollection[],
    pagination: json.pagination as Pagination
  };
}



export const fetchCollectionById = async (col_id: number) => {
  const res = await fetch(`${BASE_URL}/collections/${col_id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch collections");
  }

  const json = await res.json();

  return {
    collection: json.data as FetchedCollection
  };
}


// fetch User specification collection 
export const fetchUserCollection = async (token: any) => {
  const res = await fetch(`${BASE_URL}/collections/usercollection/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  // 
  if (!res.ok) {
    throw new Error("Failed to fetch collections");
  }

  const json = await res.json();
  console.log("JSON: ", json);

  return {
    collections: json.data as FetchedCollection[],
    pagination: json.pagination as Pagination
  };
}