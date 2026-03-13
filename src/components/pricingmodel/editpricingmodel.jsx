import React, { useState, useEffect } from 'react';
import { BaseModal, InputField, Button, ButtonLight } from '@components';
import { updateVehiclePricing } from '@services';
import { VehiclePricing } from '@/models';

export const EditPricingModal = ({ isOpen, onClose, selectedRow: initialSelectedRow, onSaveSuccess }) => {
    const [editableRow, setEditableRow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fields = [
        { name: 'kmRate', label: 'KM Rate (INR)', type: 'number', step: '0.01' },
        { name: 'minimumKms', label: 'Minimum KMs', type: 'number', step: '0.1' },
        { name: 'driverCharge', label: 'Driver Charge (INR)', type: 'number', step: '0.01' },
        { name: 'driverMaxKms', label: 'Driver Max KMs', type: 'number', step: '0.1' },
        { name: 'waitingCharges', label: 'Waiting Charges (INR)', type: 'number', step: '0.01' },
        { name: 'petCharges', label: 'Pet Charges (INR)', type: 'number', step: '0.01' },
        { name: 'discount', label: 'Discount (e.g., 0.05 for 5%)', type: 'number', step: '0.001', min: "0", max: "1" },
        { name: 'timeAddon', label: 'Time Addon (HH:MM:SS)', type: 'text', placeholder: 'HH:MM:SS' },
        { name: 'kmsAddon', label: 'KMs Addon', type: 'number', step: '0.1' },
    ];

    useEffect(() => {
        if (initialSelectedRow && isOpen) {
            const formValues = {};
            fields.forEach(field => {
                formValues[field.name] = initialSelectedRow[field.name];
            });
            formValues.operatorMobile = initialSelectedRow.operatorMobile;
            formValues.vehicleType = initialSelectedRow.vehicleType;
            setEditableRow(formValues);
        } else if (!isOpen) {
            setEditableRow(null);
        }
    }, [initialSelectedRow, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const fieldDefinition = fields.find(f => f.name === name);
        let processedValue = value;

        if (fieldDefinition?.type === 'number') {
            processedValue = value === '' ? NaN : parseFloat(value);
        }

        setEditableRow(prev => prev ? { ...prev, [name]: processedValue } : null);
    };

    const handleSave = async () => {
        if (!editableRow) return;
        setIsLoading(true);
        try {
            const constructorArg = {
                price_operatormobile: String(editableRow.operatorMobile),
                price_vehtype: String(editableRow.vehicleType),
                price_kmrate: Number.isNaN(editableRow.kmRate) ? "" : String(editableRow.kmRate),
                price_drivercharge: Number.isNaN(editableRow.driverCharge) ? "" : String(editableRow.driverCharge),
                price_drivermaxkms: Number.isNaN(editableRow.driverMaxKms) ? "" : String(editableRow.driverMaxKms),
                price_pet: Number.isNaN(editableRow.petCharges) ? "" : String(editableRow.petCharges),
                price_waiting: Number.isNaN(editableRow.waitingCharges) ? "" : String(editableRow.waitingCharges),
                price_discount: Number.isNaN(editableRow.discount) ? "" : String(editableRow.discount),
                price_timeaddon: String(editableRow.timeAddon || ""),
                price_kmsaddon: Number.isNaN(editableRow.kmsAddon) ? "" : String(editableRow.kmsAddon),
                price_minimumkms: Number.isNaN(editableRow.minimumKms) ? "" : String(editableRow.minimumKms),
            };

            const pricingModelToUpdate = new VehiclePricing(constructorArg);

            await updateVehiclePricing(pricingModelToUpdate);
            if (onSaveSuccess) onSaveSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to update pricing:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            {!editableRow ? (
                <div className="text-center py-6">Loading...</div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold mb-4">
                        Edit Pricing for {editableRow?.vehicleType}
                    </h3>
                    <div className="space-y-4">
                        {fields.map(({ name, label, type, step, placeholder, min, max }) => (
                            <InputField
                                key={name}
                                name={name}
                                label={label}
                                type={type || 'text'}
                                step={step}
                                min={min}
                                max={max}
                                placeholder={placeholder || label}
                                value={Number.isNaN(editableRow[name]) ? '' : (editableRow[name] ?? '')}
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
                </>
            )}
        </BaseModal>
    );
};
