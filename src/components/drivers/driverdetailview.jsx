import React, { useState, useEffect, memo } from 'react';
import { Mail, Home, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { ToggleSwitch } from '@components';
import { DriverUpdateForm } from './driverupdateform';
import { AnimatePresence } from 'framer-motion';
import { AnimatedTabPanel, DriverActionsModal } from '@components';
import Select from 'react-select';
import { Save } from 'lucide-react';
// import { DriverStatusHandlingModal } from './driverstatushandlingpopup'; // No longer needed directly here
import { DriverVerificationStatusModal } from './driververificationhandlepopup';
import { toast } from 'react-toastify';
import { fetchDriverProfile, assignVehicleToDriver, fetchUnassignedVehicles, reassignVehicleToDriver } from '@services'; // Added fetchDriverProfile
import { DriverActivationUpdateModel, DriverVehicleAssignModel, DriverVehicleReassignModel } from '@models'; // Added DriverVehicleReassignModel

const DriverDetailsViewComponent = ({ profile, operatorMobile, onUpdateSuccess }) => {
  const [internalProfile, setInternalProfile] = useState(profile);
  const driver = internalProfile?.driver;
  const summary = internalProfile?.summary;

  const [isActive, setIsActive] = useState(driver?.active_flag === 1);
  const [isLoadingSuspend, setIsLoadingSuspend] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAssigningVehicle, setIsAssigningVehicle] = useState(false); // Renamed for clarity
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  // const [isDriverStatusModalOpen, setIsDriverStatusModalOpen] = useState(false); // Replaced by DriverActionsModal
  const [isDriverVerificationModalOpen, setIsDriverVerificationModalOpen] = useState(false);
  const [isDriverActionsModalOpen, setIsDriverActionsModalOpen] = useState(false); // For the new combined modal
  const [vehicleOptions, setVehicleOptions] = useState([]); // State for dynamic vehicle options
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [isSavingVehicleAssignment, setIsSavingVehicleAssignment] = useState(false); // Loading state for vehicle assignment
    const parentOnUpdateSuccess = onUpdateSuccess;

  useEffect(() => {
    setInternalProfile(profile); // Sync when the prop changes
  }, [profile]);

  useEffect(() => {
    if (driver) { // driver here refers to profile.driver
      setIsActive(driver.active_flag === 1);
      if (driver.vehicle_assigned) {
        setSelectedVehicle({ value: driver.vehicle_assigned, label: driver.vehicle_assigned });
      } else {
        setSelectedVehicle(null);
      }
    }
  }, [driver]); // driver here refers to profile.driver

  // Fetch associated vehicles when the component mounts or operatorMobile changes
  useEffect(() => {
    const loadVehicles = async () => {
      if (operatorMobile) {
        setIsLoadingVehicles(true);
        try {
          // Use the new service to fetch only unassigned vehicles
          const responseData = await fetchUnassignedVehicles(operatorMobile);
          
          // The API response has the list under a "drivers" key,
          // and each item in that list contains vehicle_number.
          const unassignedVehicleList = responseData.drivers || []; 
          
          const options = unassignedVehicleList.map(vehicleData => ({
            value: vehicleData.vehicle_number, 
            label: vehicleData.vehicle_number, // Only vehicle_number is available in the provided response
          }));
          setVehicleOptions(options);
        } catch (error) {
          console.error("Failed to fetch unassigned vehicles:", error);
          toast.error("Could not load available vehicles.");
          setVehicleOptions([]); // Set to empty array on error
        } finally {
          setIsLoadingVehicles(false);
        }
      }
    };
    loadVehicles();
  }, [operatorMobile]);

   const refreshDetailedProfile = async () => {
    if (driver?.driver_mobile) {
      try {
        const newlyFetchedProfile = await fetchDriverProfile(driver.driver_mobile);
        if (newlyFetchedProfile) {
          setInternalProfile(newlyFetchedProfile);
        } else {
          console.warn(`[DriverDetailsView] Profile for ${driver.driver_mobile} not found after update or fetch returned null.`);
          // Optionally, handle cases where the profile might no longer exist or is inaccessible
        }
      } catch (error) {
        console.error(`[DriverDetailsView] Failed to refetch profile for ${driver.driver_mobile}:`, error);
        toast.error("Failed to refresh driver details.");
      }
    }
  };

  const handleAssignVehicleSave = async () => {
    if (!selectedVehicle || !selectedVehicle.value) {
      toast.error("Please select a vehicle to assign.");
      return;
    }
    if (!driver || !driver.driver_mobile || !operatorMobile) {
      toast.error("Driver or operator details are missing.");
      return;
    }

    setIsSavingVehicleAssignment(true);

    try {
      let response;
      if (!driver.vehicle_assigned) {
        // No vehicle currently assigned, use assign service
        const modelInstance = new DriverVehicleAssignModel(
          operatorMobile,
          driver.driver_mobile,
          selectedVehicle.value
        );
        const payload = modelInstance.toPayload();
        response = await assignVehicleToDriver(payload);
        toast.success(response?.message || `Vehicle ${selectedVehicle.value} assigned to ${driver.driver_name} successfully.`);
      } else {
        // Driver already has a vehicle, use reassign service
        if (driver.vehicle_assigned === selectedVehicle.value) {
          toast.info(`Driver ${driver.driver_name} is already assigned to vehicle ${selectedVehicle.value}.`);
          setIsSavingVehicleAssignment(false);
          setIsAssigningVehicle(false); // Close edit mode
          return;
        }
        const modelInstance = new DriverVehicleReassignModel(
          operatorMobile,
          driver.driver_mobile,
          driver.vehicle_assigned, // current vehicle
          selectedVehicle.value    // new vehicle
        );
        const payload = modelInstance.toPayload();
        response = await reassignVehicleToDriver(payload);
        toast.success(response?.message || `Vehicle for ${driver.driver_name} changed to ${selectedVehicle.value} successfully.`);
      }

       await refreshDetailedProfile(); // Refresh the detailed view

      setIsAssigningVehicle(false);
      if (parentOnUpdateSuccess) {
        parentOnUpdateSuccess(); // Notify parent to refresh driver profile
      }
    } catch (error) {
      const action = driver.vehicle_assigned ? "reassign" : "assign";
      console.error(`Failed to ${action} vehicle:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action} vehicle.`);
    } finally {
      setIsSavingVehicleAssignment(false);
    }
  };
  const handleToggle = () => {
    // This will now open the DriverActionsModal, which handles status updates
    setIsDriverActionsModalOpen(true);
  };

  // This is the actual handler for status update success from DriverActionsModal
  const handleDriverStatusUpdateSuccess = async (driverMobile, newActiveFlag, statusNotes) => {
    // The API call is made within DriverActionsModal.
    // This function is called upon successful completion of that API call.
    console.log(`[DriverDetailsView] Status update success for ${driverMobile} to ${newActiveFlag} with notes: ${statusNotes}`);
    setIsActive(newActiveFlag === 1); // Update local UI
    await refreshDetailedProfile(); // Refresh the detailed view
    if (parentOnUpdateSuccess) {
      parentOnUpdateSuccess(); // Notify parent
    }
    setIsDriverActionsModalOpen(false); // Close modal
  };

  const handleFormUpdateSuccess = async () => {
    setIsEditing(false); // Close the form
   await refreshDetailedProfile(); // Refresh the detailed view
    if (parentOnUpdateSuccess) {
      parentOnUpdateSuccess(); // Notify parent
    }
  };

  const handleVerificationUpdateSuccess = async () => {
    await refreshDetailedProfile(); // Refresh the detailed view
    if (parentOnUpdateSuccess) {
      parentOnUpdateSuccess(); // Notify parent
    }
  };

  const handleDriverDeleteSuccess = (deletedDriverMobile) => {
    console.log(`[DriverDetailsView] Delete success for ${deletedDriverMobile}`);
   if (parentOnUpdateSuccess) {
      parentOnUpdateSuccess(); // Notify parent to refresh list
    }
    setIsDriverActionsModalOpen(false); // Close modal
    // Potentially navigate away or show a placeholder if current driver is deleted
  };

  if (!driver) {
    // Handle case where driver data is not yet available or invalid
    return <AnimatedTabPanel key="no-driver-data"><div className="p-4 text-center textSecondary">Driver details not available.</div></AnimatedTabPanel>;
  };

  return (
    <AnimatePresence mode='wait'>
      {isEditing ? (
        <AnimatedTabPanel key='driver-update-form'>
          <DriverUpdateForm
            driver={driver}
            operatorMobile={operatorMobile}
            onCancel={() => setIsEditing(false)}
            onUpdateSuccess={handleFormUpdateSuccess}
          />
        </AnimatedTabPanel>
      ) : (
        <AnimatedTabPanel key='driver-details-view'>
          <div className="flex flex-col md:flex-row p-2 gap-6">
            {/* Left Section */}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4">
                {/* Name & Phone */}
                <div className="flex items-center gap-4">
                  {driver?.driver_image ? (
                    <img src={driver.driver_image} alt={driver.driver_name} className="w-16 h-16 rounded-full object-cover bg-gray-200" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                  ) : null}
                  <div className={`w-16 h-16 rounded-full bg-gray-300 items-center justify-center text-gray-500 text-xl font-bold ${driver?.driver_image ? 'hidden' : 'flex'}`}>
                    {driver?.driver_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="textPrimary">{driver?.driver_name || 'N/A'}</h2>
                    <p className="textSecondary">{driver?.driver_mobile || 'N/A'}</p>
                  </div>
                </div>

                {/* Icons + Toggle */}
                <div className="flex items-center space-x-2">
                  <Pencil
                    className="w-5 h-5 text-icon cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  />
                  <ShieldCheck
                    className="w-5 h-5 text-icon cursor-pointer"
                    onClick={() => setIsDriverVerificationModalOpen(true)}
                  />
                  {/* <Trash2
                    className="w-5 h-5 text-icon hover:text-red-700 cursor-pointer"
                    onClick={() => setIsDriverActionsModalOpen(true)} // Open the combined modal
                  /> */}
                  <label className="inline-flex items-center cursor-pointer">
                    <ToggleSwitch
                      isActive={isActive}
                      onToggle={handleToggle}
                      disabled={isLoadingSuspend}
                    />
                  </label>
                </div>
              </div>

              {/* Vehicle Assigned */}
              <AnimatePresence mode='wait'>
                <div className="mt-2">
                  <h3 className="textPrimary mb-2">Vehicle Assigned</h3>
                  <div className="flex flex-wrap items-center gap-10">
                    <div className="flex items-center gap-4">
                       {/* Placeholder for vehicle image - not in driver profile API response */}
                      <div className="w-20 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                        {/* Veh. Img */}
                      </div>
                      <div>
                        <p className="textSecondary">Vehicle Number</p>
                        {isAssigningVehicle ? ( // Changed from isVehicleEditing
                          <div className="flex items-center gap-2">
                            <div className="w-[250px]">
                              <Select
                                options={vehicleOptions}
                                value={selectedVehicle}
                                isLoading={isLoadingVehicles}
                                onChange={setSelectedVehicle}
                                className='textSecondary'
                                placeholder="Vehicle Number"
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderColor: "#facc15",
                                    borderRadius: 6,
                                    minHeight: 40,
                                  }),
                                  dropdownIndicator: (base) => ({
                                    ...base,
                                    color: "#005AC7",
                                  }),
                                }}
                              />
                            </div>
                            <Save
                              className="w-5 h-5 text-icon cursor-pointer"
                              onClick={handleAssignVehicleSave}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="font-icon textPrimary">{driver?.vehicle_assigned || 'N/A'}</p>
                            <Pencil
                              className="w-4 h-4 text-icon cursor-pointer"
                              onClick={() => setIsAssigningVehicle(true)} // Changed from setIsVehicleEditing
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Always visible vehicle info */}
                    <div>
                      <p className="textSecondary">Vehicle Model</p>
                      <p className="textPrimary">{driver?.vehicle_model || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="textSecondary">Vehicle Type</p>
                      <p className="textPrimary">{driver?.vehicle_type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="textSecondary">Seat</p>
                      <p className="textPrimary">{driver?.vehicle_seating_capacity || 'N/A'}</p>
                    </div>
                  </div>
                  <hr className="mt-4 border-t border-gray-300" />
                </div>

              </AnimatePresence>


              {/* Documents */}
              <div className="mt-4">
                <h3 className=" mb-2 textPrimary">Documents</h3>
                <div className="flex flex-wrap gap-8 mb-4">
                  <div className="flex items-center gap-4">
                    {driver?.aadhar_image ? (
                      <img src={driver.aadhar_image} alt="Aadhar" className="w-20 h-10 rounded object-cover bg-gray-200" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                    ) : null}
                    <div className={`w-20 h-10 bg-gray-200 rounded items-center justify-center text-xs text-gray-400 ${driver?.aadhar_image ? 'hidden' : 'flex'}`}>Aadhar</div>
                    <div>
                      <p className="textSecondary">Aadhar Number</p>
                      <p className="textPrimary">{driver?.aadhar_number || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {driver?.pan_image ? (
                      <img src={driver.pan_image} alt="PAN" className="w-20 h-10 rounded object-cover bg-gray-200" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                    ) : null}
                    <div className={`w-20 h-10 bg-gray-200 rounded items-center justify-center text-xs text-gray-400 ${driver?.pan_image ? 'hidden' : 'flex'}`}>PAN</div>
                    <div>
                      <p className="textSecondary">PAN Number</p>
                      <p className="textPrimary">{driver?.pan_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-8">
                  <div className="flex items-center gap-4">
                    {driver?.licence_image ? (
                      <img src={driver.licence_image} alt="License" className="w-20 h-10 rounded object-cover bg-gray-200" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                    ) : null}
                    <div className={`w-20 h-10 bg-gray-200 rounded items-center justify-center text-xs text-gray-400 ${driver?.licence_image ? 'hidden' : 'flex'}`}>License</div>
                    <div>
                      <p className="textSecondary">License Number</p>
                      <p className="textPrimary">{driver?.driving_license_number || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="textSecondary">License Type</p>
                      <p className="textPrimary">{driver?.license_type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="textSecondary">Valid From</p>
                      <p className="textPrimary">{driver?.license_valid_from || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="textSecondary">Valid Upto</p>
                      <p className="textPrimary">{driver?.license_valid_upto || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 textSecondary">
                  <Mail className="w-4 h-4 text-icon" />
                  {driver?.driver_email || 'N/A'}
                </div>
                <div className="flex items-start gap-2 textSecondary">
                  <Home className="w-4 h-4 text-icon" />
                  {driver?.driver_address ? `${driver.driver_address}${driver.driver_city ? ', ' + driver.driver_city : ''}${driver.driver_state ? ', ' + driver.driver_state : ''}${driver.driver_pincode ? ' - ' + driver.driver_pincode : ''}${driver.driver_country ? ', ' + driver.driver_country : ''}` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Right Section - Stats */}
            <div className="bg-icon p-4 rounded-md w-full md:w-[350px] text-center textPrimary self-start min-h-[250px]">
              <h3 className="textPrimary text-white mb-2">Driver Statistics</h3>
              <div className="bg-white rounded-md p-4 mb-4">
                <p className="textSecondary">Trips</p>
                <p className="textPrimary">{summary?.total_trips ?? 'N/A'}</p>
              </div>
              <div className="bg-white rounded-md p-4 mb-4">
                <p className="textSecondary">Revenue</p>
                <p className="textPrimary">{summary?.revenue ?? 'N/A'}</p>
              </div>
              <div className="bg-white rounded-md p-4">
                <p className="textSecondary">Average Rating</p>
                <p className="textPrimary">{summary?.driver_rating ?? 'N/A'}</p>
              </div>
            </div>
            {/* Combined Modal for Delete and Status Update */}
            {isDriverActionsModalOpen && (
              <DriverActionsModal
                isOpen={isDriverActionsModalOpen}
                onClose={() => setIsDriverActionsModalOpen(false)}
                driver={driver}
                operatorMobile={operatorMobile}
                onConfirmDelete={handleDriverDeleteSuccess}
                onStatusUpdateSuccess={handleDriverStatusUpdateSuccess}
                currentActiveFlag={driver?.active_flag}
              />
            )}
            <DriverVerificationStatusModal
              driver={driver}
              operatorMobile={operatorMobile} // Pass operatorMobile
              isOpen={isDriverVerificationModalOpen}
              onClose={() => setIsDriverVerificationModalOpen(false)}
              onUpdateSuccess={handleVerificationUpdateSuccess} // Pass success handler for list refresh
            />
          </div>
        </AnimatedTabPanel>
      )}
    </AnimatePresence>
  );
};

export const DriverDetailsView = memo(DriverDetailsViewComponent);
