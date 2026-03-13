import React from 'react';

export const TripDetails = ({ card }) => {
  return (
    <div className="bg-white rounded-lg p-4 mt-11 textSecondary shadow-md border border-gray-100">
      <div className=" rounded space-y-2">
        {/* Top Row: Grid Layout */}
        <div className="grid grid-cols-1  sm:grid-cols-4 gap-4 items-start">
          {/* Icon or image block */}
          <div className="w-14 h-14 bg-gray-300 rounded" />

          {/* Grid info spans 3 columns on larger screens */}
          <div className="sm:col-span-3 grid grid-cols-1  md:grid-cols-3 gap-4">
            <InfoBlock label="Start Location" value={card.startLocation} />
            <InfoBlock label="Drop" value={card.dropLocation} />
            <InfoBlock label="Pickup GPS" value={card.pickupGPS} />
          </div>
        </div>

        <hr className="border-t border-gray-300" />

        {/* Bottom Row: Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <InfoBlock label="KMs" value={card.kms} />
          <InfoBlock label="Passengers" value={card.passengerCount} />
          <InfoBlock label="Requested Time" value={card.requestedDateTime} />
          <InfoBlock label="Vehicle Type" value={card.vehicleType} />
        </div>
      </div>
    </div>
  );
};

// Reusable info block component
const InfoBlock = ({ label, value }) => (
  <div className="min-w-0">
    <p className="textPrimary">{label}</p>
    <p className="truncate textSecondary">{value}</p>
  </div>
);
