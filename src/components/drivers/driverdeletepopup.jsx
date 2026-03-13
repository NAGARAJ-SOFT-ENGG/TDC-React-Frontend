import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { BaseModal, Button, InputField, ButtonLight } from "@components";
import { deleteDriverPermanently, updateDriverActiveStatus } from "@services"; // Using new services
import { DriverDeleteModel, DriverActivationUpdateModel } from "@models"; // Import models
import Select from "react-select";
import { toast } from "react-toastify";

// Consider renaming the file to DriverActionsModal.jsx or similar
export const DriverActionsModal = ({
  isOpen,
  onClose,
  driver,
  operatorMobile,
  onConfirmDelete, // Callback for successful deletion
  onStatusUpdateSuccess, // Callback for successful status update
  currentActiveFlag, // Current active_flag (e.g., 1 for active, 2 for suspended)
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  // State for Delete action
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  // State for Status Update action
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusNotes, setStatusNotes] = useState("");

  // Define status options (adjust values if your API uses something other than 1 for active, 2 for suspended)
  const statusOptions = [
    { value: 1, label: "Active" },
    { value: 2, label: "Suspend" },
    // Add other statuses if applicable, e.g., { value: 0, label: "Pending Verification" }
  ];
  const currentStatusLabel = statusOptions.find(opt => opt.value === currentActiveFlag)?.label || "Unknown";

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
      setDeleteConfirmationText("");
      setStatusNotes("");

      // Pre-select the status for update (e.g., the one it's NOT currently)
      if (currentActiveFlag !== undefined) {
        // Assuming 1 is Active, 2 is Suspended. Adjust if your API uses different values.
        const targetStatusValue = currentActiveFlag === 1 ? 2 : 1;
        const targetStatus = statusOptions.find(option => option.value === targetStatusValue);
        setSelectedStatus(targetStatus || null);
      } else {
        setSelectedStatus(null);
      }
    }
  }, [isOpen, currentActiveFlag]);

  if (!driver) return null;

  const handleDeleteSubmit = async () => {
    if (!driver?.driver_mobile || !operatorMobile) {
      setErrorMessage("Driver information or operator mobile is missing for deletion.");
      return;
    }
    if (deleteConfirmationText.trim().toLowerCase() !== "confirm") {
      setErrorMessage(`Please type "CONFIRM" to confirm deletion.`);
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    const modelInstance = new DriverDeleteModel(operatorMobile, driver.driver_mobile);
    const payload = modelInstance.toPayload();

    try {
      await deleteDriverPermanently(payload);
      toast.success(`Driver ${driver.driver_name || driver.driver_mobile} deleted successfully.`);
      if (onConfirmDelete) onConfirmDelete(driver.driver_mobile);
      onClose();
    } catch (error) {
      console.error("Failed to delete driver:", error);
      setErrorMessage(error.response?.data?.message || error.message || "Failed to delete driver.");
      toast.error(error.response?.data?.message || "Failed to delete driver.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdateSubmit = async () => {
    if (!driver?.driver_mobile || !operatorMobile || !selectedStatus) {
      setErrorMessage("Driver information, operator mobile, or new status is missing.");
      return;
    }
    if (!statusNotes.trim()) {
      setErrorMessage("Notes are required for status update.");
      return;
    }

    setIsUpdatingStatus(true);
    setErrorMessage("");

    const modelInstance = new DriverActivationUpdateModel(
      driver.driver_mobile,
      operatorMobile,
      selectedStatus.value,
      statusNotes
    );
    const payload = modelInstance.toPayload();

    try {
      await updateDriverActiveStatus(payload);
      toast.success(`Driver status updated to ${selectedStatus.label}.`);
      if (onStatusUpdateSuccess) onStatusUpdateSuccess(driver.driver_mobile, selectedStatus.value, statusNotes);
      onClose();
    } catch (error) {
      console.error("Failed to update driver status:", error);
      setErrorMessage(error.response?.data?.message || error.message || "Failed to update status.");
      toast.error(error.response?.data?.message || "Failed to update driver status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const statusUpdateButtonText = selectedStatus?.value === 1 ? "Activate Driver" : "Suspend Driver";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Manage Driver: {driver?.driver_name || driver?.driver_mobile}
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
          <h4 className="text-md font-medium text-gray-700">Update Driver Status</h4>
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
            name="statusNotes"
            placeholder="Enter notes (required)"
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-3">
            <ButtonLight onClick={onClose} variant="outline" disabled={isDeleting || isUpdatingStatus}>
              Cancel
            </ButtonLight>
            <Button
              onClick={handleStatusUpdateSubmit}
              disabled={isDeleting || isUpdatingStatus || !selectedStatus || !statusNotes.trim()}
            >
              {isUpdatingStatus ? "Updating..." : statusUpdateButtonText}
            </Button>
          </div>
        </div>

        {/* Delete Section */}
        <div className="space-y-4 border-b pb-6 mb-6">
          <h4 className="text-md font-medium text-gray-700">Delete Driver</h4>
          <p className="text-sm textSecondary">
            To permanently delete driver <strong className="text-textPrimary">{driver?.driver_name || driver?.driver_mobile}</strong>, type "CONFIRM" below. This action cannot be undone.
          </p>
          <InputField
            label={`Type "CONFIRM" to delete`}
            placeholder="CONFIRM"
            value={deleteConfirmationText}
            onChange={(e) => setDeleteConfirmationText(e.target.value)}
          />
          <div className="flex justify-end space-x-3">
            <ButtonLight onClick={onClose} variant="outline" disabled={isDeleting || isUpdatingStatus}>
              Cancel
            </ButtonLight>
            <Button
              onClick={handleDeleteSubmit}
              disabled={isDeleting || isUpdatingStatus || deleteConfirmationText.trim().toLowerCase() !== "confirm"}
              variant="danger"
            >
              {isDeleting ? "Deleting..." : "Delete Driver"}
            </Button>
          </div>
        </div>


      </div>
    </BaseModal>
  );
};
