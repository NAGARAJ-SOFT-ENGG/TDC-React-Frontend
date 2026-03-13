import React, { useState, useEffect } from 'react';
import { InputField, TextareaField, CountryStateCityPicker, Button, DatePickerComponent, ButtonLight } from '@components';
import { FiUploadCloud } from 'react-icons/fi';
import { updateDriverDetails } from '@services'; // Import the service
import { toast } from 'react-toastify'; // Assuming you use react-toastify for notifications
import { DriverModel } from '@models'; // Import the DriverModel

export const DriverUpdateForm = ({ driver, operatorMobile, onCancel, onUpdateSuccess }) => {
    
    console.log("Driverrroooozzzz",driver);
    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        address: '',
        pincode: '',
        country: 'IN',
        state: '',
        city: '',
        licenseType: '',
        licenseNumber: '',
        validFrom: null,
        validTo: null, 
        aadharNumber: '',
        panNumber: '',
        licenseFile: null,
        aadharFile: null,
        panFile: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (driver) {
            const processDateString = (dateString) => {
                if (!dateString) {
                    return null;
                }
                // If dateString is already a Date object, return it
                if (dateString instanceof Date && !isNaN(dateString.getTime())) {
                    return dateString;
                }
                // Attempt to parse "YYYY-MM-DD" string
                if (typeof dateString === 'string') {
                    const parts = dateString.split('-');
                    if (parts.length === 3) {
                        const year = parseInt(parts[0], 10);
                        const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
                        const day = parseInt(parts[2], 10);
                        const localDate = new Date(year, month, day);
                        if (localDate instanceof Date && !isNaN(localDate.getTime())) {
                            return localDate;
                        }
                    }
                }
                return null;
            };

            setForm({
                name: driver.driver_name || '',
                email: driver.driver_email || '',
                mobile: driver.driver_mobile || '',
                address: driver.driver_address || '',
                pincode: driver.driver_pincode || '',
                country: driver.driver_country || 'IN',
                state: driver.driver_state || '',
                city: driver.driver_city || '',
                licenseType: driver.license_type || '',
                licenseNumber: driver.driving_license_number || '',
                validFrom: processDateString(driver.license_valid_from),
                validTo: processDateString(driver.license_valid_upto),
                aadharNumber: driver.aadhar_number || '',
                panNumber: driver.pan_number || '',
                licenseFile: null,
                aadharFile: null,
                panFile: null,
            });
        }
    }, [driver]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ ...form, [name]: files ? files[0] : value });
    };

    const handlePickerChange = (newVal) => {
        setForm((prev) => ({
            ...prev,
            ...newVal,
        }));
    };

    const handleDateChange = (field, date) => {
        setForm((prev) => ({ ...prev, [field]: date }));
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Prepare data for the model, including existing image URLs if no new file is selected
        const modelData = {
            ...form, // Spread current form state
            operator_mobile: operatorMobile,
            // Pass existing image URLs if new files are not provided
            // The DriverModel constructor will handle these if `xxxFile` is null
            driver_image: form.driver_image || driver.driver_image, // Assuming form might have driver_image field
            licence_image: form.licenseFile ? null : driver.licence_image, // Prioritize new file
            aadhar_image: form.aadharFile ? null : driver.aadhar_image,   // Prioritize new file
            pan_image: form.panFile ? null : driver.pan_image,       // Prioritize new file
            // The DriverModel expects field names like 'name', 'email', etc. from the form
            // and will map them to 'driver_name', 'driver_email'.
            // It also expects 'licenseFile', 'aadharFile', 'panFile' for new files.
        };

        // Add original_driver_mobile for backend to identify the record
        // This is not part of DriverModel schema but needed for the API call
        const driverModelInstance = new DriverModel(modelData, operatorMobile);
        const formDataPayload = driverModelInstance.toFormData();
        
        // The API expects `original_driver_mobile` to identify the driver to update.
        // This is not part of the standard DriverModel, so we append it separately.
        formDataPayload.append('original_driver_mobile', driver.driver_mobile);

        try {
            const response = await updateDriverDetails(formDataPayload);
            toast.success(response?.message || 'Driver details updated successfully!');
            if (onUpdateSuccess) onUpdateSuccess();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update driver details.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full mx-auto p-2 space-y-4 max-h-[700px] overflow-y-auto scroll-hide"
        >
            {error && <div className="text-red-500 text-sm bg-red-100 p-2 rounded">{error}</div>}
            {/* Profile Section */}
            <h3 className="text-primary font-semibold">Driver Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField className="textSecondary" name="name" placeholder="Driver Name" value={form.name} onChange={handleChange} required />
                <InputField className="textSecondary" name="email" placeholder="Driver Email" type="email" value={form.email} onChange={handleChange} required />
                <InputField className="textSecondary" name="mobile" placeholder="Driver Mobile" type="tel" value={form.mobile} onChange={handleChange} required />
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            {/* Address Section */}
            <h3 className="text-primary font-semibold">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                    <TextareaField
                    
                        name="address"
                        placeholder="Address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="min-h-[6rem] textSecondary"
                    />
                    <InputField
                    className="textSecondary"
                        name="pincode"
                        placeholder="Pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <CountryStateCityPicker
                        value={form.country}
                        onChange={handlePickerChange}
                        render="country"
                        className="textSecondary"
                    />
                    <CountryStateCityPicker
                        value={form.state}
                        onChange={handlePickerChange}
                        render="state"
                        countryValue={form.country}
                        className="textSecondary"
                    />
                    <CountryStateCityPicker
                        value={form.city}
                        onChange={handlePickerChange}
                        render="city"
                        countryValue={form.country}
                        stateValue={form.state}
                        className="textSecondary"
                    />
                </div>

            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-2"></div>

            {/* Document Section */}
            <h3 className="text-primary font-semibold">Driver Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                className="textSecondary"
                    name="licenseType"
                    placeholder="License Type"
                    value={form.licenseType}
                    onChange={handleChange}
                    required
                />
                <InputField
                className="textSecondary"
                    name="licenseNumber"
                    placeholder="License Number"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    required
                />
                <label className=" block cursor-pointer">
                    <input
                        type="file"
                        name="licenseFile"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleChange}
                    />
                    <div className="flex items-center gap-2 textSecondary hover:text-primary transition">
                        <FiUploadCloud className="text-xl text-icon" />
                        <span>Upload License</span>
                    </div>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex flex-col">
  <label className="textSecondary mb-1">Valid From</label>
  <DatePickerComponent
    name="validFrom"
    selected={form.validFrom}
    onChange={(date) => setForm({ ...form, validFrom: date })}
    label="Select start date"
    className="textSecondary"
    
  />
</div>

<div className="flex flex-col">
  <label className="textSecondary mb-1">Valid To</label>
  <DatePickerComponent
    name="validTo"
    selected={form.validTo}
    onChange={(date) => setForm({ ...form, validTo: date })}
    label="Select end date"
    className="textSecondary"
  />
</div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aadhar */}
                <div>
                    <InputField
                    className="textSecondary"
                        name="aadharNumber"
                        placeholder="Aadhar Number"
                        value={form.aadharNumber}
                        onChange={handleChange}
                        required
                    />
                    <label className="mt-2 block cursor-pointer">
                        <input
                            type="file"
                            name="aadharFile"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={handleChange}
                        />
                        <div className="flex items-center gap-2 textSecondary hover:text-primary transition">
                            <FiUploadCloud className="text-xl text-icon" />
                            <span>Upload Aadhar</span>
                        </div>
                    </label>
                </div>

                {/* PAN */}
                <div>
                    <InputField
                        className="textSecondary"
                        name="panNumber"
                        placeholder="PAN Number"
                        value={form.panNumber}
                        onChange={handleChange}
                        required
                    />
                    <label className="mt-2 block cursor-pointer">
                        <input
                            type="file"
                            name="panFile"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={handleChange}
                        />
                        <div className="flex items-center gap-2 textSecondary hover:text-primary transition">
                            <FiUploadCloud className="text-xl text-icon" />
                            <span>Upload PAN</span>
                        </div>
                    </label>
                </div>
            </div>

            <div className=" flex justify-end gap-8 mt-4">
                 <ButtonLight onClick={onCancel} type="button" disabled={isLoading}>Cancel</ButtonLight>
                <Button type="submit" isLoading={isLoading} disabled={isLoading}>Update Driver</Button>
            </div>
        </form>
    );
};
