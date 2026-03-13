import React, { useState, useEffect, memo } from "react";
import { Pencil, ShieldCheck, Save } from "lucide-react";
import { ToggleSwitch } from "@/components";
import { UpdateVehicleForm } from "./updatevehicleform"; // Import the new form
import { VehicleStatusModal, } from "./vehiclestatusverificationpopup";
import { VehicleStatusHandlingModal } from "./vehiclestatushandlingpopup";
import Select from "react-select";
import {
  fetchUnassignedDrivers, 
  assignDriverToVehicle, 
  reassignDriverToVehicle 
} from "@services";
import { 
  VehicleDriverAssignModel, 
  VehicleDriverReassignModel 
} from "@models";
import { toast } from "react-toastify";

const VehicleDetailsViewComponent = ({ vehicle, isLoadingSuspend, operatorMobile, onUpdateSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isToggleReasonModalOpen, setIsToggleReasonModalOpen] = useState(false);
  const [isEditingDriver, setIsEditingDriver] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverOptions, setDriverOptions] = useState([]); // State for dynamic driver options
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  const [isSavingDriverAssignment, setIsSavingDriverAssignment] = useState(false);
  
  // Initialize isActive based on vehicle.active_flag (assuming 1 is Active)
  // Adjust this logic if your active_status has more states for the toggle.
  const [isActive, setIsActive] = useState(vehicle?.active_flag === 1);

  useEffect(() => {
    // active_flag is numeric (e.g., 1 for active, 2 for suspended)
    setIsActive(vehicle?.active_flag === 1);
    // Pre-fill selectedDriver if a driver is already assigned when entering edit mode
    if (vehicle?.driver_mobile && vehicle?.driver_name) {
      setSelectedDriver({
        value: vehicle.driver_mobile,
        label: vehicle.driver_name,
      });
    } else {
      setSelectedDriver(null);
    }
  }, [vehicle?.active_flag]);

  // Fetch associated drivers when the component mounts or operatorMobile changes
  useEffect(() => {
    const loadDrivers = async () => {
      if (operatorMobile) {
        setIsLoadingDrivers(true);
        try {
          // Fetch unassigned drivers instead of all associated drivers
          const responseData = await fetchUnassignedDrivers(operatorMobile);
          // Assuming the API response has the list under a "drivers" key
          const unassignedDriversList = responseData.drivers || []; 

          const options = unassignedDriversList.map(driver => ({
            value: driver.driver_mobile, // Assuming driver_mobile is the unique identifier
            label: driver.driver_name,
          }));
          setDriverOptions(options);
        } catch (error) {
          console.error("Failed to fetch unassigned drivers:", error);          
          toast.error("Could not load available drivers."); // Added toast for user feedback
          setDriverOptions([]); // Set to empty array on error
        } finally {
          setIsLoadingDrivers(false);
        }
      }
    };
    loadDrivers();
  }, [operatorMobile]);


  const getDisplayValue = (value, defaultValue = "N/A") => value || defaultValue;

  const handleToggle = () => {
    // Now, this toggle will open the delete confirmation modal
    setIsToggleReasonModalOpen(true);
  };

  const handleDeleteSuccess = (deletedVehicleNumber) => {
    console.log("Vehicle deletion confirmed for:", vehicle?.vehicle_number);
    setIsToggleReasonModalOpen(false);
    if (onUpdateSuccess) {
      onUpdateSuccess({ action: 'delete', vehicleNumber: deletedVehicleNumber });
    }
  };

  const handleStatusUpdateSuccess = (vehicleNumber, newActiveFlag, notes) => {
    console.log("Vehicle status update confirmed for:", vehicleNumber, "to", newActiveFlag);
    setIsToggleReasonModalOpen(false);
    // Update local state for the toggle switch
    setIsActive(newActiveFlag === 1);
    if (onUpdateSuccess) {
      // Notify parent to refresh or update data
      // The parent might need the newActiveFlag to update its list correctly
      onUpdateSuccess({ action: 'statusUpdate', vehicleNumber, newActiveFlag, notes });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleFormSubmitSuccess = (updatedVehicleData) => {
    console.log("Vehicle update successful in details view:", updatedVehicleData);
    setIsEditing(false);
    // Call parent's success handler to refresh list or update state
    if (onUpdateSuccess) onUpdateSuccess(updatedVehicleData); 
  };

  const handleDriverSave = async () => {
    if (!selectedDriver || !selectedDriver.value) {
      toast.error("Please select a driver to assign.");
      return;
    }
    if (!vehicle || !vehicle.vehicle_number || !operatorMobile) {
      toast.error("Vehicle or operator details are missing.");
      return;
    }

    setIsSavingDriverAssignment(true);
    try {
      let response;
      if (!vehicle.driver_mobile) { // No driver currently assigned to this vehicle
        const modelInstance = new VehicleDriverAssignModel(
          operatorMobile,
          vehicle.vehicle_number,
          selectedDriver.value
        );
        const payload = modelInstance.toPayload();
        response = await assignDriverToVehicle(payload);
        toast.success(response?.message || `Driver ${selectedDriver.label} assigned to vehicle ${vehicle.vehicle_number} successfully.`);
      } else { // A driver is already assigned, so this is a reassignment
        if (vehicle.driver_mobile === selectedDriver.value) {
          toast.info(`Vehicle ${vehicle.vehicle_number} is already assigned to driver ${selectedDriver.label}.`);
          setIsSavingDriverAssignment(false);
          setIsEditingDriver(false);
          return;
        }
        const modelInstance = new VehicleDriverReassignModel(
          operatorMobile,
          vehicle.vehicle_number,
          vehicle.driver_mobile, // current driver_mobile
          selectedDriver.value   // new driver_mobile
        );
        const payload = modelInstance.toPayload();
        response = await reassignDriverToVehicle(payload);
        toast.success(response?.message || `Vehicle ${vehicle.vehicle_number} reassigned to driver ${selectedDriver.label} successfully.`);
      }
      setIsEditingDriver(false);
      if (onUpdateSuccess) onUpdateSuccess(); // Notify parent to refresh vehicle profile
    } catch (error) {
      const action = vehicle.driver_mobile ? "reassign" : "assign";
      console.error(`Failed to ${action} driver:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action} driver.`);
    } finally {
      setIsSavingDriverAssignment(false);
    }
  };

  if (isEditing) {
    return (
      <UpdateVehicleForm
        vehicle={vehicle} // Pass the current vehicle data
        operatorMobile={operatorMobile} // Pass operatorMobile if needed by the update API
        onCancel={handleCancelEdit}
        onSubmitSuccess={handleFormSubmitSuccess}
      />
    );
  }

  return (
    <div className="p-2 space-y-3 text-sm">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="textPrimary text-lg">{getDisplayValue(vehicle?.vehicle_number)}</h2>
        <div className="flex items-center space-x-2">
          <Pencil
            className="w-5 h-5 text-icon cursor-pointer"
            onClick={() => setIsEditing(true)}
          />
          <ShieldCheck
            className="w-5 h-5 text-icon cursor-pointer"
            onClick={() => setIsStatusModalOpen(true)}
          />
          <ToggleSwitch
            isActive={isActive}
            onToggle={handleToggle}
            disabled={isLoadingSuspend}
          />
        </div>
      </div>

      {/* Sections (unchanged) */}
      <Section title="Vehicle Info">
        {/* We don't have a general vehicle image in the API response, so ImagePlaceholder might be removed or repurposed */}
        <Info label="Vehicle Model" value={getDisplayValue(vehicle?.vehicle_model)} />
        <Info label="Vehicle Type" value={getDisplayValue(vehicle?.vehicle_type)} />
        <Info label="Seating Capacity" value={getDisplayValue(vehicle?.vehicle_seating_capacity)} />
        <Info label="Active Permits" value={getDisplayValue(vehicle?.active_permits)} />
      </Section>

      <Section title="Driver Info" editable={false}>
        {isEditingDriver ? (
          <div className="flex flex-col space-y-2 w-full">
            <div className="flex justify-between items-start w-full">
              <div className="w-[250px]">
                <Select
                  options={driverOptions}
                  placeholder="Driver"
                  value={selectedDriver}
                  classNamePrefix={'react-select'}
                  isLoading={isLoadingDrivers}
                  onChange={setSelectedDriver}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#facc15", // yellow
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
                disabled={isSavingDriverAssignment}
                onClick={handleDriverSave}
              />
            </div>
          </div>
        ) : (
          <>
            {vehicle?.driver_image && <img src={vehicle.driver_image} alt="Driver" className="w-20 h-12 bg-gray-200 rounded object-cover" onError={(e) => e.target.style.display='none'}/>}
            <Info label="Driver Name" value={getDisplayValue(vehicle?.driver_name)} />
            <Info label="Mobile" value={getDisplayValue(vehicle?.driver_mobile)} />
            <Pencil
              className="w-4 h-4 text-icon cursor-pointer ml-auto"
              onClick={() => setIsEditingDriver(true)}
            />
          </>
        )}
      </Section>

      <Section title="Registration Certificate">
        {vehicle?.rc_image && <img src={vehicle.rc_image} alt="RC" className="w-20 h-12 bg-gray-200 rounded object-cover" onError={(e) => e.target.style.display='none'}/>}
        <Info label="RC Number" value={getDisplayValue(vehicle?.rc_number)} />
      </Section>

      <Section title="Insurance">
        {vehicle?.insurance_image && <img src={vehicle.insurance_image} alt="Insurance" className="w-20 h-12 bg-gray-200 rounded object-cover" onError={(e) => e.target.style.display='none'}/>}
        <Info label="Valid From" value={formatDate(vehicle?.insurance_valid_from)} icon />
        <Info label="Valid Upto" value={formatDate(vehicle?.insurance_valid_upto)} icon />
      </Section>

      <Section title="Fitness Certificate">
        {vehicle?.fc_image && <img src={vehicle.fc_image} alt="Fitness Certificate" className="w-20 h-12 bg-gray-200 rounded object-cover" onError={(e) => e.target.style.display='none'}/>}
        <Info label="Valid From" value={formatDate(vehicle?.fc_valid_from)} icon />
        <Info label="Valid Upto" value={formatDate(vehicle?.fc_valid_upto)} icon />
      </Section>

      <Section title="Performance & Status">
        <Info label="Total Trips" value={getDisplayValue(vehicle?.total_trips)} />
        <Info label="Vehicle Rating" value={getDisplayValue(vehicle?.vehicle_rating)} />
        <Info label="Verification Status" value={getDisplayValue(vehicle?.verification_status)} />
        <Info label="Active Status" value={getDisplayValue(vehicle?.active_status)} />
      </Section>

      <VehicleStatusModal
        // This modal might need to be updated to handle vehicle-specific verification statuses
        // if they differ from operator verification.
        vehicle={vehicle}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        operatorMobile={operatorMobile} // Pass the operatorMobile prop
        onUpdateSuccess={onUpdateSuccess} // Pass the onUpdateSuccess callback
      />

      <VehicleStatusHandlingModal
        isOpen={isToggleReasonModalOpen}
        onClose={() => setIsToggleReasonModalOpen(false)}
        vehicle={vehicle} // Pass the vehicle object
        operatorMobile={operatorMobile} // Pass operatorMobile
        onConfirmDelete={handleDeleteSuccess} 
        onStatusUpdateSuccess={handleStatusUpdateSuccess}
        currentActiveFlag={vehicle?.active_flag} // Pass the numeric active_flag
      />
    </div>
  );
};

const Section = ({ title, children, editable }) => (
  <div className="textSecondary  space-y-3 border-t pt-2">
    <div className="flex justify-between items-center">
      <p className="textPrimary text-icon ">{title}</p>
      {editable && <Pencil className="w-4 h-4 text-primary cursor-pointer" />}
    </div>
    <div className="flex flex-wrap gap-6">{children}</div>
  </div>
);

const Info = ({ label, value, icon }) => (
  <div className="min-w-[140px]">
    <p className="textPrimary ">{label}</p>
    <p className="textSecondary ">{icon ? `📅 ${value}` : value}</p> {/* Value already has "N/A" from getDisplayValue */}
  </div>
);

const formatDate = (date) => { // Parameter is 'date'
  if (!date || date === "N/A") return "N/A"; // Use 'date' here
  const d = new Date(date); // Use 'date' here
  if (isNaN(d.getTime())) return "N/A"; // Handle invalid date strings
  return d.toLocaleDateString("en-GB");
};

export const VehicleDetailsView = memo(VehicleDetailsViewComponent);
