import React, { useState, } from 'react';
import { SearchBar, Button, VehicleModelTable, VehicleModelOnboard } from '@components';
import { PERMISSIONS } from '@configs';
import { usePermissions } from '@hooks';


export const VehicleModelsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {can} = usePermissions();

  return (
<>
          <div className="flex justify-between items-center">
            <h2 className="textPrimary font-bold text-xl mb-4">Vehicle Model</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
 <div className="w-full sm:w-[300px]">
    <SearchBar
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      placeholder="Search Vehicle Type..."
    />
            </div>
          {can(PERMISSIONS.ADD_VEHICLE_MODEL) && (
                        <Button onClick={() => setIsModalOpen(true)}>
              <span>＋ </span>
              Add Vehicle Model
            </Button>
          )}

          </div>
          
          <VehicleModelTable searchTerm={searchTerm} />
          
          {/* Vehicle Model Onboarding Modal */}
          <VehicleModelOnboard 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
</>
  );
};