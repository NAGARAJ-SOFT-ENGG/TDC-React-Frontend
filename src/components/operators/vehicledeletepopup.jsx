import React, { useState } from "react";
import { BaseModal, Button } from "@components";
import { InputField } from "../input";
import { deleteVehicle } from "@services";

export const VehicleDeleteModal = ({ vehicle, isOpen, onClose, onConfirm, operatorMobile }) => {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!vehicle) return null;

  const handleConfirm = async () => {
    if (confirmText !== "CONFIRM" || isLoading || !operatorMobile || !vehicle?.vehicle_number) {
      // Add console warning for debugging if needed
      console.warn("Cannot confirm deletion: Confirmation text mismatch, loading, or missing data.", { confirmText, isLoading, operatorMobile, vehicleNumber: vehicle?.vehicle_number });
      return;
    }

    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      // Call the API service to delete the vehicle
      await deleteVehicle(operatorMobile, vehicle.vehicle_number);

      // If successful, call the parent's onConfirm handler and close the modal
      onConfirm(vehicle);
      onClose();
    } catch (err) {
      console.error("Failed to delete vehicle:", err);
      setError("Failed to delete vehicle. Please try again."); // Set a user-friendly error message
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

      {/* Title */}
      <h2 className="textPrimary mb-4 text-center">Delete Vehicle</h2>

      {/* Description */}
      <p className="textSecondary mb-4 text-center">  
        Type <span className="font-bold text-red-600">CONFIRM</span> to delete{" "}
         <strong>{vehicle.vehicle_number}</strong>.
      </p>

      {/* Input */}
      <InputField
        label="Confirm"
        placeholder="Type CONFIRM"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
      />

 {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
      {/* Action Button */}
      <div className="flex justify-center mt-6">
        <Button
         // Disable if text doesn't match, is loading, or missing required data
          disabled={confirmText !== "CONFIRM" || isLoading || !operatorMobile || !vehicle?.vehicle_number}
          onClick={handleConfirm}
          // Add loading state styling if needed
          className={`${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Proceed
        </Button>
      </div>
    </BaseModal>
  );
};
