// SearchBar.jsx
import { useState } from "react";

const categories = [
  "Art",
  "Collectibles",
  "Game Items",
  "Music",
  "Virtual Worlds",
  "Photography",
];

type searchProp ={
    onSeach : () =>void
}

export const  SearchBar =({ onSearch } :searchProp) =>{
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSearch = () => {
    onSearch({ query, category: selectedCategory });
    setShowFilters(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowFilters(true)}
        placeholder="Search items, collections, artists..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
      />

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 w-full mt-2 p-4 bg-white border rounded-lg shadow-lg z-10">
          <div className="mb-2">
            <label className="block mb-1 font-medium">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1 border rounded"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>

          <button
            onClick={() => setShowFilters(false)}
            className="w-full mt-2 px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
