import React from "react";
import { FaPhone, FaEnvelope, FaUser } from "react-icons/fa";
import { BaseModal } from "@components";

export const DriverDetailModal = ({ driver, isOpen, onClose }) => {
  if (!driver) return null;

  const getDisplayValue = (value, defaultValue = 'N/A') => value || defaultValue;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2 textPrimary">
          <FaUser className="text-icon" />
          {getDisplayValue(driver.driver_name)}
        </div>
        <button
          onClick={onClose}
          className="text-grey-600 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="text-sm space-y-3 textSecondary">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FaPhone className="text-icon" />
            {getDisplayValue(driver.driver_mobile)}
          </div>
          <div className="flex items-center gap-2 ">
            <FaEnvelope className="text-icon" />
            {getDisplayValue(driver.driver_email)}
          </div>
        </div>

        <hr />

        <Section title="Address" content={[
          `Address: ${getDisplayValue(driver.driver_address)}`,
          `City: ${getDisplayValue(driver.driver_city)}`,
          `State: ${getDisplayValue(driver.driver_state)}`,
          `Pincode: ${getDisplayValue(driver.driver_pincode)}`,
          `Country: ${getDisplayValue(driver.driver_country)}`,
        ]} />

        <hr />

        <Section title="Vehicle Details" content={[
          `Assigned: ${getDisplayValue(driver.vehicle_assigned)}`,
          `Model: ${getDisplayValue(driver.vehicle_model)}`,
          `Type: ${getDisplayValue(driver.vehicle_type)}`,
          `Seating Capacity: ${getDisplayValue(driver.vehicle_seating_capacity)}`,
        ]} />

        <hr />

        <Section title="Driving License" content={[
          `Number: ${getDisplayValue(driver.driving_license_number)}`,
          `Type: ${getDisplayValue(driver.license_type)}`,
          `Valid From: ${getDisplayValue(driver.license_valid_from)}`,
          `Valid Upto: ${getDisplayValue(driver.license_valid_upto)}`,
          ...(driver.licence_image ? [`License Image Path: ${driver.licence_image}`] : []),
        ]} />

        <hr />

        <Section title="Identity Documents" content={[
          `Aadhar Number: ${getDisplayValue(driver.aadhar_number)}`,
          ...(driver.aadhar_image ? [`Aadhar Image Path: ${driver.aadhar_image}`] : []),
          `PAN Number: ${getDisplayValue(driver.pan_number)}`,
          ...(driver.pan_image ? [`PAN Image Path: ${driver.pan_image}`] : []),
        ]} />

        <hr />

        {/* <Section title="Performance" content={[
          `Total Trips: ${getDisplayValue(driver.total_trips)}`,
          `Rating: ${getDisplayValue(driver.driver_rating)}`,
          `Revenue: ${getDisplayValue(driver.revenue)}`,
        ]} />
        
        {driver.driver_image && (
          <><hr /><Section title="Profile" content={[`Profile Image Path: ${driver.driver_image}`]} /></>
        )} */}
      </div>
    </BaseModal>
  );
};

// Optional helper component to keep layout cleaner
const Section = ({ title, content }) => (
  <div>
    <strong className="textPrimary text-icon mb-1">{title}</strong>
    <div className="mt-1 space-y-1 ml-3">
      {content.map((item, idx) => {
        if (!item) return null;

        const [label, ...valueParts] = item.split(": ");
        const value = valueParts.join(": "); // Handle colons in value

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

