import React from 'react';
import { Car } from 'lucide-react';

export const VehicleListView = ({ vehicles=[], onVehicleSelect }) => {

  const getStatusColor = (active_flag) => {
    switch (active_flag) {
      case 1:
        return 'text-textActive';
      case 2:
        return 'text-textInactive';
      case 3:
        return 'text-textWarn';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1 scroll-hide">
      {vehicles
        .filter(vehicle => vehicle.active_flag !== 0) // Filter out vehicles with active_flag 0
        .map((vehicle, idx) => (
          <div
            key={idx}
            className="relative bg-white p-4 rounded-md shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 ease-in-out cursor-pointer"
            onClick={() => onVehicleSelect && onVehicleSelect(vehicle.vehicle_number)}
          >
            {/* Status Icon */}
            <Car
              className={`w-4 h-4 absolute top-2 right-2 ${getStatusColor(vehicle.active_flag)}`}
              title={`Status: ${vehicle.active_flag}`} // You might want a more descriptive title
            />

            {/* Vehicle Info */}
            <div className="textPrimary">{vehicle.vehicle_number}</div>
            <div className="textSecondary">{vehicle.vehicle_model}</div> {/* Assuming model is like brand */}
            <div className=" textSecondary">{vehicle.vehicle_type}</div> {/* Assuming type is like specification */}
          </div>
        ))}
    </div>
  );
};
