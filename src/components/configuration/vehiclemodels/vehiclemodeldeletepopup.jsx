import React from 'react';
import { BaseModal, Button, ButtonLight } from '@components';

export const VehicleModelDeletePopup = ({ isOpen, onClose, onConfirm, vehicleModelName }) => {
    if (!isOpen) return null;

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} dialogSize="sm">
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
                Confirm Deletion
            </div>

            {/* Body */}
            <div className="space-y-3 text-secondary text-sm">
                <p>
                    Are you sure you want to delete the vehicle model <span className="font-semibold text-icon">{vehicleModelName}</span>?
                </p>
                <p className="text-md text-icon">
                    Note: Once deleted, this vehicle model might not be easily recoverable or re-added with the same historical context. Associated vehicles might also be affected.
                </p>
            </div>

            {/* Footer with Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
                <ButtonLight variant="outline" onClick={onClose}>
                    Cancel
                </ButtonLight>
                <Button
                    variant="danger"
                    onClick={onConfirm}
                >
                    Delete
                </Button>
            </div>
        </BaseModal>
    );
};