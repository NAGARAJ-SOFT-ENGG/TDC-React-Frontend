import React, { useState, useEffect } from "react";
import Select from "react-select"; // Import Select
import { BaseModal, InputField, ButtonLight, Button } from "@components";
import { X } from "lucide-react";
import { onboardVehiclePricing, fetchVehicleTypeList } from '@services'; // Import fetchVehicleTypes
import { VehiclePricingModel } from '@/models'; // Updated import

// Removed hardcoded vehicleTypeOptions
// Renaming the component to better reflect its purpose for adding pricing
export const NewCarTypeModal = ({ isOpen, onClose, operatorMobile, onSaveSuccess }) => {
    // Initial state for all pricing fields
    const initialFormState = {
        vehicleType: "",
        kmRate: "",
        minimumKms: "",
        driverCharge: "", // This will now store the selected option object for vehicleType
        driverMaxKms: "",
        waitingCharges: "",
        petCharges: "",
        discount: "",
        timeAddon: "",
        kmsAddon: "",
    };
    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [dynamicVehicleTypeOptions, setDynamicVehicleTypeOptions] = useState([]);
    const [isLoadingVehicleTypes, setIsLoadingVehicleTypes] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const loadVehicleTypes = async () => {
                setIsLoadingVehicleTypes(true);
                try {
                    // fetchVehicleTypeList service returns an array of vehicle type objects.
                    // We need to map this to the { value, label } format for the Select component.
                    const vehicleTypesData = await fetchVehicleTypeList(); // This returns the array like [{ vehicle_type: "Sedan", ...}, ...]
                    if (Array.isArray(vehicleTypesData)) {
                        const options = vehicleTypesData.map(typeObj => ({
                            value: typeObj.vehicle_type,
                            label: typeObj.vehicle_type // You can customize the label if needed, e.g., `${typeObj.vehicle_type} (Capacity: ${typeObj.capacity})`
                        }));
                        setDynamicVehicleTypeOptions(options);
                    } else {
                        setDynamicVehicleTypeOptions([]);
                    }
                } catch (error) {
                    // Error is already logged in the service if it's not caught by apiCall
                    console.error("Error loading vehicle types in NewCarTypeModal:", error);
                    setDynamicVehicleTypeOptions([]);
                } finally {
                    setIsLoadingVehicleTypes(false);
                }
            };
            loadVehicleTypes();
        }
    }, [isOpen]);
    
    // Define the fields for the form based on VehiclePricing model
    // We will handle vehicleType separately as it's a Select component
    const fields = [
        { name: 'kmRate', label: 'KM Rate (INR)', type: 'number', step: '0.01', required: true },
        { name: 'minimumKms', label: 'Minimum KMs for Trip', type: 'number', step: '0.1', required: true },
        { name: 'driverCharge', label: 'Driver Charge (INR)', type: 'number', step: '0.01', required: true },
        { name: 'driverMaxKms', label: 'Driver Max KMs', type: 'number', step: '0.1', required: true },
        { name: 'waitingCharges', label: 'Waiting Charges (INR)', type: 'number', step: '0.01', required: true },
        { name: 'petCharges', label: 'Pet Charges (INR)', type: 'number', step: '0.01', required: true },
        { name: 'discount', label: 'Discount (e.g., 0.05 for 5%)', type: 'number', step: '0.001', min: "0", max: "1", required: true },
        { name: 'timeAddon', label: 'Time Addon (HH:MM:SS)', type: 'text', placeholder: 'HH:MM:SS', required: true },
        { name: 'kmsAddon', label: 'KMs Addon', type: 'number', step: '0.1', required: true },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, selectedOption) => {
        setFormData(prev => ({
            ...prev,
            [name]: selectedOption // Store the whole selected option object
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!operatorMobile) {
            return;
        }
        setIsLoading(true);
        try {
            // Prepare data for VehiclePricing constructor (price_ prefixed keys)
            const pricingConstructorArgs = {
                price_operatormobile: String(operatorMobile),
                price_vehtype: String(formData.vehicleType?.value || ""), // Get value from selected option
                price_kmrate: String(formData.kmRate),
                price_drivercharge: String(formData.driverCharge),
                price_drivermaxkms: String(formData.driverMaxKms),
                price_pet: String(formData.petCharges),
                price_waiting: String(formData.waitingCharges),
                price_discount: String(formData.discount),
                price_timeaddon: String(formData.timeAddon),
                price_kmsaddon: String(formData.kmsAddon),
                price_minimumkms: String(formData.minimumKms),
            };

            const newPricing = new VehiclePricingModel(pricingConstructorArgs); // Use new model
            await onboardVehiclePricing(newPricing); // Service call
            setFormData(initialFormState); 
            if (onSaveSuccess) {
                onSaveSuccess(); // Callback to refresh parent data
            }
            onClose();
        } catch (error) {
            console.error("Failed to add new pricing:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold textPrimary">Add New Vehicle Pricing</h3>
                    <button type="button" onClick={onClose} className="text-gray-600 hover:text-black">
                        <X className="w-5 h-5 text-gray-600 hover:text-black" />
                    </button>
                </div>

                <hr className="mb-4" />
                {/* Scrollable form fields area */}
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Vehicle Type Dropdown */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                        <Select
                            name="vehicleType"
                            options={dynamicVehicleTypeOptions}
                            value={formData.vehicleType}
                            isLoading={isLoadingVehicleTypes}
                            onChange={(option) => handleSelectChange("vehicleType", option)}
                            placeholder="Select vehicle type"
                            className="react-select"
                            classNamePrefix="react-select"
                            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                            menuPosition="fixed"
                            styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 })
                            }}
                            required
                        />
                    </div>
                    {fields.map(({ name, label, type, step, placeholder, min, max, required }) => (
                        <InputField
                            key={name}
                            name={name}
                            label={label}
                            type={type || 'text'}
                            step={step}
                            min={min}
                            max={max}
                            placeholder={placeholder || label}
                            value={formData[name]}
                            onChange={handleChange}
                            required={required}
                        />
                    ))}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <ButtonLight type="button" onClick={onClose} disabled={isLoading} variant="outlined">
                        Cancel
                    </ButtonLight>
                    <Button type="submit" disabled={isLoading}>
                                                {isLoading ? 'Saving...' : 'Save Pricing'}
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
};
