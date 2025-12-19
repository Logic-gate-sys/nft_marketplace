// CollectionCard.tsx
import { CollectionCardProps } from "../../services/types";


const CollectionCard: React.FC<CollectionCardProps> = ({ id, name, cover, items, floorPrice, creator, volume, onClick, loading}) => {
  if (loading) {
    return (
      <div className="card">
        <div className="h-48 skeleton" />
        <div className="p-3 space-y-2">
          <div className="h-5 skeleton" />
          <div className="h-4 skeleton w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="card hover-lift cursor-pointer" onClick={onClick}>
      <div className="relative h-48 bg-os-bg-hover overflow-hidden">
        {cover ? (
          <img src={cover} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-os-text-tertiary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-os-text-primary font-semibold text-base mb-1 truncate">
          {name || 'Untitled Collection'}
        </h3>

        {creator && (
          <p className="text-xs text-os-text-tertiary mb-3 truncate">
            by {creator}
          </p>
        )}

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-os-text-tertiary mb-0.5">Floor</p>
            <p className="text-os-text-primary font-semibold">
              {floorPrice != null ? `${floorPrice} ETH` : '—'}
            </p>
          </div>
          <div>
            <p className="text-os-text-tertiary mb-0.5">Volume</p>
            <p className="text-os-text-primary font-semibold">
              {volume != null ? `${volume} ETH` : '—'}
            </p>
          </div>
          <div>
            <p className="text-os-text-tertiary mb-0.5">Items</p>
            <p className="text-os-text-primary font-semibold">{items ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CollectionCard;