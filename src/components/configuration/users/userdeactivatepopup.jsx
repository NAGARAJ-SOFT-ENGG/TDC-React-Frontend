import React from 'react';
import { BaseModal, Button, ButtonLight } from '@components';

export const UserDeactivatePopup = ({ isOpen, onClose, onConfirm, userName }) => {
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
                Confirm Deactivation
            </div>

            {/* Body */}
            <div className="space-y-3 text-secondary text-sm">
                <p>
                    Are you sure you want to deactivate the user <span className="font-semibold text-icon">{userName}</span>?
                </p>
                <p className="text-md text-icon">
                    Note: Deactivating the user will prevent them from logging in. Their data will be retained.
                </p>
            </div>

            {/* Footer with Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
                <ButtonLight variant="outline" onClick={onClose}>
                    Cancel
                </ButtonLight>
                <Button variant="danger" onClick={onConfirm}>
                    Deactivate
                </Button>
            </div>
        </BaseModal>
    );
};