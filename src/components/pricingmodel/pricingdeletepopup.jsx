import React from 'react';
import { BaseModal, Button, ButtonLight } from '@components'; // Assuming you have a BaseModal and Button component

export const PricingDeletePopup = ({ isOpen, onClose, onConfirm, vehicleType }) => {
    if (!isOpen) return null;

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} dialogSize="sm"> {/* Adjust dialogSize as needed */}
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-3 right-4 text-gray-600 hover:text-gray-800 text-xl font-bold"
                aria-label="Close modal"
            >
                &times;
            </button>

            {/* Header */}
            <div className="text-icon text-lg font-semibold mb-4">
                Confirm Suspension
            </div>

            {/* Body */}
            <div className="space-y-3 text-secondary text-sm">
                <p>
                    Are you sure you want to delete the pricing for <span className="font-semibold text-icon">{vehicleType}</span>?
                </p>
                <p className="text-md text-icon">
                    Note: Once Suspended, this specific pricing configuration might not be easily recoverable or re-added with the same historical context.
                </p>
            </div>

            {/* Footer with Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
                <ButtonLight variant="outline" onClick={onClose}>
                    Cancel
                </ButtonLight>
                <Button
                    variant="danger" // Assuming you have a danger variant for delete buttons
                    onClick={onConfirm}
                >
                    Suspend
                </Button>
            </div>
        </BaseModal>
    );
};