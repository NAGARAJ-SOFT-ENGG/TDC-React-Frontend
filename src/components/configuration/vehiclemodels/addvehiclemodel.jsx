import React, { useState, useEffect } from "react";
import Select from "react-select";
import { BaseModal, InputField, Button, ButtonLight } from "@components";
import { X } from "lucide-react";
import { VehiclemodelModel } from "@/models"; // Import the model
import { onboardVehicleModel, fetchVehicleModelList } from "@services"; // Import services

const seatOptions = [
    { value: 3, label: "3 Seater" },
    { value: 4, label: "4 Seater" },
    { value: 5, label: "5 Seater" },
    { value: 6, label: "6 Seater" },
    { value: 7, label: "7 Seater" },
];

const initialFormState = {
        vehicle_make: "",
        vehicle_model: "",
        vehicle_modelyear: "",
        vehicle_seating: null,
        vehicle_misc: "",
        vehicle_type: null,
};

export const VehicleModelOnboard = ({ isOpen, onClose, onSaveSuccess }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [dynamicVehicleTypeOptions, setDynamicVehicleTypeOptions] = useState([]);
    const [isLoadingVehicleTypes, setIsLoadingVehicleTypes] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const loadVehicleTypes = async () => {
                setIsLoadingVehicleTypes(true);
                try {
                    // fetchVehicleModelList service already returns options in { value, label } format
                    const options = await fetchVehicleModelList();
                    setDynamicVehicleTypeOptions(options);
                } catch (error) {
                    // Error is already logged in the service
                    setDynamicVehicleTypeOptions([]);
                } finally {
                    setIsLoadingVehicleTypes(false);
                }
            };
            loadVehicleTypes();
        }
    }, [isOpen]);

    const resetForm = () => {
        setFormData(initialFormState);
        // setImage(null); // If image state was used
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name, selectedOption) => {
        setFormData(prev => ({
            ...prev,
            [name]: selectedOption
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Prepare data for VehiclemodelModel constructor
            // The constructor expects: vehicle_make, vehicle_model, model_year, vehicle_seating_capacity, misc_details, vehicle_type
            const modelConstructorArgs = {
                vehicle_make: formData.vehicle_make,
                vehicle_model: formData.vehicle_model,
                model_year: formData.vehicle_modelyear, // Maps to model_year in constructor
                vehicle_seating_capacity: formData.vehicle_seating?.value, // Maps to vehicle_seating_capacity
                misc_details: formData.vehicle_misc, // Maps to misc_details
                vehicle_type: formData.vehicle_type?.value, // Maps to vehicle_type
                // vehicle_model_id is not needed for new onboard
            };

            const newVehicleModel = new VehiclemodelModel(modelConstructorArgs);
            await onboardVehicleModel(newVehicleModel);

            resetForm();
            if (onSaveSuccess) {
                onSaveSuccess();
            }
            onClose();
        } catch (error) {
            console.error("Failed to onboard vehicle model:", error);
            // Error toast is likely handled by apiCall utility
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">Onboard New Vehicle Model</h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5 text-gray-600 hover:text-black" />
                    </button>
                </div>

                <hr className="mb-4" />

                {/* <FileUploader
                /> */}
                {/* Make */}
                <div className="my-4">
                    <InputField
                        name="vehicle_make"
                        value={formData.vehicle_make}
                        onChange={handleInputChange}
                        placeholder="Vehicle Make (e.g., Toyota, Ford)"
                        required
                    />
                </div>

                {/* Model */}
                <div className="my-4">
                    <InputField
                        name="vehicle_model"
                        value={formData.vehicle_model}
                        onChange={handleInputChange}
                        placeholder="Vehicle Model (e.g., Camry, F-150)"
                        required
                    />
                </div>

                {/* Model Year */}
                <div className="my-4">
                    <InputField
                        name="vehicle_modelyear"
                        value={formData.vehicle_modelyear}
                        onChange={handleInputChange}
                        placeholder="Model Year (e.g., 2023)"
                        type="number"
                        required
                    />
                </div>

                {/* Seats dropdown */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
                    <Select
                        options={seatOptions}
                        value={formData.vehicle_seating}
                        onChange={(option) => handleSelectChange("vehicle_seating", option)}
                        placeholder="Select seating capacity"
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

                {/* Vehicle Type dropdown */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                    <Select
                        options={dynamicVehicleTypeOptions}
                        isLoading={isLoadingVehicleTypes}
                        value={formData.vehicle_type}
                        onChange={(option) => handleSelectChange("vehicle_type", option)}
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

                {/* Miscellaneous */}
                <div className="my-4">
                    <InputField
                        name="vehicle_misc"
                        value={formData.vehicle_misc}
                        onChange={handleInputChange}
                        placeholder="Miscellaneous information (optional)"
                    />
                </div>

                {/* Submit button */}
                <div className="mt-6 flex justify-end gap-3">
                    <ButtonLight type="button" onClick={onClose} disabled={isLoading} variant="outlined">Cancel</ButtonLight>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
};