import React, { useState, useEffect } from "react";
import { BaseModal } from "@components";
import Select from "react-select";
import { InputField, Button } from "@components";
import { updateVehicleVerificationStatus } from "@services"; // Changed service import

const STATUS_OPTIONS = [
  // Define your vehicle verification statuses here
  // These values should match what your backend expects for "verification_status"
  // { value: "pending", label: "Pending" },
  { value: "profileVerified", label: "Profile Verified" },
  { value: "documentsVerified", label: "Documents Verified" },
  // { value: "rc_verified", label: "RC Verified" },
  // { value: "insurance_verified", label: "Insurance Verified" },
  // { value: "fc_verified", label: "FC Verified" },
  // { value: "rejected", label: "Rejected" },
];
export const VehicleStatusModal = ({
  vehicle,
  isOpen,
  onClose,
  operatorMobile, // Added prop
  onUpdateSuccess, // Added prop
}) => {
  const [statusOption, setStatusOption] = useState(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen && vehicle) {
      // Assuming vehicle object has a 'verification_status' property
      console.log("[VehicleStatusModal] useEffect - vehicle.verification_status:", vehicle.verification_status);
      const currentStatus = STATUS_OPTIONS.find(
        (option) => option.value === vehicle.verification_status
      );
      console.log("[VehicleStatusModal] useEffect - currentStatus found:", currentStatus);
      setStatusOption(currentStatus || null);
      // If notes are specific to verification status, you might want to clear them
      // or fetch them if they are stored with verification_status
      setNotes(vehicle.verification_notes || vehicle.notes || ""); // Prioritize verification_notes if available
      setErrorMessage(""); // Clear previous errors when modal opens
    } else if (!isOpen) {
      // Reset state when modal is closed
      setStatusOption(null);
      setNotes("");
      setIsLoading(false);
      setErrorMessage("");
    }
  }, [isOpen, vehicle]);

  if (!vehicle) return null;

  const handleSubmit = async () => {
    if (!statusOption) {
      setErrorMessage("Please select a status.");
      return;
    }
    if (!operatorMobile) {
      setErrorMessage("Operator mobile not available.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      vehicle_number: vehicle.vehicle_number, // Assuming vehicle object has vehicle_number
      operator_mobile: operatorMobile,
      verification_status: statusOption.value, // Changed from active_flag
      notes: notes,
    };

    try {
      await updateVehicleVerificationStatus(payload); // Call the new service
      if (onUpdateSuccess) onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update vehicle verification status:", error);
      setErrorMessage(
        error.response?.data?.message || error.message || "Failed to update status. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-grey-600 text-xl font-bold"
        aria-label="Close modal"
      >
        ×
      </button>

      {/* Header */}
      <div className="text-md font-semibold mb-4">
        Update Vehicle Verification Status for <span className="text-icon">{vehicle.vehicle_number}</span>
      </div>

      {/* Body */}
      <div className="space-y-4 font-secondary text-sm">
        {/* Error message display removed as per request (toast notifications will be used) */}
        {/* errorMessage && (
          <div className="p-2 mb-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {errorMessage}
          </div>
        ) */}
        <Select
          options={STATUS_OPTIONS}
          placeholder="Select Verification Status"
          value={statusOption}
          onChange={setStatusOption}
          className="text-sm"
          classNamePrefix="react-select"
          menuPortalTarget={typeof window !== "undefined" ? document.body : null}
          menuPosition="fixed"
          styles={{
            container: (base) => ({ ...base, width: "100%" }),
            control: (base) => ({ ...base, width: "100%" }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          isDisabled={isLoading}
        />

       <InputField
  label="Notes"
  placeholder="Add notes here"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
  textarea
  rows={3}
  className="resize-none"
  disabled={isLoading}
/>

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSubmit}
            className=""   
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
