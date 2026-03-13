import React, { useState } from 'react';
import { SearchBar, Button, VehicleTypesTable, AddVehicleType } from '@components';
import { PERMISSIONS } from '@configs';
import { usePermissions } from '@hooks';





export const VehicleTypesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Important for triggering table refresh

  const handleAddVehicleTypeSuccess = () => {
    setIsModalOpen(false);
    setRefreshKey(prevKey => prevKey + 1); // Trigger refresh
  };

  const { can } = usePermissions();

  return (
<>
          <div className="flex justify-between items-center">
            <h2 className="textPrimary font-bold text-xl mb-4">Vehicle Types</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
 <div className="w-full sm:w-[300px]">
    <SearchBar
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      placeholder="Search Vehicle Types..."
    />
                
            </div>
    {can(PERMISSIONS.ADD_VEHICLE_TYPE) && (
            <Button onClick={() => setIsModalOpen(true)}>
              <span>＋ </span>
              Add Vehicle Type
            </Button>
 )}
          </div>
                                 

          {/* This is where the API call is triggered via useEffect in VehicleTypesTable */}
          <VehicleTypesTable searchTerm={searchTerm} refreshTrigger={refreshKey} /> 
          
          {/* Vehicle Type Onboarding Modal (Placeholder) */}
          <AddVehicleType
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSaveSuccess={handleAddVehicleTypeSuccess}
          />

</>
  );
};
