import React from "react";
import { BaseModal } from "@components";
import { FaCar } from "react-icons/fa";

export const VehicleDetail = ({ isOpen, onClose, vehicle }) => {
  if (!vehicle) return null;

  const getDisplayValue = (value, defaultValue = 'N/A') => value || defaultValue;

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
        <div className="flex items-center gap-2 textPrimary">
          <FaCar className="text-icon" />
          {getDisplayValue(vehicle.vehicle_number)}
        </div>
      </div>

      {/* Body */}
      <div className="text-sm space-y-4 textSecondary">
        <Section title="Basic Information" content={[
          `Model: ${getDisplayValue(vehicle.vehicle_model)}`,
          `Type: ${getDisplayValue(vehicle.vehicle_type)}`,
          `Seating Capacity: ${getDisplayValue(vehicle.vehicle_seating_capacity)}`,
          `Active Permits: ${getDisplayValue(vehicle.active_permits)}`,
          `Registration Number: ${getDisplayValue(vehicle.rc_number)}`,
        ]} />

        <hr />

        <Section title="Driver Information" content={[
          `Name: ${getDisplayValue(vehicle.driver_name)}`,
          `Mobile: ${getDisplayValue(vehicle.driver_mobile)}`,
          // ...(vehicle.driver_image ? [`Image Path: ${getDisplayValue(vehicle.driver_image)}`] : []),
        ]} />

        <hr />

        {/* <Section title="Registration Certificate (RC)" content={[
          `Number: ${getDisplayValue(vehicle.rc_number)}`,
          // ...(vehicle.rc_image ? [`Image Path: ${getDisplayValue(vehicle.rc_image)}`] : []),
        ]} /> */}

        {/* <hr /> */}

        <Section title="Fitness Certificate (FC)" content={[
          `Valid From: ${getDisplayValue(vehicle.fc_valid_from)}`,
          `Valid Upto: ${getDisplayValue(vehicle.fc_valid_upto)}`,
          // ...(vehicle.fc_image ? [`Image Path: ${getDisplayValue(vehicle.fc_image)}`] : []),
        ]} />

        <hr />

        <Section title="Insurance" content={[
          `Valid From: ${getDisplayValue(vehicle.insurance_valid_from)}`,
          `Valid Upto: ${getDisplayValue(vehicle.insurance_valid_upto)}`,
          // ...(vehicle.insurance_image ? [`Image Path: ${getDisplayValue(vehicle.insurance_image)}`] : []),
        ]} />

        <hr />

        <Section title="Performance & Status" content={[
          `Total Trips: ${getDisplayValue(vehicle.total_trips)}`,
          `Rating: ${getDisplayValue(vehicle.vehicle_rating)}`,
          `Verification Status: ${getDisplayValue(vehicle.verification_status)}`,
          `Active Status: ${getDisplayValue(vehicle.active_status)}`,
        ]} />
      </div>
    </BaseModal>
  );
};

// Optional helper component to keep layout cleaner
const Section = ({ title, content }) => (
  <div>
    <strong className="textPrimary text-icon">{title}</strong>
    <div className="mt-1 space-y-1 ml-3">
      {content.map((item, idx) => {
        if (!item) return null;

        const [label, ...valueParts] = item.split(": ");
        const value = valueParts.join(": "); // handle values with colon

        return (
          <div key={idx}>
            <span className="textPrimary">{label}:</span>{" "}
            <span className="textSecondary">{value || 'N/A'}</span>
          </div>
        );
      })}
    </div>
  </div>
);
