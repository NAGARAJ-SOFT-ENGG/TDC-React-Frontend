import React from 'react';
import classNames from 'classnames';
import { CarFront, MapPin } from 'lucide-react';

export const TrackingList = ({ rides = [], onSelectRide, selectedRideId }) => {
  return (
    <div className="w-full lg:w-1/3 flex flex-col overflow-hidden">

      <h2 className="textPrimary font-bold text-xl mb-4">Tracking</h2>
      <div className="overflow-y-auto flex-1 space-y-3">
        {rides.length === 0 && (
          <p className="text-secondary text-center">No ongoing rides to track.</p>
        )}
        {rides.map((ride) => (
          <div
            key={ride.ride_id}
            className={classNames(
              "p-3 rounded-md cursor-pointer transition-all duration-200 ease-in-out bg-white",
              "hover:shadow-md hover:border-black",
              selectedRideId === ride.ride_id
                ? "border-2 border-black shadow-lg z-10"
                : "border border-gray-300 z-0"
            )}
            onClick={() => onSelectRide && onSelectRide(ride.ride_id)}
          >
            <h3 className="textPrimary">{ride.customer_name}</h3>
            <p className="textSecondary">{ride.vehicle_type || "N/A"}</p>
            <div className="flex items-center gap-1 textSecondary">
              <CarFront className="w-4 h-4 text-icon" />
              {ride.pickup || "N/A"}
            </div>
            <div className="flex items-center gap-1 mt-1 textSecondary">
              <MapPin className="w-4 h-4 text-icon" />
              {ride.drop || "N/A"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
