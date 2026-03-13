import React, { useState } from "react";
import { BaseModal, InputField, Button } from "@components";
import {toast} from 'react-toastify'

export const OperatorStatusHandlingModal = ({ isOpen, onClose, onSubmit, isActive }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
     if (!reason.trim()) {
    toast.info("Reason is required.");
    return;
  }
    onSubmit(reason);
    setReason("");
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 p-4">
        <h2 className="textPrimary text-center">
          {isActive ? "Deactivate Operator" : "Activate Operator"}
        </h2>
        <InputField
          label="Remarks"
          placeholder="Enter Remarks"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className=" px-4 py-2 "
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
