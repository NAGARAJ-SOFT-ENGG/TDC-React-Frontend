import React, { useState, useEffect } from "react";
import { BaseModal, InputField, Button, LogoSpinner } from "@components";
import Select from "react-select";
import { toast } from "react-toastify";
import { updateCustomerStatus } from "@services"; // We'll create this service

export const CustomerStatusModal = ({ isOpen, onClose, customer, onStatusUpdateSuccess }) => {
  const statusOptions = [
    { value: 1, label: "Activate" },
    { value: 2, label: "Suspend" },
        { value: 0, label: "Delete" }, // Updated value for Suspend
  ];

  const [selectedStatusOption, setSelectedStatusOption] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && customer) {
      // Pre-fill status based on customer's current active_flag
      // Assuming customer object has an 'active_flag' property
      const currentStatus = statusOptions.find(opt => opt.value === customer.active_flag);
      setSelectedStatusOption(currentStatus || null);
      setRemarks(""); // Reset remarks
      setError(null); // Reset error
    }
  }, [isOpen, customer]);

  const handleSubmit = async () => {
    if (!selectedStatusOption) {
      toast.error("Please select a status.");
      return;
    }
    if (!customer || !customer.customer_mobile || !customer.operator_mobile) {
      toast.error("Customer details are missing.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        operator_mobile: customer.operator_mobile,
        customer_mobile: customer.customer_mobile,
        active_flag: selectedStatusOption.value,
        remarks: remarks,
      };
      await updateCustomerStatus(payload);
      toast.success(`Customer ${customer.customer_name} status updated to ${selectedStatusOption.label}.`);
      if (onStatusUpdateSuccess) {
        onStatusUpdateSuccess();
      }
      onClose();
    } catch (err) {
      console.error("Error updating customer status:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update status.";
      setError(errorMessage);
      toast.error(errorMessage);
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
        Update Customer Status for{" "}
        <span className="text-icon">{customer?.customer_name || "N/A"}</span>
      </div>

      {/* Body */}
      <div className="space-y-4 textSecondary text-sm">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {/* Status Dropdown */}
        <Select
          options={statusOptions}
          value={selectedStatusOption}
          onChange={setSelectedStatusOption}
          isDisabled={isLoading}
          placeholder="Select Customer Status"
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

        {/* Remarks Field */}
        <InputField
          label="Remarks"
          placeholder="Remarks"
          textarea
          rows={3}
          className="resize-none"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          disabled={isLoading}
        />

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <LogoSpinner size="w-5 h-5" /> : "Submit"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
