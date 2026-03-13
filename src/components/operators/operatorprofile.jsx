import React from "react";
import { FaPhone, FaEnvelope, FaUser } from "react-icons/fa";

export const OperatorProfile = ({ profileData }) => {
  if (!profileData || !profileData.operator || !profileData.summary) {
    return <div className="p-6 text-center textSecondary">Profile data is not available.</div>;
  }

 const { operator, summary } = profileData;

  const stats = [
    { label: "Buddy Count", value: summary.buddy_count || 0 },
    { label: "Driver Count", value: summary.driver_count || 0 },
    { label: "Vehicle Count", value: summary.vehicle_count || 0 },
    { label: "Trip Count", value: summary.trip_count || 0 },
    { label: "Revenue", value: summary.revenue || 0 },
  ];

  return (
    <div className="p-6">
      {/* Top Stats Cards */}
     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-gray-200 rounded-xl text-center w-full py-2 shadow"
          >
            <div className="textSecondary text-black">{item.label}</div>
            <div className="text-black font-bold mt-1">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Contact Info and Address */}
      <div className="flex justify-between border-b mb-2">
        {/* Left Section */}
        <div className="space-y-2 textSecondary">
          <div className="flex items-center textPrimary">
            <FaPhone className="text-icon mr-2" /> {operator.operator_mobile || operator.operator_phone || 'N/A'}
          </div>
          <div className="flex items-center">
           <FaEnvelope className="text-icon mr-2" /> {operator.email_id || 'N/A'}
          </div>
        </div>

        {/* Right Section */}
        <div className="textSecondary">
          <h3 className="textPrimary font-bold text-icon">Address</h3>
          <p>{operator.primary_address || 'N/A'}</p>
          <p>{operator.city || ''}{operator.city && operator.state ? ', ' : ''}{operator.state || ''}</p>
          <p>{operator.country || ''}{operator.country && operator.pincode ? ' - ' : ''}{operator.pincode || ''}</p>
        </div>
      </div>

      {/* Document Info */}
      <div>
        <h3 className="textPrimary font-bold text-icon">Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 textSecondary">
          <div className=" textPrimary">Aadhar Number:</div>
          <div>{operator.aadhar_number || 'N/A'}</div>
          
          <div className=" textPrimary">PAN Number:</div>
          <div>{operator.pan_number || 'N/A'}</div>


          <div className="textPrimary">GST Number:</div>
          <div>{operator.gst_number || 'N/A'}</div>

        </div>
      </div>
    </div>
  );
};
