import React, { useState } from 'react';
import { InputField, TextareaField, Button, CountryStateCityPicker } from '@components';
import { CustomerModel } from '@/models'; // Import the model
import { onboardCustomer } from '@services'; // Import the service
import { toast } from 'react-toastify';
import { useAuth } from '@hooks'; // To potentially get operator_mobile

export const CustomerOnboardingForm = ({ onSaveSuccess }) => {
    // Initialize formData state inside the form component
    const initialFormState = {
        customer_name: '',
        customer_mobile: '',
        customer_email: '',
        gender: '',
        primary_address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        channel: '',
        base_gps_loc: '',
        role_name: '',
        operator_mobile: '',
    };
    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({}); // State to hold validation errors
    const { authData } = useAuth();

    const defaultOperatorMobile = authData?.operator_mobile || import.meta.env.VITE_ENTRY_OPERATOR_MOBILE;

    // Handles input and textarea changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for the field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handles Country/State/City picker changes
    const handleLocationChange = (updatedValues) => {
        setFormData(prev => ({ ...prev, ...updatedValues }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.customer_name.trim()) {
            newErrors.customer_name = 'Customer Name is required.';
        }
        if (!formData.customer_mobile.trim()) {
            newErrors.customer_mobile = 'Customer Mobile is required.';
        } else if (!/^\d{10}$/.test(formData.customer_mobile.trim())) { // Basic 10-digit mobile validation
            newErrors.customer_mobile = 'Customer Mobile must be 10 digits.';
        }
        // Add more validations as needed
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Handles form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Stop submission if validation fails

        setIsLoading(true);
        try {
            // Ensure operator_mobile is set, either from form or default
            const submissionData = {
                ...formData,
                operator_mobile: formData.operator_mobile || defaultOperatorMobile,
                pincode: formData.pincode ? parseInt(formData.pincode, 10) : 0,
            };

            const newCustomer = new CustomerModel(submissionData);
            await onboardCustomer(newCustomer);

            // toast.success(`Customer ${formData.customer_name} onboarded successfully!`);
            setFormData(initialFormState); // Reset form
            if (onSaveSuccess) {
                onSaveSuccess(); // Callback to parent, e.g., to refresh a list
            }
            // Optionally close a modal if this form is in one
        } catch (error) {
            console.error('Failed to onboard customer:', error);
            // Error toast is likely handled by apiCall utility
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            noValidate // Add this to disable default browser validation
            className="w-full mx-auto p-4 space-y-2 overflow-y-auto max-h-[500px] scroll-hide"
        >
            <h2 className="text-lg font-semibold textPrimary mb-3">Customer Onboarding</h2>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                    name="customer_name"
                    placeholder="Customer Name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    error={errors.customer_name}
                />
                <InputField
                    name="customer_mobile"
                    placeholder="Customer Mobile"
                    type="tel"
                    value={formData.customer_mobile}
                    onChange={handleChange}
                    required
                    error={errors.customer_mobile}
                />
                <InputField
                    name="customer_email"
                    placeholder="Customer Email"
                    type="email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                    error={errors.customer_email} // Example, add validation if needed
                />
            </div>

            {/* More Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                    name="gender"
                    placeholder="Gender"
                    value={formData.gender}
                    onChange={handleChange}
                    error={errors.gender}
                />
                <InputField
                    name="channel"
                    placeholder="Channel (e.g., WhatsApp, Mobile App)"
                    value={formData.channel}
                    onChange={handleChange}
                    error={errors.channel}
                />
                <InputField
                    name="role_name"
                    placeholder="Role Name"
                    value={formData.role_name}
                    onChange={handleChange}
                    error={errors.role_name}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                    name="operator_mobile"
                    placeholder="Operator Mobile"
                    value={formData.operator_mobile || defaultOperatorMobile} // Pre-fill if available
                    onChange={handleChange}
                    error={errors.operator_mobile}
                />
                <InputField
                    name="base_gps_loc"
                    placeholder="Base GPS Location"
                    value={formData.base_gps_loc}
                    onChange={handleChange}
                    error={errors.base_gps_loc}
                />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-4" />

            {/* Address Info */}
            <h3 className="text-icon textPrimary">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                    <TextareaField
                        name="primary_address"
                        placeholder="Primary Address"
                        value={formData.primary_address}
                        onChange={handleChange}
                        required
                        className="min-h-[6rem]"
                        error={errors.primary_address}
                    />
                    <InputField
                        name="pincode"
                        placeholder="Pincode"
                        type="number"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        error={errors.pincode}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <CountryStateCityPicker
                        render="country"
                        value={formData.country}
                        onChange={handleLocationChange}
                        // error={errors.country} // CountryStateCityPicker might need its own error handling prop
                    />

                    <CountryStateCityPicker
                        render="state"
                        value={formData.state}
                        countryValue={formData.country}
                        onChange={handleLocationChange}
                        isDisabled={!formData.country}
                        // error={errors.state}
                    />

                    <CountryStateCityPicker
                        render="city"
                        value={formData.city}
                        countryValue={formData.country}
                        stateValue={formData.state}
                        onChange={handleLocationChange}
                        isDisabled={!formData.state}     // Disable city picker if no state selected
                        // error={errors.city}
                    />

                </div>
            </div>

            {/* Submit Button */}
            <div className="text-end mt-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
            </div>
        </form>
    );
};
