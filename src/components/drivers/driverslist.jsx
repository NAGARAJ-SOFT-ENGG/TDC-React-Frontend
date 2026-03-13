import React, { useState } from 'react';
import { CustomDataTable } from '@components';
import { FaUserAlt, FaEye } from "react-icons/fa";
import { DriverDetailsView } from './driverdetailview';
import { AnimatePresence } from 'framer-motion';
import { AnimatedTabPanel } from '@components';
import { fetchDriverProfile } from '@services'; // Import the service

export const DriversListView = ({ drivers, operatorMobile, onListRefresh }) => {

  const [showDetailsView, setShowDetailsView] = useState(false);
  const [selectedDriverProfile, setSelectedDriverProfile] = useState(null); // Renamed for clarity
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleViewClick = async (rowData) => {
    if (!rowData || !rowData.driver_mobile) {
      console.error("Driver mobile not available in rowData");
      return;
    }
    setIsLoadingDetails(true);
    setSelectedDriverProfile(null); // Clear previous details
    try {
      const profileData = await fetchDriverProfile(rowData.driver_mobile);
      if (profileData) { // Expecting profileData to be { summary: {}, driver: {} }
        setSelectedDriverProfile(profileData); // Store the whole profile object
        setShowDetailsView(true);
      } else {
        console.error("Failed to fetch driver profile or profile data is not in expected format:", profileData);
        // Optionally, show an error to the user
      }
    } catch (error) {
      console.error("Error fetching driver profile:", error);
      // Optionally, show an error to the user
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleBack = () => {
    setShowDetailsView(false);
    setSelectedDriverProfile(null);
    if (onListRefresh) {
      onListRefresh(); // Call the refresh function when going back to the list
    }
  };

  const getDriverStatusColor = (activeFlag) => {
  switch (activeFlag) {
    case 1:
      return 'text-textActive';
    case 2:
      return 'text-textInactive';
    case 3:
      return  'text-textWarn';
    default:
      return 'text-gray-300';
  }
};

const nameBodyTemplate = (rowData) => {
  return (
    <div className="flex items-center gap-2">
      <FaUserAlt className={`${getDriverStatusColor(rowData.active_flag)}`} />
      <span>{rowData.driver_name}</span>
    </div>
  );
};

const columns = [
  { field: 'driver_name', header: 'Name', sortable: true, body: nameBodyTemplate },
  { field: 'driver_mobile', header: 'Phone', sortable: true },
  { field: 'driver_rating', header: 'Rating', sortable: true }, // Assuming API provides driver_rating
  { field: 'total_trips', header: 'Trip Count', sortable: true }, // Assuming API provides total_trips
];
  return (
    <AnimatePresence mode="wait">
      {isLoadingDetails ? (
        <AnimatedTabPanel key="loading-driver-details">
          <div className="p-2 min-h-screen flex justify-center items-center">
            <p className="textSecondary">Loading driver details...</p>
          </div>
        </AnimatedTabPanel>
      ) : showDetailsView && selectedDriverProfile && selectedDriverProfile.driver ? (
        <AnimatedTabPanel key="driver-detail">
          <div className="p-2 min-h-screen">
            <div className="text-end">
              <span onClick={handleBack} className="text-icon text-2xl cursor-pointer">×</span>
            </div>
            <DriverDetailsView
              profile={selectedDriverProfile}
              operatorMobile={operatorMobile}
              onUpdateSuccess={onListRefresh} // Pass the refresh function for updates within details view
            />
          </div>
        </AnimatedTabPanel>
      ) : (
        <AnimatedTabPanel key="drivers-list">
          <div className="p-2 bg-white min-h-screen">
            <CustomDataTable
              data={drivers}
              columns={columns}
              paginationOptions={{
                rows: 10,
                rowsPerPageOptions: [5, 10, 20],
              }}
              onRowClick={handleViewClick} // Pass the click handler here
            />
          </div>
        </AnimatedTabPanel>
      )}
    </AnimatePresence>
  );
};
