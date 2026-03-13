import React from 'react';
import Select from 'react-select';
import { CarFront, MapPin } from 'lucide-react';


// const options = [
//   { value: 'operator1', label: 'Operator 1' },
//   { value: 'operator2', label: 'Operator 2' },
//   { value: 'operator3', label: 'Operator 3' },
// ];

export const TripList = ({ rides = [] }) => {
  return (
    <div className="w-full lg:w-1/3 flex flex-col overflow-hidden">

      <h2 className="textPrimary font-bold text-xl mb-4">Trips</h2>

      {/* <Select className="w-full mb-4" options={operatorOptionsFromProps} classNamePrefix={"react-select"} placeholder="Select Operator" /> */}

      <div className="overflow-y-auto flex-1 space-y-3 pr-1">
         {rides.length === 0 && <p className="text-secondary text-center">No ongoing trips found.</p>}
        {rides.map((ride) => (
          <div key={ride.ride_id} className="border border-gray-200 p-3 rounded-md shadow-sm">
            <h3 className="textPrimary">{ride.customer_name}</h3>
            <p className="textSecondary">{ride.vehicle_type || "N/A"}</p>
            <div className="text-xs mt-2">
             <div className="flex items-center gap-1 textSecondary">
  <CarFront className="w-4 h-4 text-icon" />
  {ride.pickup || "N/A"}
</div>
<div className="flex items-center gap-1 mt-1 textSecondary">
  <MapPin className="w-4 h-4 text-icon" />
  {ride.drop || "N/A"}
</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
