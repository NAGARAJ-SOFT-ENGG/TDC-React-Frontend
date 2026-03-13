import React, { useState, useEffect } from "react";
import { BaseModal } from "@components";
import Select from "react-select";
import { InputField, Button } from "@components";
import {toast} from 'react-toastify'

export const OperatorStatusModal = ({ operator, isOpen, onClose, onSubmit, currentVerificationStatus, isLoading = false }) => {
  const [statusOption, setStatusOption] = useState(null);
  const [initialStatusSet, setInitialStatusSet] = useState(false); // Helper state to prevent re-setting
  const [notes, setNotes] = useState("");

  const statusOptions = [
    { value: "mobile_verified", label: "Mobile Verified" },
    { value: "document_verified", label: "Document Verified" },
  ];

  // Effect to set the initial status when the modal opens or current status changes
  useEffect(() => {
    if (isOpen && currentVerificationStatus !== undefined && !initialStatusSet) {
      // Find the matching option object from the predefined options
      const initialOption = statusOptions.find(
        (option) => option.value === currentVerificationStatus
      );
      if (initialOption) {
        setStatusOption(initialOption);
        setInitialStatusSet(true); // Mark as set
      }
    } else if (!isOpen) {
      setInitialStatusSet(false); // Reset when modal closes
    }
  }, [isOpen, currentVerificationStatus, statusOptions, initialStatusSet]);

  // Conditional rendering should happen after all hooks are called
  if (!operator) return null;

  const handleSubmit = () => {
    if (!statusOption) {
      toast.warn("Please select a verification status.");
      return;
    }

    if (!notes.trim()) {
      toast.warn("Notes are required.");
      return;
    }

    let active_flag;
    if (statusOption.value === "document_verified") {
      active_flag = 1;
    } else if (statusOption.value === "mobile_verified") {
      active_flag = 3;
    }

    // Call the onSubmit prop passed from the parent (OperatorPage)
    // The parent component's onSubmit handler will need to be updated to accept this new active_flag
    onSubmit(statusOption.value, notes, active_flag);
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
        Update Verification Status for <span className="text-primary">{operator?.operator_name || operator?.companyName || 'Selected Operator'}</span>
      </div>

      {/* Body */}
      <div className="space-y-4 textSecondary">
        <Select
          options={statusOptions}
          placeholder="Select Operator Status"
          value={statusOption} // Controlled by state
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
            onClick={handleSubmit} // This now calls the internal handler
            disabled={isLoading} // Disable button while loading
            className=" px-4 py-2"
          >
            Submit
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
