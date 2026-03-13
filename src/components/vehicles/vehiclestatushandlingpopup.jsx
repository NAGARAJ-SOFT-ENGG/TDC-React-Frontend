import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { BaseModal, Button, InputField } from "@components";
import { deleteVehicle, updateVehicleActiveStatus } from "@services"; // Import both services
import Select from "react-select"; // Import Select for status dropdown
import { toast } from "react-toastify"; // Import toast for feedback

export const VehicleStatusHandlingModal = ({
  isOpen,
  onClose,
  vehicle,
  operatorMobile,
  onConfirmDelete, // Callback for successful deletion
  onStatusUpdateSuccess, // Callback for successful status update
  currentActiveFlag, // Changed: Current active_flag (number, e.g., 1 for Active, 2 for Suspend)
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  // State for Delete action
  const [confirmationText, setConfirmationText] = useState("");
  // State for Status Update action
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [notes, setNotes] = useState("");

  // Options for the status dropdown
  const statusOptions = [
    { value: 1, label: "Active" },
    { value: 2, label: "Suspend" },
  ];

  // Reset state when modal opens or actionType changes
  // And pre-select the opposite status for update
  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
      setConfirmationText(""); // Reset delete confirmation
      setNotes(""); // Reset notes for status update

      // Pre-select the status for update (e.g., the one it's NOT currently)
      // currentActiveFlag is a number (e.g., 1 or 2)
      if (currentActiveFlag !== undefined) {
        // Determine the value to pre-select (the opposite of the current flag)
        const targetValue = currentActiveFlag === 1 ? 2 : 1;
        const targetStatus = statusOptions.find(option => option.value === targetValue);
        setSelectedStatus(targetStatus || null);
      }
    }
  }, [isOpen, currentActiveFlag]);

  const handleDeleteSubmit = async () => {
    if (!vehicle || !vehicle.vehicle_number || !operatorMobile) {
      setErrorMessage("Vehicle information or operator mobile is missing for deletion.");
      return;
    }
    if (confirmationText.trim().toLowerCase() !== "confirm") {
      setErrorMessage(`Please type "CONFIRM" to confirm deletion.`);
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");
    try {
      await deleteVehicle(operatorMobile, vehicle.vehicle_number);
      toast.success(`Vehicle ${vehicle.vehicle_number} deleted successfully.`);
      if (onConfirmDelete) onConfirmDelete(vehicle.vehicle_number); // Pass identifier
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      setErrorMessage(error.response?.data?.message || error.message || "Failed to delete vehicle.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdateSubmit = async () => {
    if (!vehicle || !vehicle.vehicle_number || !operatorMobile || !selectedStatus) {
      setErrorMessage("Vehicle information, operator mobile, or new status is missing.");
      return;
    }
    if (!notes.trim()) {
      setErrorMessage("Notes are required for status update.");
      return;
    }

    setIsUpdatingStatus(true);
    setErrorMessage("");
    const payload = {
      vehicle_number: vehicle.vehicle_number,
      operator_mobile: operatorMobile,
      active_flag: selectedStatus.value,
      notes: notes,
    };
    try {
      await updateVehicleActiveStatus(payload);
      toast.success(`Vehicle status updated to ${selectedStatus.label}.`);
      if (onStatusUpdateSuccess) onStatusUpdateSuccess(vehicle.vehicle_number, selectedStatus.value, notes); // Pass details
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Failed to update vehicle status:", error);
      setErrorMessage(error.response?.data?.message || error.message || "Failed to update status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const currentStatusLabel = statusOptions.find(opt => opt.value === currentActiveFlag)?.label || "N/A";
  const statusUpdateButtonText = selectedStatus?.value === 1 ? "Activate" : "Suspend";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Manage Vehicle: {vehicle?.vehicle_number}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5 text-gray-600 hover:text-black" />
          </button>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm text-center py-2">{errorMessage}</p>
        )}

                {/* Status Update Section */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-700">Update Vehicle Status</h4>
          <p className="text-sm textSecondary">
            Current status: <strong className="text-textPrimary">{currentStatusLabel}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Select new status"
              classNamePrefix="react-select"
              menuPortalTarget={typeof window !== "undefined" ? document.body : null}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
          <InputField
            label="Notes for Status Change"
            name="notes"
            placeholder="Enter notes (required)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-3">
            <Button onClick={onClose} variant="outline" disabled={isDeleting || isUpdatingStatus}>
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdateSubmit}
              disabled={isDeleting || isUpdatingStatus || !selectedStatus || !notes.trim()}
            >
              {isUpdatingStatus ? "Updating..." : statusUpdateButtonText}
            </Button>
          </div>
        </div>
        
        {/* Delete Section */}
        <div className="space-y-4 border-b pb-6 mb-6">
          <h4 className="text-md font-medium text-gray-700">Delete Vehicle</h4>
          <p className="text-sm textSecondary">
            To permanently delete vehicle <strong className="text-textPrimary">{vehicle?.vehicle_number}</strong>, type "CONFIRM" below. This action cannot be undone.
          </p>
          <InputField
            label={`Type "CONFIRM" to delete`}
            placeholder="CONFIRM"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
          />
          <div className="flex justify-end space-x-3">
            <Button onClick={onClose} variant="outline" disabled={isDeleting || isUpdatingStatus}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSubmit}
              disabled={isDeleting || isUpdatingStatus || confirmationText.trim().toLowerCase() !== "confirm"}
              variant="danger" // Assuming you have a danger variant for delete
            >
              {isDeleting ? "Deleting..." : "Delete Vehicle"}
            </Button>
          </div>
        </div>


      </div>
    </BaseModal>
  );
};
