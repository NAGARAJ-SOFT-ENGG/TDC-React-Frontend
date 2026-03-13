import React, { useState, useEffect } from "react";
import { BaseModal } from "@components";
import Select from "react-select";
import { InputField, Button } from "@components";
import { updateDriverVerificationStatus } from "@services"; // Use the new specific service
import { toast } from "react-toastify"; // Assuming you use react-toastify
import { DriverVerificationUpdateModel } from "@models"; // Import the new model

export const DriverVerificationStatusModal = ({
  driver,
  operatorMobile,
  isOpen,
  onClose,
  onUpdateSuccess,
}) => {
  const [statusOption, setStatusOption] = useState(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    // { value: "pending", label: "Pending" },
    { value: "profile_verified", label: "Profile Verified" },
    { value: "document_verified", label: "Document Verified" },
    // { value: "rejected", label: "Rejected" },
  ];

  useEffect(() => {
    if (driver && isOpen) {
      const currentStatus = statusOptions.find(
        (option) => option.value === driver.verification_status
      );
      setStatusOption(currentStatus || null);
      setNotes(driver.notes || "");
    } else if (!isOpen) {
      // Reset form when modal is closed
      setStatusOption(null);
      setNotes("");
    }
  }, [driver, isOpen]);

  if (!driver) return null;

  const handleSubmit = async () => {
    if (!statusOption) {
      toast.info("Please select a status.");
      return;
    }

    if (!notes.trim()) {
      toast.info("Notes are required.");
      return;
    }

    setIsLoading(true);

    let active_flag;

    if (statusOption.value === "profile_verified") {
      active_flag = 3;
    } else if (statusOption.value === "document_verified") {
      active_flag = 1;
    }

    const modelInstance = new DriverVerificationUpdateModel(
      driver.driver_mobile,
      operatorMobile,
      statusOption.value,
      notes,
      active_flag
    );
    const payload = modelInstance.toPayload();

    try {
      const response = await updateDriverVerificationStatus(payload); // Call the new service
      toast.success(
        response?.message || "Driver verification status updated successfully!"
      );
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Failed to update driver verification status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update status."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-grey-600 text-xl font-bold"
        aria-label="Close modal"
      >
        ×
      </button>
      <div className="textPrimary mb-4">
        Update Verification Status for <span className="text-icon">{driver.driver_name}</span>
      </div>

      {/* Body */}
      <div className="space-y-4 textSecondary">
        <Select
          options={statusOptions}
          placeholder="Select Driver Status"
          value={statusOption}
          onChange={setStatusOption}
          className="text-textSecondary"
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
          label="Notes"
          placeholder="Add notes here"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          textarea
          rows={3}
          className="resize-none"
        />

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSubmit}
            className=" px-4 py-2"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Submit
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
