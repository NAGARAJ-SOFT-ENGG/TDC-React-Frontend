import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { InputField, Button, DatePickerComponent } from '@components';
import { FileUploader } from '@components';
import { VehicleModel } from '@models';
import { onboardVehicle, fetchVehicleModelList, fetchVehicleTypeList } from '@services';

const fuelTypes = [
  { label: 'Petrol', value: 'Petrol' },
  { label: 'Diesel', value: 'Diesel' },
  { label: 'CNG', value: 'CNG' },
  { label: 'Electric', value: 'Electric' },
];

export const VehicleOnboardingForm = ({ operatorMobile: propOperatorMobile }) => {
  const [vehicleData, setVehicleData] = useState({
    operatorMobile: propOperatorMobile || '',
    vehicleNumber: '',
    vehicleModel: null,
    vehicleType: null,
    fuelType: null,
    rcNumber: '',
    // rcValidFrom: null,
    // rcValidUpto: null,
    activePermits: '',
    insuranceNumber: '',
    insuranceFrom: null,
    insuranceUpto: null,
    fcNumber: '',
    fcFrom: null,
    fcUpto: null,
    rcImageFile: null,
    fcImageFile: null,
    insuranceImageFile: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' }); // For success/error messages
  const [vehicleModelOptions, setVehicleModelOptions] = useState([]);
  const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
  const [allApiVehicleModels, setAllApiVehicleModels] = useState([]); // To store raw API data for lookups

  useEffect(() => {
    const loadVehicleModelsAndTypes = async () => {
      // Fetch Vehicle Models
      try {
        const response = await fetchVehicleModelList();
        if (response && Array.isArray(response.vehicle_models)) {
          setAllApiVehicleModels(response.vehicle_models); // Store raw data

          const modelOpts = response.vehicle_models.map(model => ({
            label: `${model.vehicle_make} - ${model.vehicle_model} (${model.model_year})`,
            value: model.vehicle_model_id, // Use a unique ID for the value
            vehicle_type: model.vehicle_type // Keep track of the associated type
          }));
          setVehicleModelOptions(modelOpts);
        }
      } catch (error) {
        console.error("Failed to load vehicle models:", error);
      }

      // Fetch Vehicle Types
      try {
        const vehicleTypesData = await fetchVehicleTypeList(); // This returns the array like [{ vehicle_type: "Sedan", ...}, ...]
        if (Array.isArray(vehicleTypesData)) {
          const options = vehicleTypesData.map(typeObj => ({
            value: typeObj.vehicle_type,
            label: typeObj.vehicle_type // You can customize the label if needed
          }));
          setVehicleTypeOptions(options);
        } else {
          console.warn("Vehicle types data is not an array:", vehicleTypesData);
          setVehicleTypeOptions([]); // Set to empty on unexpected structure
        }
      } catch (error) {
        console.error("Failed to load vehicle types:", error);
        setVehicleTypeOptions([]); // Set to empty on error
      }
    };
    loadVehicleModelsAndTypes();
  }, []);

  const handleChange = (field, value) => {
    setVehicleData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (name, file) => {
    setVehicleData(prev => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormMessage({ type: '', text: '' });

    // Prepare data for the VehicleModel constructor, ensuring correct string values
    const selectedApiModel = vehicleData.vehicleModel
      ? allApiVehicleModels.find(m => m.vehicle_model_id === vehicleData.vehicleModel.value)
      : null;

    const dataForModelConstructor = {
      ...vehicleData, // Spreads existing values like rcNumber, fcNumber, dates, files etc.
      vehicleModel: selectedApiModel ? selectedApiModel.vehicle_model : '', // Pass the actual model name string
      vehicleType: vehicleData.vehicleType?.value || '', // Pass the string value from select
      fuelType: vehicleData.fuelType?.value || '', // Pass the string value from select (if fuelType select is added)
      // rcValidFrom and rcValidUpto are not in vehicleData state,
      // so they will be undefined here. VehicleModel handles this.
      // insuranceNumber and fcNumber are in vehicleData state as '' if not filled.
    };

    const model = new VehicleModel(dataForModelConstructor);
    const formDataPayload = model.toFormData();

    try {
      const response = await onboardVehicle(formDataPayload);
      console.log('Vehicle onboarded successfully:', response);
      setFormMessage({ type: 'success', text: 'Vehicle onboarded successfully!' });
      // Optionally reset form or redirect
      // setVehicleData({ ...initial state... }); 
    } catch (error) {
      console.error('Failed to onboard vehicle:', error);
      setFormMessage({ type: 'error', text: error.message || 'Failed to onboard vehicle. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (selectedModelOption) => {
    handleChange('vehicleModel', selectedModelOption);

    if (selectedModelOption && selectedModelOption.vehicle_type) {
      // Find the corresponding vehicle type option to set in the state
      const typeToSelect = vehicleTypeOptions.find(opt => opt.value === selectedModelOption.vehicle_type);
      if (typeToSelect) {
        handleChange('vehicleType', typeToSelect);
      } else {
        // Fallback if type not found in options (should not happen if options are generated correctly)
        handleChange('vehicleType', { label: selectedModelOption.vehicle_type, value: selectedModelOption.vehicle_type });
      }
    } else {
      handleChange('vehicleType', null); // Clear vehicle type if model is cleared or has no type
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-auto">
      <h2 className="textPrimary font-bold text-lg mb-4">Vehicle Onboarding</h2>

      {/* {formMessage.text && (
        <div className={`p-3 mb-4 rounded text-center ${formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
          {formMessage.text}
        </div>
      )} */}

      <div className="grid grid-cols-4 gap-4 mb-6">
        <InputField
          name="operatorMobile"
          placeholder="Operator Mobile"
          required
          value={vehicleData.operatorMobile}
          onChange={(e) => handleChange('operatorMobile', e.target.value)}
          disabled={!!propOperatorMobile} // Disable if operatorMobile is passed as prop
        />
        <InputField
          name="vehicleNumber"
          placeholder="Vehicle Number"
          required
          value={vehicleData.vehicleNumber}
          onChange={(e) => handleChange('vehicleNumber', e.target.value)}
        />
        <div className=''>
          {/* <label className="block text-sm text-gray-500 mb-1">Vehicle Model<span className="text-red-500">*</span></label> */}
          <Select
            options={vehicleModelOptions}
            value={vehicleData.vehicleModel}
            onChange={handleModelChange}
            placeholder="Vehicle Model"
            classNamePrefix={"react-select"}
            isLoading={vehicleModelOptions.length === 0 && allApiVehicleModels.length === 0} // Show loading if options not yet fetched
            menuPortalTarget={typeof window !== "undefined" ? document.body : null} // Added
            menuPosition="fixed" // Added
            styles={{ // Added styles object
              container: (base) => ({ ...base, width: "100%" }), // Optional: if you want full width
              menuPortal: (base) => ({ ...base, zIndex: 9999 }), // High z-index for the portal
            }}
          />
        </div>
        <div className=''>
          {/* <label className="block text-sm text-gray-500 mb-1">Vehicle Type<span className="text-red-500">*</span></label> */}
          <Select
            options={vehicleTypeOptions}
            value={vehicleData.vehicleType}
            classNamePrefix={"react-select"}
            onChange={(val) => handleChange('vehicleType', val)}
            // isDisabled={true} // Removed to make the dropdown active
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

      <h3 className="text-md font-semibold text-icon">Registration Certificate</h3>
      <div className="grid grid-cols-4 gap-4 items-center mb-2">
        <FileUploader
          name="rcImage"
          label="Upload RC"
          onFileSelect={(file) => handleFileChange('rcImageFile', file)}
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
      </div>

      <hr className="my-2" />

      <h3 className="text-md font-semibold text-icon mb-2">Insurance</h3>
      <div className="grid grid-cols-4 gap-4 items-center mb-2">
        <FileUploader
          name="insuranceImage"
          label="Upload Insurance"
          onFileSelect={(file) => handleFileChange('insuranceImageFile', file)}
        />

        <InputField
          name="insuranceNumber"
          placeholder="Insurance Number"
          value={vehicleData.insuranceNumber}
          onChange={(e) => handleChange('insuranceNumber', e.target.value)}
          required // Assuming Insurance Number is required for onboarding
            />
        <DatePickerComponent
          name="insuranceFrom"
          placeholderText="Insurance Valid From"
          selected={vehicleData.insuranceFrom}
          onChange={(date) => handleChange('insuranceFrom', date)}
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
        />

        <InputField
          name="fcNumber"
          placeholder="FC Number"
          value={vehicleData.fcNumber}
          onChange={(e) => handleChange('fcNumber', e.target.value)}
          required // Assuming FC Number is required for onboarding
            />
        <DatePickerComponent
          name="fcFrom"
          placeholderText="FC Valid From"
          selected={vehicleData.fcFrom}
          onChange={(date) => handleChange('fcFrom', date)}
          required
        />
        <DatePickerComponent
          name="fcUpto"
          placeholderText="FC Valid Upto"
          selected={vehicleData.fcUpto}
          onChange={(date) => handleChange('fcUpto', date)}
          required
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" className="py-2 px-6 rounded" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};
