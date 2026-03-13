import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export const TripCard = ({ card, isOpen, onToggle }) => {
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight);
    } else {
      setMaxHeight(0);
    }
  }, [isOpen]);

  return (
    <div className=" bg-white transition-all duration-300 ease-in-out overflow-hidden">
      {/* Toggle */}
      <button
        className="w-full flex items-center justify-between p-1 textSecondary text-left"
        onClick={onToggle}
      >
        <span className="truncate textSecondary">{card.pickup} - {card.drop}</span>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 textSecondary" />
        ) : (
          <ChevronDown className="w-6 h-6 textSecondary" />
        )}
      </button>

      {/* Expandable Content */}
      <div
        ref={contentRef}
        className="transition-max-height duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight }}
      >
        <div className="px-4 pb-4 textSecondary">
          <div className="p-3 rounded bg-gray-40 ">

            {/* First Row */}
            <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-3">
              <div className="w-14 h-14 bg-gray-300 rounded flex-shrink-0" />
              <div className="flex flex-wrap gap-4 flex-1 min-w-0">
                <InfoBlock label="Pickup" value={card.pickup} />
                <InfoBlock label="Drop" value={card.drop} />
                <InfoBlock label="Channel" value={card.channel} />
              </div>
            </div>

            {/* Divider */}
            <hr className="border-t border-gray-300 mb-3" />

            {/* Second Row: All in a single horizontal row */}
            <div className="flex flex-wrap sm:flex-nowrap gap-4 overflow-x-auto">
              <InfoBlock label="Driver Name" value={card.name} />
              <InfoBlock label="Driver Mobile" value={card.mobile} />
              <InfoBlock label="Vehicle Number" value={card.vehicleNumber} />
              <InfoBlock label="Vehicle Type" value={card.vehicleType} />
              <InfoBlock label="Vehicle Model" value={card.vehicleModel} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable small info block
const InfoBlock = ({ label, value }) => (
  <div className="min-w-[120px]">
    <p className="textPrimary text-icon text-xs">{label}</p>
    <p className="truncate text-sm">{value}</p>
  </div>
);
