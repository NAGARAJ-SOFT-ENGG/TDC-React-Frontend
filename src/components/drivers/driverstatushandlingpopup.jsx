// import React, { useState } from "react";
// import { BaseModal, InputField, Button } from "@components";

// export const DriverStatusHandlingModal = ({ isOpen, onClose, onSubmit, isActive }) => {
//   const [reason, setReason] = useState("");

//   const handleSubmit = () => {
//      if (!reason.trim()) {
//     alert("Reason is required.");
//     return;
//   }
//     onSubmit(reason);
//     setReason("");
//     onClose();
//   };

//   return (
//     <BaseModal isOpen={isOpen} onClose={onClose}>
//       <div className="space-y-4 p-4">
//         <h2 className="textPrimary text-center">
//           {isActive ? "Deactivate Driver" : "Activate Driver"}
//         </h2>
//         <InputField
//           label="Reason"
//           placeholder="Enter reason"
//           value={reason}
//           onChange={(e) => setReason(e.target.value)}
//         />
//         <div className="flex justify-center">
//           <Button
//             onClick={handleSubmit}
//             className=" px-4 py-2 "
//           >
//             {isActive ? "Deactivate" : "Activate"}
//           </Button>
//         </div>
//       </div>
//     </BaseModal>
//   );
// };
