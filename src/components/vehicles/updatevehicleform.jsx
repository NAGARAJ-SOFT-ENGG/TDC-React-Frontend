import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { InputField, Button, DatePickerComponent, FileUploader, ButtonLight } from '@components';
import { VehicleModel } from '@models';
import { updateVehicleDetails, fetchVehicleModelList, fetchVehicleTypeList } from '@services';

const fuelTypes = [
  { label: 'Petrol', value: 'Petrol' },
  { label: 'Diesel', value: 'Diesel' },
  { label: 'CNG', value: 'CNG' },
  { label: 'Electric', value: 'Electric' },
];

// Helper to convert string date from API to Date object, or return null
const parseApiDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

export const UpdateVehicleForm = ({ vehicle, operatorMobile, onCancel, onSubmitSuccess }) => {
    const [vehicleData, setVehicleData] = useState({
        operatorMobile: operatorMobile || vehicle?.operator_mobile || '', // API uses snake_case
        vehicleNumber: vehicle?.vehicle_number || '', // API uses snake_case
        vehicleModel: null, // Will be set from API data
        vehicleType: null,  // Will be set from API data
        fuelType: null,     // Will be set from API data
        rcNumber: vehicle?.rc_number || '',
        activePermits: vehicle?.active_permits || '',
        insuranceNumber: vehicle?.insurance_number || '',
        insuranceFrom: parseApiDate(vehicle?.insurance_valid_from),
        insuranceUpto: parseApiDate(vehicle?.insurance_valid_upto),
        fcNumber: vehicle?.fc_number || '',
        fcFrom: parseApiDate(vehicle?.fc_valid_from),
        fcUpto: parseApiDate(vehicle?.fc_valid_upto),
        // rcValidFrom: parseApiDate(vehicle?.rc_valid_from),
        // rcValidUpto: parseApiDate(vehicle?.rc_validupto),
        rcImageFile: null,
        fcImageFile: null,
        insuranceImageFile: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });
    const [vehicleModelOptions, setVehicleModelOptions] = useState([]);
    const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
    const [allApiVehicleModels, setAllApiVehicleModels] = useState([]);

    useEffect(() => {
        const loadVehicleModelsAndSetDefaults = async () => {
            try {
                // Fetch both lists concurrently
                const [modelResponse, typesData] = await Promise.all([
                    fetchVehicleModelList(),
                    fetchVehicleTypeList() // This service returns the raw array of vehicle type objects
                ]);

                // Process and set vehicle type options first
                let formattedTypeOpts = [];
                if (Array.isArray(typesData)) {
                    formattedTypeOpts = typesData.map(typeObj => ({
                        value: typeObj.vehicle_type,
                        label: typeObj.vehicle_type
                    }));
                    setVehicleTypeOptions(formattedTypeOpts);
                } else {
                    console.warn("Vehicle types data is not an array:", typesData);
                    setVehicleTypeOptions([]);
                }

                // Process and set vehicle model options
                if (modelResponse && Array.isArray(modelResponse.vehicle_models)) {
                    setAllApiVehicleModels(modelResponse.vehicle_models);
                    const modelOpts = modelResponse.vehicle_models.map(model => ({
                        label: `${model.vehicle_make} - ${model.vehicle_model} (${model.model_year})`,
                        value: model.vehicle_model_id, // Use ID for value
                        vehicle_type: model.vehicle_type,
                        model_name_string: model.vehicle_model // Store actual model name for matching
                    }));
                    setVehicleModelOptions(modelOpts);

                    // Pre-fill Select fields now that both model and type options are processed
                    if (vehicle) {
                        // Match by vehicle_model string to find the correct option object
                        const currentModelOpt = modelOpts.find(opt => opt.model_name_string === vehicle.vehicle_model);
                        if (currentModelOpt) {
                            // Pass the freshly formatted type options to handleModelChange
                            handleModelChange(currentModelOpt, formattedTypeOpts);
                        } else {
                            // Fallback: If model not found, try to set vehicle type directly using formatted options
                            const currentTypeOpt = formattedTypeOpts.find(opt => opt.value === vehicle.vehicle_type);
                            if (currentTypeOpt) {
                                setVehicleData(prev => ({ ...prev, vehicleType: currentTypeOpt }));
                            } else if (vehicle.vehicle_type) {
                                // If type is not in options (even after fetching), create a temporary option for display
                                setVehicleData(prev => ({ ...prev, vehicleType: { label: vehicle.vehicle_type, value: vehicle.vehicle_type } }));
                            }
                        }

                        const currentFuelOpt = fuelTypes.find(opt => opt.value === vehicle.fuel_type);
                        if (currentFuelOpt) {
                            setVehicleData(prev => ({ ...prev, fuelType: currentFuelOpt }));
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load vehicle models or types for update form:", error);
                setVehicleModelOptions([]);
                setVehicleTypeOptions([]); // Ensure options are cleared on error
            }
        };
        loadVehicleModelsAndSetDefaults();
    }, [vehicle]); // Rerun if vehicle prop changes, ensuring pre-fill happens when data is ready

    const handleChange = (field, value) => {
        setVehicleData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (name, file) => {
        setVehicleData(prev => ({ ...prev, [name]: file }));
    };

    const handleModelChange = (selectedModelOption, currentTypeOptions = vehicleTypeOptions) => {
        // currentTypeOptions is passed to ensure we use the latest options if called during useEffect
        handleChange('vehicleModel', selectedModelOption);
        if (selectedModelOption && selectedModelOption.vehicle_type) {
            const typeToSelect = currentTypeOptions.find(opt => opt.value === selectedModelOption.vehicle_type);
            if (typeToSelect) {
                handleChange('vehicleType', typeToSelect);
            } else {
                handleChange('vehicleType', { label: selectedModelOption.vehicle_type, value: selectedModelOption.vehicle_type });
            }
        } else {
            handleChange('vehicleType', null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormMessage({ type: '', text: '' });

        const selectedApiModel = vehicleData.vehicleModel
            ? allApiVehicleModels.find(m => m.vehicle_model_id === vehicleData.vehicleModel.value)
            : null;

        const dataForModelConstructor = {
            ...vehicleData,
            vehicleNumber: vehicle.vehicle_number, // Ensure original vehicle_number is used for update
            operatorMobile: operatorMobile || vehicle.operator_mobile,
            vehicleModel: selectedApiModel ? selectedApiModel.vehicle_model : (vehicle.vehicle_model || ''),
            vehicleType: vehicleData.vehicleType?.value || (vehicle.vehicle_type || ''),
            fuelType: vehicleData.fuelType?.value || (vehicle.fuel_type || ''),
        };

        const model = new VehicleModel(dataForModelConstructor);
        const formDataPayload = model.toFormData();

        try {
            const response = await updateVehicleDetails(formDataPayload);
            console.log('Vehicle updated successfully:', response);
            setFormMessage({ type: 'success', text: 'Vehicle updated successfully!' });
            if (onSubmitSuccess) onSubmitSuccess(response);
        } catch (error) {
            console.error('Failed to update vehicle:', error);
            setFormMessage({ type: 'error', text: error.message || 'Failed to update vehicle. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-auto">
            <h2 className="textPrimary mb-2 text-lg font-bold">Update Vehicle Details</h2>

            {formMessage.text && (
                <div className={`p-3 mb-4 rounded text-center ${formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {formMessage.text}
                </div>
            )}

            <div className="grid grid-cols-4 gap-4 mb-2">
                <InputField
                    name="operatorMobile"
                    placeholder="Operator Mobile"
                    required
                    value={vehicleData.operatorMobile}
                    onChange={(e) => handleChange('operatorMobile', e.target.value)}
                    disabled // Operator mobile usually not changed here
                />
                <InputField
                    name="vehicleNumber"
                    placeholder="Vehicle Number"
                    required
                    value={vehicleData.vehicleNumber}
                    onChange={(e) => handleChange('vehicleNumber', e.target.value)}
                    disabled // Vehicle number is the identifier, should not be changed
                />
                <div className="">
                    <Select
                    classNamePrefix="react-select"
                        options={vehicleModelOptions}
                        value={vehicleData.vehicleModel}
                        onChange={handleModelChange}
                        placeholder="Vehicle Model"
                        isLoading={vehicleModelOptions.length === 0 && allApiVehicleModels.length === 0 && !vehicle?.vehicle_model}
                     menuPortalTarget={typeof window !== "undefined" ? document.body : null} // Added
                        menuPosition="fixed" // Added
                        styles={{ // Added styles object
                            container: (base) => ({ ...base, width: "100%" }), // Optional: if you want full width
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // High z-index for the portal
                        }}
                    />
                </div>
                <div className="">
                    <Select
                    classNamePrefix="react-select"
                        options={vehicleTypeOptions}
                        value={vehicleData.vehicleType}
                        onChange={(val) => handleChange('vehicleType', val)}
                        // isDisabled={true} // Vehicle type is now editable
                        placeholder="Vehicle Type"
                        menuPortalTarget={typeof window !== "undefined" ? document.body : null} // Added
                        menuPosition="fixed" // Added
                        styles={{ // Added styles object
                            container: (base) => ({ ...base, width: "100%" }), // Optional: if you want full width
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // High z-index for the portal
                        }}
                    />
                </div>
            </div>

            <hr className="my-2" />

            <h3 className="text-md font-semibold text-icon mb-2">Registration Certificate</h3>
            <div className="grid grid-cols-4 gap-4 items-center mb-6">
                <FileUploader
                    label="RC Image"
                    name="rcImage"
                    onFileSelect={(file) => handleFileChange('rcImageFile', file)}
                    currentFilePreview={vehicle?.rc_image}
                />
                <InputField
                    name="rcNumber"
                    placeholder="RC Number"
                    required
                    value={vehicleData.rcNumber}
                    onChange={(e) => handleChange('rcNumber', e.target.value)}
                />
                <InputField
                    name="activePermits"
                    placeholder="Active Permits"
                    required
                    value={vehicleData.activePermits}
                    onChange={(e) => handleChange('activePermits', e.target.value)}
                />
                {/* Fuel Type - Add if it's part of your UI for updates */}
                {/* <div className="col-span-1">
                    <Select
                        options={fuelTypes}
                        value={vehicleData.fuelType}
                        onChange={(val) => handleChange('fuelType', val)}
                        placeholder="Fuel Type" />
                </div> */}
            </div>

            <hr className="my-2" />

            <h3 className="text-md font-semibold text-icon mb-2">Insurance</h3>
            <div className="grid grid-cols-4 gap-4 items-center mb-6">
                <FileUploader
                    label="Insurance Image"
                    name="insuranceImage"
                    onFileSelect={(file) => handleFileChange('insuranceImageFile', file)}
                    currentFilePreview={vehicle?.insurance_image}
                />
                <InputField
                    name="insuranceNumber"
                    placeholder="Insurance Number"
                    value={vehicleData.insuranceNumber}
                    onChange={(e) => handleChange('insuranceNumber', e.target.value)}
                />
                <DatePickerComponent
                    name="insuranceFrom"
                    placeholderText="Insurance Valid From"
                    selected={vehicleData.insuranceFrom}
                    onChange={(date) => handleChange('insuranceFrom', date)} // Corrected prop name
                    required
                />
                <DatePickerComponent
                    name="insuranceUpto"
                    placeholderText="Insurance Valid Upto"
                    selected={vehicleData.insuranceUpto}
                    onChange={(date) => handleChange('insuranceUpto', date)}
                    required
                />
            </div>

            <hr className="my-2" />

            <h3 className="text-md font-semibold text-icon mb-2">Fitness Certificate</h3>
            <div className="grid grid-cols-4 gap-4 items-center">
                <FileUploader
                    label="FC Image"
                    name="fcImage"
                    onFileSelect={(file) => handleFileChange('fcImageFile', file)}
                    currentFilePreview={vehicle?.fc_image}
                />
                <InputField
                    name="fcNumber"
                    placeholder="FC Number"
                    value={vehicleData.fcNumber}
                    onChange={(e) => handleChange('fcNumber', e.target.value)}
                />
                <DatePickerComponent
                    name="fcFrom"
                    placeholderText="FC Valid From"
                    selected={vehicleData.fcFrom}
                    onChange={(date) => handleChange('fcFrom', date)} // Corrected prop name
                    required
                />
                <DatePickerComponent
                    name="fcUpto"
                    placeholderText="FC Valid Upto"
                    selected={vehicleData.fcUpto}
                    onChange={(date) => handleChange('fcUpto', date)} // Corrected prop name
                    required
                />
            </div>

            <div className="mt-4 flex justify-end space-x-4">
                <ButtonLight type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </ButtonLight>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update'}
                </Button>
            </div>
        </form>
    );
};
