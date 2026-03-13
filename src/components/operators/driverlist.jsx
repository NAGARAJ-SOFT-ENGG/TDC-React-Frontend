import React, { useState, useEffect } from "react";
import { FaUserAlt, FaEye, FaTrashAlt } from "react-icons/fa";
import { DriverDetailModal } from "./driverdetailpopup";
import { CustomDataTable, DriverActionsModal } from "@components";
import { DriverVerificationStatusModal } from "../drivers/driververificationhandlepopup"; // Import the verification modal
import { fetchDriverProfile } from "@services";
// import {DriverStatusModal} from './driverdetailpopup'

export const DriversList = ({ drivers: initialDrivers, operatorMobile, onDriverListUpdate }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [actionsModalDriver, setActionsModalDriver] = useState(null); // Combined state for the new modal
  const [verificationModalDriver, setVerificationModalDriver] = useState(null); // State for verification modal
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  // This state will hold the drivers list and can be updated locally
  const [drivers, setDrivers] = useState(initialDrivers);

  // console.log('[DriversList] Rendered with operatorMobile:', operatorMobile, 'and initial drivers count:', initialDrivers?.length);

  useEffect(() => {
    setDrivers(initialDrivers); // Sync with prop changes
  }, [initialDrivers]);

  const handleViewDriverDetails = async (driverMobile) => {
    if (!driverMobile) return;
    setIsFetchingDetails(true);
    setSelectedDriver(null); // Clear previous selection / close modal if open
    try {
      const profileData = await fetchDriverProfile(driverMobile);
      if (profileData && profileData.driver) {
        setSelectedDriver(profileData.driver); // Set the detailed driver profile
      } else {
        console.error("Driver profile data not found or in unexpected format:", profileData);
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error("Failed to fetch driver details:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const columns = [
    { field: 'driver_name', header: 'Name', sortable: true },
    { field: 'driver_mobile', header: 'Mobile', sortable: false },
    { field: 'vehicle_assigned', header: 'Vehicle Assigned', sortable: false },
    { field: 'driver_rating', header: 'Rating', sortable: true },
    { field: 'total_trips', header: 'Total Trips', sortable: true }
  ];

  const handleDriverStatusUpdated = (driverMobile, newActiveFlag, newNotes) => {
    console.log('[DriversList] Driver status updated:', { driverMobile, newActiveFlag, newNotes });
    // Update the local list for immediate UI feedback
    setDrivers(prevDrivers =>
      prevDrivers.map(d =>
        d.driver_mobile === driverMobile
          ? { ...d, active_flag: newActiveFlag, notes: newNotes }
          : d
      )
    );
    // Optionally, if a callback is provided by OperatorPage to refresh the main list
    if (onDriverListUpdate) {
      onDriverListUpdate(); // This would typically trigger a re-fetch in OperatorPage
    }
    setActionsModalDriver(null); // Close the actions modal
  };

  const handleDriverVerificationUpdated = (driverMobile, newVerificationStatus, newNotes) => {
    console.log('[DriversList] Driver verification status updated:', { driverMobile, newVerificationStatus, newNotes });
    setDrivers(prevDrivers =>
      prevDrivers.map(d =>
        d.driver_mobile === driverMobile
          ? { ...d, verification_status: newVerificationStatus, notes: newNotes } // Assuming notes might also be updated
          : d
      )
    );
    if (onDriverListUpdate) {
      onDriverListUpdate();
    }
    setVerificationModalDriver(null); // Close the verification modal
  };

  // Similar handler for delete confirmation
  const handleDriverDeleted = (deletedDriverMobile) => {
    console.log('[DriversList] Driver deleted:', deletedDriverMobile);
    setDrivers(prevDrivers => prevDrivers.filter(d => d.driver_mobile !== deletedDriverMobile));
    if (onDriverListUpdate) {
      onDriverListUpdate();
    }
    setActionsModalDriver(null); // Close the actions modal
  };

  const actionTemplate = (rowData) => {
    // console.log('[DriversList] Rendering actionTemplate for driver:', rowData.driver_mobile, 'active_flag:', rowData.active_flag, 'operatorMobile prop:', operatorMobile);
    let iconColorClass = 'text-gray-400'; // Default color

    switch (rowData.active_flag) {
      case 1:
        iconColorClass = 'text-textActive';
        break;
      case 2:
        iconColorClass = 'text-textInactive';
        break;
      case 3:
        iconColorClass = 'text-textWarn';
        break;
      default:
        iconColorClass = 'text-gray-400';
    }
    return (
      <div className="flex gap-3 items-start">
      <FaUserAlt
        className={`cursor-pointer ${iconColorClass}`} // Changed to open verification modal
        onClick={() => (operatorMobile && rowData?.driver_mobile) ? setVerificationModalDriver(rowData) : console.warn("[DriversList] Cannot open verification modal: Operator mobile or Driver mobile is missing.")}
      />
      <FaEye
        className={`text-icon cursor-pointer ${isFetchingDetails && 'opacity-50'}`}
        onClick={() => !isFetchingDetails && handleViewDriverDetails(rowData.driver_mobile)}
        disabled={isFetchingDetails}
      />
      <FaTrashAlt
        className="text-icon cursor-pointer"
         onClick={() => (operatorMobile && rowData?.driver_mobile) ? setActionsModalDriver(rowData) : console.warn("[DriversList] Cannot open actions modal for delete: Operator mobile or Driver mobile is missing.")}
      />
      </div>
    );
  };

  return (
    <div className="p-4">
        {isFetchingDetails && <p className="text-center text-sm text-gray-500">Loading driver details...</p>}
      <CustomDataTable
        data={drivers}
        columns={columns}
        actions={actionTemplate}
        paginationOptions={{ rows: 10, rowsPerPageOptions: [ 10, 20] }}
      />

      {/* Modals */}
      {selectedDriver && (
        <DriverDetailModal
          driver={selectedDriver}
           operatorMobile={operatorMobile}
          isOpen={!!selectedDriver}
          onClose={() => setSelectedDriver(null)}
        />
      )}
      {/* Use DriverActionsModal for both status updates and deletions */}
      {actionsModalDriver && (
        <DriverActionsModal
        isOpen={!!actionsModalDriver}
        driver={actionsModalDriver}
        operatorMobile={operatorMobile}
        onClose={() => setActionsModalDriver(null)}
        onConfirmDelete={handleDriverDeleted}
        onStatusUpdateSuccess={handleDriverStatusUpdated}
        currentActiveFlag={actionsModalDriver?.active_flag}
        />
      )}
      {/* Verification Status Modal */}
      {verificationModalDriver && (
        <DriverVerificationStatusModal
          isOpen={!!verificationModalDriver}
          driver={verificationModalDriver}
          operatorMobile={operatorMobile}
          onClose={() => setVerificationModalDriver(null)}
          onUpdateSuccess={handleDriverVerificationUpdated}
        />
      )}
    </div>
  );
};
