import React, { useState, useEffect } from "react";
import { FaPhone, FaEnvelope, FaUser } from "react-icons/fa";
import { BaseModal } from "@components";
import { fetchCustomerProfile } from "@services"; // Import the service

export const CustomerDetailModal = ({ customerMobile, isOpen, onClose }) => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDisplay = (val, fallback = "N/A") =>
    val !== undefined && val !== null && val !== "" ? val : fallback;

  useEffect(() => {
    if (isOpen && customerMobile) {
      const loadProfile = async () => {
        setIsLoading(true);
        setError(null);
        setProfileData(null); // Clear previous data
        try {
          const response = await fetchCustomerProfile(customerMobile);
          if (response && response.customer) {
            setProfileData(response.customer);
          } else {
            setError("Customer profile not found or invalid response.");
            console.warn("Customer profile fetch warning:", response);
          }
        } catch (err) {
          setError(err.message || "Failed to fetch customer profile.");
          console.error("Error fetching customer profile:", err);
        } finally {
          setIsLoading(false);
        }
      };
      loadProfile();
    }
  }, [isOpen, customerMobile]);


  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {isLoading && <div className="p-6 text-center">Loading customer details...</div>}
      {error && <div className="p-6 text-center text-red-500">Error: {error}</div>}
      {!isLoading && !error && profileData && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2 textPrimary">
              <FaUser className="text-icon" />
              {getDisplay(profileData.customer_name)}
            </div>
            <button onClick={onClose} className="text-grey-600 text-xl font-bold">
              ×
            </button>
          </div>

          {/* Body */}
          <div className="text-sm space-y-3 textSecondary">
            <Section title="Contact Info" content={[
              `Mobile: ${getDisplay(profileData.customer_mobile)}`,
              `Email: ${getDisplay(profileData.customer_email)}`,
              `Operator Mobile: ${getDisplay(profileData.operator_mobile)}`
            ]} />

            <hr />

            <Section title="Address Info" content={[
              `Address: ${getDisplay(profileData.primary_address)}`,
              `City: ${getDisplay(profileData.city)}`,
              `State: ${getDisplay(profileData.state)}`,
              `Country: ${getDisplay(profileData.country)}`,
              `Pincode: ${getDisplay(profileData.pincode)}`
            ]} />

            <hr />

            <Section title="Profile Info" content={[
              `Gender: ${getDisplay(profileData.gender)}`,
              `Role: ${getDisplay(profileData.role_name)}`,
              `Channel: ${getDisplay(profileData.channel)}`,
              `Base Location: ${getDisplay(profileData.base_gps_loc)}`
            ]} />

            <hr />

            <Section title="Loyalty" content={[
              `Total Trips: ${getDisplay(profileData.total_trips)}`,
              `Revenue: ₹${getDisplay(profileData.revenue, 0).toLocaleString()}`
            ]} />
          </div>
        </>
      )}
      {!isLoading && !error && !profileData && isOpen && (
        <div className="p-6 text-center">No profile data to display.</div>
      )}
    </BaseModal>
  );
};

const Section = ({ title, content }) => (
  <div>
    <strong className=" textPrimary text-icon font-bold mb-2">{title}</strong>
    {content.map((item, idx) => (
      <div key={idx} className="ml-3">{item}</div>
    ))}
  </div>
);