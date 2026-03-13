import React from "react";
import { BaseModal } from "@components";
import { DollarSign } from "lucide-react"; // Using DollarSign icon for pricing

export const PricingDetailModal = ({ isOpen, onClose, pricing }) => {
//   if (!isOpen || !pricing) return "No Data";

  const getDisplayValue = (value, defaultValue = 'N/A') => {
    // Handle null/undefined/empty string gracefully
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    // Basic formatting for numbers (optional, adjust as needed)
    if (typeof value === 'number') {
        return value.toFixed(2); // Format numbers to 2 decimal places
    }
    return value;
  };

  // Helper to format currency
  const formatCurrency = (value) => `₹${getDisplayValue(value)}`;

  // Helper to format distance
  const formatDistance = (value) => `${getDisplayValue(value)} km`;

  // Helper to format percentage
  const formatPercentage = (value) => `${getDisplayValue(value * 100)}%`;

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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1 textPrimary">
          <DollarSign className="text-icon" />
          Pricing Details for {getDisplayValue(pricing?.vehicleType)}
        </div>
      </div>

      {/* Body */}
      <div className="text-sm space-y-4 textSecondary">
        <Section title="" content={[
          `Vehicle Type: ${getDisplayValue(pricing?.vehicleType)}`,
          `KM Rate: ${formatCurrency(pricing?.kmRate)}`,
          `Minimum KMs: ${formatDistance(pricing?.minimumKms)}`,
          `Driver Charge: ${formatCurrency(pricing?.driverCharge)}`,
          `Driver Max KMs: ${formatDistance(pricing?.driverMaxKms)}`,
          `Waiting Charges: ${formatCurrency(pricing?.waitingCharges)}`,
          `Pet Charges: ${formatCurrency(pricing?.petCharges)}`,
          `Discount: ${formatPercentage(pricing?.discount)}`,
          `Time Addon: ${getDisplayValue(pricing?.timeAddon)}`, // Assuming HH:MM:SS format
          `KMs Addon: ${formatDistance(pricing?.kmsAddon)}`,
        ]} />
      </div>
    </BaseModal>
  );
};

// Optional helper component to keep layout cleaner
const Section = ({ title, content }) => (
  <div className="mb-2">
    <strong className="textPrimary text-icon  ">{title}</strong>
    <div className="ml-3 mt-1 space-y-1"> {/* Added mt-1 and space-y-1 for spacing */}
      {content.map((item, idx) => (
        item && <div key={idx}>{item}</div>
      ))}
    </div>
  </div>
);