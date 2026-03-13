// import React, { useState } from "react";
// import { BaseModal } from "@components";
// import Select from "react-select";
// import { InputField } from "../input";
// import { updateDriverStatus } from "@services"; // Import the new service

// export const DriverStatusModal = ({ driver, isOpen, onClose, operatorMobile, onStatusUpdated }) => {
//   const [statusOption, setStatusOption] = useState(null);
//   const [remarks, setRemarks] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const statusOptions = [
//     { value: "activate", label: "Activate" },
//     { value: "suspend", label: "Suspend" },
//   ];

//   if (!driver) return null;

//   // Determine initial status option based on driver's active_flag
//   React.useEffect(() => {
//     if (driver) {
//       const initialStatus = statusOptions.find(option =>
//         (option.value === 'activate' && driver.active_flag === 1) ||
//         (option.value === 'suspend' && driver.active_flag === 2)
//       );
//       setStatusOption(initialStatus || null);
//       setRemarks(driver.notes || ""); // Pre-fill remarks if available
//       setError(null); // Clear error when driver changes
//     }
//   }, [driver, isOpen]); // Re-run effect if driver or isOpen changes

//   const handleSubmit = async () => {
//     if (!statusOption || isLoading || !operatorMobile || !driver?.driver_mobile) {
//       console.warn("Cannot submit: Status not selected, already loading, or missing data.");
//       return;
//     }

//     const activeFlag = statusOption.value === 'activate' ? 1 : 2; // Map 'activate' to 1, 'suspend' to 2

//     setIsLoading(true);
//     setError(null);
//     try {
//       // Call the API service
//       const response = await updateDriverStatus(driver.driver_mobile, operatorMobile, activeFlag, remarks);
//       // Call the callback with data from the API response
//       if (onStatusUpdated) {
//         onStatusUpdated(response.driver_mobile, response.active_flag, response.notes);
//       }
//       onClose();
//     } catch (err) {
//       console.error("Failed to update driver status:", err);
//       setError(err.message || "Failed to update status. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <BaseModal isOpen={isOpen} onClose={onClose}>
//       <button
//         onClick={onClose}
//         className="absolute top-3 right-4 text-grey-600 text-xl font-bold"
//         aria-label="Close modal"
//       >
//         ×
//       </button>
//          <div className="texPrimary mb-4">
//         Update Driver Status for <span className="text-primary">{driver.driver_name}</span>
//       </div>

//       <div className="space-y-4 textSecondary text-sm">
//         <div>
//           <Select
//             options={statusOptions}
//             placeholder="Select Status"
//             value={statusOption}
//             onChange={setStatusOption}
//             className="textSecondary"
//             classNamePrefix="react-select"
//             menuPortalTarget={typeof window !== "undefined" ? document.body : null}
//             menuPosition="fixed"
//             styles={{
//               container: (base) => ({ ...base, width: "100%" }),
//               control: (base) => ({ ...base, width: "100%" }),
//               menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//             }}
//           />
//         </div>

//         <div>
//           <InputField
//             label="Remarks"
//             placeholder="Remarks"
//             value={remarks}
//             onChange={(e) => setRemarks(e.target.value)}
//             textarea
//             rows={3}
//             className="resize-none"
//           />
//         </div>

//         {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}

//         <div className="flex justify-center mt-4">
//           <button
//             onClick={handleSubmit} // Use the async handleSubmit function
//             className="bg-primary text-white px-4 py-2 rounded-lg"
//             disabled={!statusOption || isLoading} // Disable if no status selected or loading
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </BaseModal>
//   );
// };
