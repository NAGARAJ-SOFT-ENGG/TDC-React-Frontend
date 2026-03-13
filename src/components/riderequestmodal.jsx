import React, { useState, useEffect } from "react";
import Select from "react-select";
import { BaseModal, InputField, Button, DatePickerComponent, ButtonLight } from "@components"; // Assuming DatePickerComponent exists
import { X } from "lucide-react";
import { createRideRequest, fetchVehicleTypeList } from '@services';
import { RideRequestModel } from '@models';
import { toast } from 'react-toastify';
import { parseDateDMY } from "@utils";

export const CreateRideRequestModal = ({ isOpen, onClose, operatorMobile, onSaveSuccess }) => {
    const initialFormState = {
        riderequest_occname: "",
        riderequest_operatormobile: operatorMobile || "",
        riderequest_mobilenumber: "",
        riderequest_pickupgps: "",
        riderequest_startloc: "",
        riderequest_destination: "",
        riderequest_expstarttime: null, // Use null for DatePickerComponent
        riderequest_vehicletype: null, // For react-select, store the option object
        riderequest_passengerscount: "",
        riderequest_ridefor: "",
        riderequest_ridecontact: "",
        riderequest_generatedtime: null, // Use null for DatePickerComponent
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
    const [isLoadingVehicleTypes, setIsLoadingVehicleTypes] = useState(false);

    useEffect(() => {
        if (operatorMobile) {
            setFormData(prev => ({ ...prev, riderequest_operatormobile: operatorMobile }));
        }
    }, [operatorMobile]);

    useEffect(() => {
        if (isOpen) {
            // Reset form when modal opens, and prefill operatorMobile if available
            setFormData({ ...initialFormState, riderequest_operatormobile: operatorMobile || "" });

            const loadVehicleTypes = async () => {
                setIsLoadingVehicleTypes(true);
                try {
                    const vehicleTypesData = await fetchVehicleTypeList();
                    if (Array.isArray(vehicleTypesData)) {
                        const options = vehicleTypesData.map(typeObj => ({
                            value: typeObj.vehicle_type,
                            label: typeObj.vehicle_type
                        }));
                        setVehicleTypeOptions(options);
                    } else {
                        setVehicleTypeOptions([]);
                    }
                } catch (error) {
                    console.error("Error loading vehicle types in CreateRideRequestModal:", error);
                    toast.error("Could not load vehicle types.");
                    setVehicleTypeOptions([]);
                } finally {
                    setIsLoadingVehicleTypes(false);
                }
            };
            loadVehicleTypes();
        }
    }, [isOpen, operatorMobile]); // Add operatorMobile to ensure it's prefilled if it changes while modal is closed

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, selectedOption) => {
        setFormData(prev => ({ ...prev, [name]: selectedOption }));
    };

    const handleDateChange = (name, date) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.riderequest_operatormobile) {
            toast.error("Operator mobile is required.");
            return;
        }
        setIsLoading(true);
        try {
            const modelData = {
                ...formData,
                riderequest_vehicletype: formData.riderequest_vehicletype?.value || "",
                riderequest_expstarttime: formData.riderequest_expstarttime ? parseDateDMY(formData.riderequest_expstarttime) : "",
                riderequest_generatedtime: formData.riderequest_generatedtime ? parseDateDMY(formData.riderequest_generatedtime) : parseDateDMY(new Date()), // Default to now if not set
            };
            const rideRequestInstance = new RideRequestModel(modelData);
            await createRideRequest(rideRequestInstance);
            toast.success("Ride request created successfully!");
            if (onSaveSuccess) {
                onSaveSuccess();
            }
            onClose();
        } catch (error) {
            console.error("Failed to create ride request:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to create ride request.");
        } finally {
            setIsLoading(false);
        }
    };

    // Define fields for the form
    const fields = [
        { name: 'riderequest_occname', label: 'OCC Name', required: true },
        { name: 'riderequest_mobilenumber', label: 'Customer Mobile', type: 'tel', required: true },
        { name: 'riderequest_pickupgps', label: 'Pickup GPS (lat,lng)', placeholder: "e.g., 12.9716,77.5946" },
        { name: 'riderequest_startloc', label: 'Start Location', required: true },
        { name: 'riderequest_destination', label: 'Destination', required: true },
        { name: 'riderequest_passengerscount', label: 'Passengers Count', type: 'number', required: true },
        { name: 'riderequest_ridefor', label: 'Ride For', placeholder: "e.g., Self, Other" },
        { name: 'riderequest_ridecontact', label: 'Ride Contact (if other)', type: 'tel' },
    ];

    return (
<BaseModal isOpen={isOpen} onClose={onClose} size="lg">
  <form onSubmit={handleSubmit}>
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-xl font-semibold textPrimary">Create New Ride Request</h3>
      <button type="button" onClick={onClose} className="text-gray-600 hover:text-black">
        <X className="w-5 h-5" />
      </button>
    </div>
    <hr className="mb-4" />

    <div className="max-h-[70vh] overflow-y-auto pr-1 mb-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Operator Mobile */}
        <div className="flex flex-col">
          <label htmlFor="riderequest_operatormobile" className="text-sm font-medium text-gray-700 mb-1">
            Operator Mobile <span className="text-red-500">*</span>
          </label>
          <InputField
            name="riderequest_operatormobile"
            value={formData.riderequest_operatormobile}
            onChange={handleChange}
            disabled
            required
            placeholder='Operator Mobile'
          />
        </div>

        {/* Other fields */}
        {fields.map(({ name, label, type, placeholder, required }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <InputField
              name={name}
              type={type || 'text'}
              placeholder={placeholder || label}
              value={formData[name]}
              onChange={handleChange}
              required={required}
            />
          </div>
        ))}

        {/* Vehicle Type */}
        <div className="flex flex-col">
          <label htmlFor="riderequest_vehicletype" className="text-sm font-medium text-gray-700 mb-1">
            Vehicle Type <span className="text-red-500">*</span>
          </label>
          <Select
            name="riderequest_vehicletype"
            options={vehicleTypeOptions}
            value={formData.riderequest_vehicletype}
            isLoading={isLoadingVehicleTypes}
            onChange={(option) => handleSelectChange("riderequest_vehicletype", option)}
            placeholder="Select vehicle type"
            className="react-select"
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          />
        </div>

        {/* Expected Start Time */}
        <div className="flex flex-col">
          <label htmlFor="riderequest_expstarttime" className="text-sm font-medium text-gray-700 mb-1">
            Expected Start Time <span className="text-red-500">*</span>
          </label>
          <DatePickerComponent
            name="riderequest_expstarttime"
            selected={formData.riderequest_expstarttime}
            onChange={(date) => handleDateChange("riderequest_expstarttime", date)}
            showTimeSelect
            dateFormat="Pp"
            required
             placeholderText='Start Time'
          />
        </div>

        {/* Generated Time */}
        <div className="flex flex-col">
          <label htmlFor="riderequest_generatedtime" className="text-sm font-medium text-gray-700 mb-1">
            Generated Time (Optional)
          </label>
          <DatePickerComponent
            name="riderequest_generatedtime"
            selected={formData.riderequest_generatedtime}
            onChange={(date) => handleDateChange("riderequest_generatedtime", date)}
            showTimeSelect
            dateFormat="Pp"
            placeholderText='Generated Time'
          />
        </div>
      </div>
    </div>

    <div className="mt-3 flex justify-end gap-3">
      <ButtonLight type="button" onClick={onClose} disabled={isLoading} variant="outlined">
        Cancel
      </ButtonLight>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Request'}
      </Button>
    </div>
  </form>
</BaseModal>


    );
};

