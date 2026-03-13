import React, { useState, useEffect } from "react";
import { BaseModal } from "@components";
import Select from "react-select";
import { InputField, Button } from "@components";
import { updateVehicleStatus } from "@services"; // Import the service

export const VehicleStatusModal = ({ vehicle, isOpen, onClose, operatorMobile, onUpdateSuccess }) => {
  const [statusOption, setStatusOption] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const statusOptions = [
    { value: 1, label: "Activate" },
    { value: 2, label: "Suspend" },
  ];

  useEffect(() => {
    if (vehicle && vehicle.active_flag !== undefined) {
      const currentStatus = statusOptions.find(option => option.value === vehicle.active_flag);
      setStatusOption(currentStatus || null);
      setRemarks(vehicle.notes || ""); // Pre-fill remarks if available
    } else {
      setStatusOption(null); // Reset if no vehicle or active_flag
      setRemarks("");
    }
  }, [vehicle]); // Rerun when the vehicle prop changes



  if (!vehicle) return null;

  const handleSubmit = async () => {
    if (!statusOption) {
      setErrorMessage("Please select a status.");
      return;
    }
    if (!operatorMobile) {
        setErrorMessage("Operator mobile not available.");
        console.error("OperatorMobile is missing in VehicleStatusModal");
        return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      vehicle_number: vehicle.vehicle_number,
      operator_mobile: operatorMobile,
      active_flag: statusOption.value,
      notes: remarks,
    };

    try {
      await updateVehicleStatus(payload);
      if (onUpdateSuccess) onUpdateSuccess(); // Notify parent
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Failed to update vehicle status:", error);
      setErrorMessage(error.message || "Failed to update status. Please try again.");
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
      <div className="textPrimary mb-4">
        Update Vehicle Status for <span className="text-icon">{vehicle.vehicle_number}</span>
      </div>

      {/* Body */}
      <div className="space-y-4 textSecondary text-sm">
        {errorMessage && (
          <div className="p-2 mb-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {errorMessage}
          </div>
        )}
        <Select
          options={statusOptions}
          placeholder="Select Vehicle Status"
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
        />

        <InputField
          label="Remarks"
          placeholder="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          textarea
          rows={3}
          className="resize-none"
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
