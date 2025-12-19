import React from 'react';

export interface Filter {
  id: string;
  label: string;
}

interface FilterBarProps {
  filters: Filter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
            activeFilter === filter.id
              ? 'bg-opensea-blue text-white'
              : 'bg-os-bg-secondary text-os-text-secondary hover:bg-os-bg-hover hover:text-os-text-primary border border-os-border'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
