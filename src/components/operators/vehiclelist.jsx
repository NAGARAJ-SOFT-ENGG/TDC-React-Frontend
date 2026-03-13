import React, { useState, useEffect } from "react";
import { FaEye, FaTrashAlt, FaCar } from "react-icons/fa";
import { VehicleDetail } from "./vehicledetail";
import { VehicleStatusModal } from "./vehiclestatuspopup";
import { VehicleStatusHandlingModal } from "@components";
import { CustomDataTable } from "@components";
import { fetchVehicleProfile } from "@services";

export const VehiclesList = ({ vehicles: initialVehicles, operatorMobile, onVehicleListUpdate }) => { // Added onVehicleListUpdate
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [statusModalVehicle, setStatusModalVehicle] = useState(null);
  const [actionsModalVehicle, setActionsModalVehicle] = useState(null); // For VehicleStatusHandlingModal (delete/status)
   const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  const columns = [
    { field: 'vehicle_number', header: 'Number', sortable: true },
    { field: 'vehicle_model', header: 'Model', sortable: true },
    { field: 'vehicle_type', header: 'Type', sortable: true },
    { field: 'assigned_driver_name', header: 'Driver Assigned', sortable: true },
    { field: 'vehicle_rating', header: 'Rating', sortable: true },
  ];

  // Local state for vehicles to allow optimistic updates
  const [vehicles, setVehicles] = useState(initialVehicles);
  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);
  
  // Function to handle fetching and displaying detailed vehicle profile
  const handleViewVehicleDetails = async (vehicleNumber) => {
    if (!vehicleNumber) return;
    setIsFetchingDetails(true);
    setSelectedVehicle(null); // Clear previous selection / close modal if open
    try {
      const profileData = await fetchVehicleProfile(vehicleNumber);
      if (profileData && profileData.vehicle) {
        setSelectedVehicle(profileData.vehicle); // Set the detailed vehicle profile
      } else {
        console.error("Vehicle profile data not found or in unexpected format:", profileData);
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error("Failed to fetch vehicle details:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleVehicleDeleteSuccess = (deletedVehicleNumber) => {
    setVehicles(prev => prev.filter(v => v.vehicle_number !== deletedVehicleNumber));
    setActionsModalVehicle(null);
    if (onVehicleListUpdate) onVehicleListUpdate(); // Notify parent to refresh
  };

  // Handler for when status is updated via VehicleStatusModal
  const handleDirectVehicleStatusUpdateSuccess = (vehicleNumber, newActiveFlag, notes) => {
    setVehicles(prev =>
      prev.map(v =>
        v.vehicle_number === vehicleNumber
          ? { ...v, active_flag: newActiveFlag, notes: notes }
          : v
      )
    );
    setStatusModalVehicle(null); // Close the status modal
    if (onVehicleListUpdate) onVehicleListUpdate(); // Notify parent to refresh
  };

  const handleVehicleStatusUpdateSuccess = (vehicleNumber, newActiveFlag, notes) => {
    setVehicles(prev =>
      prev.map(v =>
        v.vehicle_number === vehicleNumber
          ? { ...v, active_flag: newActiveFlag, notes: notes /* if API returns notes */ }
          : v
      )
    );
    setActionsModalVehicle(null);
    if (onVehicleListUpdate) onVehicleListUpdate(); // Notify parent to refresh
  };

  const openActionsModal = (vehicleData) => {
    setActionsModalVehicle(vehicleData);
  };
  const actionTemplate = (rowData) => {
    let iconColorClass = 'text-gray-400'; // Default color

    // Assuming vehicle data will have an 'active_flag' similar to drivers
    switch (rowData.active_flag) {
      case 1:
        iconColorClass = 'text-textActive';
        break;
      case 2: // Corresponds to 'text-textInactive' in the driver example
        iconColorClass = 'text-textInactive';
        break;
      case 3: // Corresponds to 'text-textWarn' in the driver example
        iconColorClass = 'text-textWarn';
        break;
      default:
        iconColorClass = 'text-gray-400';
    }
    return (
      <div className="flex gap-3 items-center">
      <FaCar
        className={`cursor-pointer ${iconColorClass}`} // This opens verification status modal
        onClick={() => setStatusModalVehicle(rowData)}
      />
      <FaEye
      className={`text-icon cursor-pointer ${isFetchingDetails ? 'opacity-50' : ''}`}
        onClick={() => !isFetchingDetails && handleViewVehicleDetails(rowData.vehicle_number)}
        disabled={isFetchingDetails}
        title={`View details for ${rowData.vehicle_number}`}
      />
      <FaTrashAlt
        className="text-icon cursor-pointer"
        onClick={() => openActionsModal(rowData)} // Open actions modal for delete/status
      />
      </div>
    );
  };

  return (
     
    <div className="p-4">
      {isFetchingDetails && <p className="text-center text-sm text-gray-500">Loading vehicle details...</p>}
      <CustomDataTable
        data={vehicles}
        columns={columns}
        actions={actionTemplate}
        paginationOptions={{ rows: 10, rowsPerPageOptions: [ 10, 20] }}
      />

      {/* Modals */}
      {selectedVehicle && (
        <VehicleDetail
          vehicle={selectedVehicle}
          isOpen={!!selectedVehicle}

          onClose={() => setSelectedVehicle(null)}
        />
      )}

      {statusModalVehicle && (
        <VehicleStatusModal
          vehicle={statusModalVehicle}
          isOpen={!!statusModalVehicle}
           operatorMobile={operatorMobile} 
          onClose={() => setStatusModalVehicle(null)}
          onUpdateSuccess={handleDirectVehicleStatusUpdateSuccess} // Pass the new handler
        />
      )}

      {actionsModalVehicle && (
        <VehicleStatusHandlingModal
          vehicle={actionsModalVehicle}
          isOpen={!!actionsModalVehicle}
           operatorMobile={operatorMobile}
          onClose={() => setActionsModalVehicle(null)}
          onConfirmDelete={handleVehicleDeleteSuccess}
          onStatusUpdateSuccess={handleVehicleStatusUpdateSuccess}
          currentActiveFlag={actionsModalVehicle?.active_flag} // Pass numeric flag
        />
      )}
    </div>
  );
};
