import React, { useState, useEffect, useCallback, useContext } from 'react';
import { UpdateOperatorForm, VehicleListView, VehicleDetailsView, TriCard, AnimatedTabPanel, VehicleOnboardingForm, SearchBar } from '@components'; // Added SearchBar
import { AnimatePresence } from 'framer-motion';
import { fetchVehiclesList, fetchVehicleProfile } from '@services';
import{useAuth} from '@hooks'
import { Plus, X, Upload } from 'lucide-react';

export const VehiclesPage = () => {

  const {authData} = useAuth()
  const operatorMobile = authData?.operator_mobile

  console.log("[VehiclesPage] Operator Mobile:",authData, "Sukuna", operatorMobile);
  

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleSummary, setVehicleSummary] = useState({ active: 0, suspend: 0, in_progress: 0 });
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState(null);
  const [isLoadingVehicleDetails, setIsLoadingVehicleDetails] = useState(false);

  const loadVehicles = useCallback(async () => {
    if (!operatorMobile) {
      console.error("Operator Mobile not found in .env. Cannot fetch vehicles.");
      setIsLoadingVehicles(false);
      setVehicles([]);
      return;
    }
    console.log("[VehiclesPage] Loading vehicles for operator:", operatorMobile);
    setIsLoadingVehicles(true);
    try {
      const responseData = await fetchVehiclesList(operatorMobile);
      console.log("[VehiclesPage] API Response Data:", responseData);
      if (responseData && Array.isArray(responseData.vehicles)) {
        setVehicles(responseData.vehicles);

        // After refreshing the list, re-select the current vehicle to update its details,
        // or select the first vehicle if no vehicle was previously selected.
        if (selectedVehicleForDetails?.vehicle_number && responseData.vehicles.some(v => v.vehicle_number === selectedVehicleForDetails.vehicle_number)) {
          // If a vehicle was selected and still exists in the new list, re-select it.
          console.log("[VehiclesPage] Re-selecting vehicle:", selectedVehicleForDetails.vehicle_number);
          handleVehicleSelect(selectedVehicleForDetails.vehicle_number);
        } else if (responseData.vehicles.length > 0 && !selectedVehicleForDetails) {
          // If no vehicle was selected and the new list is not empty, select the first one.
          console.log("[VehiclesPage] Auto-selecting first vehicle as none was selected:", responseData.vehicles[0].vehicle_number);
          handleVehicleSelect(responseData.vehicles[0].vehicle_number);
        }
        console.log("[VehiclesPage] Vehicles state set with:", responseData.vehicles);
        if (responseData.summary) {
          setVehicleSummary(responseData.summary);
        } else {
          // Calculate summary if not provided by API
          const summary = responseData.vehicles.reduce((acc, vehicle) => {
            if (vehicle.active_flag === 1) acc.active++;
            else if (vehicle.active_flag === 2) acc.suspend++;
            else if (vehicle.active_flag === 3) acc.in_progress++;
            return acc;
          }, { active: 0, suspend: 0, in_progress: 0 });
          setVehicleSummary(summary);
        }

      } else {
        setVehicles([]);
      }
    } catch (error) {
      console.error("[VehiclesPage] Failed to fetch vehicles:", error);
      setVehicles([]);
    } finally {
      setIsLoadingVehicles(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operatorMobile]); // operatorMobile is a dependency for loadVehicles

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]); // Now useEffect depends on the memoized loadVehicles
  console.log("[VehiclesPage] Current vehicles state:", vehicles);
  const handleTriCardClick = (label) => {
    setSelectedStatus(prev => prev === label ? null : label);
  };

  const statusMap = {
    'Active': 1,
    'Suspended': 2,
    'In Progress': 3
  };
  console.log("[VehiclesPage] searchTerm:", searchTerm, "selectedStatus:", selectedStatus);
  const filteredVehicles = vehicles
    .filter(vehicle => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = vehicle.vehicle_number?.toLowerCase().includes(searchTermLower) ||
        vehicle.vehicle_model?.toLowerCase().includes(searchTermLower) ||
        vehicle.vehicle_type?.toLowerCase().includes(searchTermLower);

      const matchesStatus = selectedStatus ? vehicle.active_flag === statusMap[selectedStatus] : true;

      return matchesSearchTerm && matchesStatus;
    });

  console.log("[VehiclesPage] filteredVehicles count:", filteredVehicles.length);

  const handleVehicleSelect = async (vehicleNumber) => {
    if (!vehicleNumber) return;
    if (selectedVehicleForDetails && selectedVehicleForDetails.vehicle_number === vehicleNumber) {
      console.log("[VehiclesPage] Details for vehicle", vehicleNumber, "already showing. No API call needed.");
      return;
    }
    setShowForm(false);
    setShowUpdateForm(false);
    setIsLoadingVehicleDetails(true);
    setSelectedVehicleForDetails(null);
    try {
      const profileData = await fetchVehicleProfile(vehicleNumber);
      if (profileData && profileData.vehicle) {
        setSelectedVehicleForDetails(profileData.vehicle);
      } else {
        console.error("[VehiclesPage] Vehicle profile data not found or in unexpected format:", profileData);
        setSelectedVehicleForDetails(null);
      }
    } catch (error) {
      console.error("[VehiclesPage] Failed to fetch vehicle details:", error);
      setSelectedVehicleForDetails(null);
    } finally {
      setIsLoadingVehicleDetails(false);
    }
  };

  const handleVehicleUpdateSuccess = (updatedVehicleData) => {
    loadVehicles();
  };
  const handleUpdateSubmit = (updatedData) => {
    console.log("Updated data", updatedData);
    setShowUpdateForm(false);
  };

  const handleCancelUpdate = () => {
    setShowUpdateForm(false);
  };

  const triCardValues = [
    vehicleSummary.in_progress || 0,
    vehicleSummary.active || 0,
    vehicleSummary.suspend || 0
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Pane */}
        <div className="w-full md:w-1/3">
         <h2 className="textPrimary font-bold text-xl mb-2">Vehicles</h2>
          <TriCard
            values={triCardValues}
            selectedLabel={selectedStatus}
            onSelect={handleTriCardClick}
          />

          <div className="flex items-center gap-2 mb-4">
           <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search Vehicles..."
           />
           <button
  onClick={() => setShowForm(!showForm)}
  className="text-icon text-2xl hover:text-primary-dark transition"
  aria-label="Toggle Form"
