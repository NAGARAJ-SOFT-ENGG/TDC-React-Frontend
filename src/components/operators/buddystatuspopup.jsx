import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { BaseModal, Button } from "@components";
import { updateBuddyLink } from "@services"; // Import the new service

const STATUS_OPTIONS = [
  { value: 1, label: "Link" },    // active_flag: 1
  { value: 0, label: "Unlink" }, // active_flag: 0
];

export const BuddyStatusModal = ({
  isOpen,
  onClose,
  buddy,
  onUpdate,
  maxPriority,
  currentOperatorMobile, // Mobile of the operator performing the action
  currentOperatorName,   // Name of the operator performing the action
}) => {
  const priorityOptions = useMemo(() =>
    Array.from({ length: maxPriority }, (_, i) => ({
      value: i + 1,
      label: `${i + 1}`,
    })), [maxPriority]);

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (buddy) {
        const currentStatus = STATUS_OPTIONS.find(opt => opt.value === buddy.active_flag);
      setSelectedStatus(currentStatus || STATUS_OPTIONS.find(opt => opt.value === 1)); // Default to "Link" if undefined

      const currentPriority = priorityOptions.find(opt => opt.value === buddy.buddy_operator_priority);
      setSelectedPriority(currentPriority || (priorityOptions.length > 0 ? priorityOptions[0] : null));
    } else {
      setSelectedStatus(STATUS_OPTIONS.find(opt => opt.value === 1));
      setSelectedPriority(priorityOptions.length > 0 ? priorityOptions[0] : null);
    }
   }, [buddy, priorityOptions]); // statusOptions is now stable, so it can be removed from deps if defined outside

 const handleSubmit = async () => {
    if (!selectedStatus || !selectedPriority || !currentOperatorMobile || !buddy?.operator_mobile) {
      setErrorMessage("Missing required information to update buddy link.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      buddy_priority: selectedPriority.value,
      operator_mobile: currentOperatorMobile,
      operator_name: currentOperatorName, // Include operator_name in payload
      buddy_mobile: buddy.operator_mobile, // This is the buddy's mobile number
      active_flag: selectedStatus.value,
    };

    try {
      await updateBuddyLink(payload);
      onUpdate(payload); // Notify parent with the payload or a refetched buddy object
      onClose();
    } catch (error) {
      console.error("Failed to update buddy link:", error);
      setErrorMessage(error.message || "Could not update buddy link. Please try again.");
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

      <h2 className="textPrimary mb-2 text-center">Update Buddy</h2>

      <div className="mb-4">
          {errorMessage && (
          <p className="text-red-500 text-xs text-center mb-2">{errorMessage}</p>
        )}
        <label className="block textPrimary mb-1">Status</label>
        <Select
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={STATUS_OPTIONS}
          className="react-select-container textSecondary"
          classNamePrefix="react-select"
          isDisabled={isLoading}
        />
      </div>

      <div className="mb-6">
        <label className="block textPrimary mb-1">Priority</label>
        <Select
          value={selectedPriority}
          onChange={setSelectedPriority}
          options={priorityOptions}
          className="react-select-container textSecondary"
          classNamePrefix="react-select"
          menuPortalTarget={typeof window !== "undefined" ? document.body : null} // Render menu in body
          menuPosition="fixed" // Ensures consistent positioning
          styles={{ // Optional: ensure z-index is high enough for the portal
            menuPortal: (base) => ({ ...base, zIndex: 9999 })
          }}
          isDisabled={isLoading}
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          className="px-4 py-2"
          disabled={isLoading}
        > {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </BaseModal>
  );
};
