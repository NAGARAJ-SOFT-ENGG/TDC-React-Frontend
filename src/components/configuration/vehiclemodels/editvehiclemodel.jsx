import React, { useState, useEffect } from 'react';
import { BaseModal, InputField, Button, ButtonLight } from '@components';
import { updateVehicleModelDetails } from '@services'; // Import the new service
import { VehiclemodelModel } from '@/models'; // Import the VehicleModel class

export const EditVehicleModelPopup = ({ isOpen, onClose, selectedRow: initialSelectedRow, onSaveSuccess }) => {
    const [editableModel, setEditableModel] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // These are the field names used in the form and correspond to VehicleModel internal properties
    const formFields = [
        { name: 'make', label: 'Make', apiName: 'vehicle_make' },
        { name: 'model', label: 'Model', apiName: 'vehicle_model' },
        { name: 'year', label: 'Year', type: 'number', apiName: 'model_year' },
        { name: 'seatingCapacity', label: 'Seating Capacity', type: 'number', apiName: 'vehicle_seating_capacity' },
        { name: 'miscDetails', label: 'Misc Details', apiName: 'misc_details' },
        { name: 'vehicleType', label: 'Vehicle Type', apiName: 'vehicle_type' },
    ];

    useEffect(() => {
        if (initialSelectedRow && isOpen) {
            // Map initialSelectedRow (from API) to form state (using VehicleModel internal names)
            const formData = {
                id: initialSelectedRow.vehicle_model_id, // Keep the ID
                make: initialSelectedRow.vehicle_make,
                model: initialSelectedRow.vehicle_model,
                year: initialSelectedRow.model_year,
                seatingCapacity: initialSelectedRow.vehicle_seating_capacity,
                miscDetails: initialSelectedRow.misc_details,
                vehicleType: initialSelectedRow.vehicle_type,
            };
            setEditableModel(formData);
        } else if (!isOpen) {
            setEditableModel(null);
        }
    }, [initialSelectedRow, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const fieldDefinition = formFields.find(f => f.name === name);
        let processedValue = value;

        if (fieldDefinition?.type === 'number') {
            processedValue = value === '' ? NaN : parseInt(value, 10);
        }
        setEditableModel(prev => prev ? { ...prev, [name]: processedValue } : null);
    };

    const handleSave = async () => {
        if (!editableModel) return;
        setIsLoading(true);
        try {
            // Create VehicleModel instance from form data for submission
            const modelToUpdate = new VehiclemodelModel({
                vehicle_model_id: editableModel.id, // Pass the ID
                vehicle_make: editableModel.make,
                vehicle_model: editableModel.model,
                model_year: editableModel.year,
                vehicle_seating_capacity: editableModel.seatingCapacity,
                misc_details: editableModel.miscDetails,
                vehicle_type: editableModel.vehicleType,
            });

            await updateVehicleModelDetails(modelToUpdate);
            if (onSaveSuccess) onSaveSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to update vehicle model:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !editableModel) {
        return null; // Or a loading spinner if preferred while editableModel is being set
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <h3 className="text-lg font-semibold mb-4">
                Edit Vehicle Model: {editableModel.model}
            </h3>
            <div className="space-y-4">
                {formFields.map(({ name, label, type }) => (
                    <InputField
                        key={name}
                        name={name}
                        label={label}
                        type={type || 'text'}
                        placeholder={label}
                        value={Number.isNaN(editableModel[name]) ? '' : (editableModel[name] ?? '')}
                        onChange={handleChange}
                    />
                ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
                <ButtonLight onClick={onClose} disabled={isLoading} variant="outlined">Cancel</ButtonLight>
                <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </BaseModal>
    );
};