>
  {showForm ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
</button>

{/* Upload icon button */}
<button
  className="text-icon hover:text-primary-dark transition ml-2"
  aria-label="Upload"
>
  <Upload className="w-6 h-6" />
</button>
          </div>
          <div className="w-full md:w-full">
            {isLoadingVehicles ? (
              <p className="text-center textSecondary">Loading vehicles...</p>
            ) : (
              <VehicleListView
                vehicles={filteredVehicles}
                onVehicleSelect={handleVehicleSelect}
              />
            )}
          </div>
        </div>

        {/* Right Pane */}
        <AnimatePresence mode="wait">
          {showForm ? (
            <AnimatedTabPanel key="onboarding-form" className="w-full md:w-2/3">
              <VehicleOnboardingForm operatorMobile={operatorMobile} />
            </AnimatedTabPanel>
          ) : showUpdateForm ? (
            <AnimatedTabPanel key="update-form" className="w-full md:w-2/3">
              <UpdateOperatorForm
                initialData={existingData}
                onSubmit={handleUpdateSubmit}
                onCancel={handleCancelUpdate}
              />
            </AnimatedTabPanel>
          ) : isLoadingVehicleDetails ? (
            <AnimatedTabPanel key="loading-vehicle-details" className="w-full md:w-2/3">
              <p className="text-center textSecondary p-4">Loading vehicle details...</p>
            </AnimatedTabPanel>
          ) : selectedVehicleForDetails ? (
            <AnimatedTabPanel key="vehicle-details-view" className="w-full md:w-2/3">
              <VehicleDetailsView
                vehicle={selectedVehicleForDetails}
                operatorMobile={operatorMobile} // Pass operatorMobile
                onUpdateSuccess={handleVehicleUpdateSuccess} // Pass success handler
                isLoadingSuspend={false /* TODO: Connect actual suspend loading state */}
              />
            </AnimatedTabPanel>
          ) : (
            <AnimatedTabPanel key="no-vehicle-selected" className="w-full md:w-2/3">
              <div className="flex items-center justify-center h-full p-4"><p className="textSecondary">Select a vehicle from the list to view details.</p></div>
            </AnimatedTabPanel>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};