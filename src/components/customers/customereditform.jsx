import React, { useState, useEffect } from 'react';
import { InputField, TextareaField, Button, CountryStateCityPicker, ButtonLight } from '@components';
import { CustomerModel } from '@/models';
import { updateCustomerProfile } from '@services';
import { fetchCustomerProfile } from '@services'; // Service to fetch details
import { toast } from 'react-toastify';
import { useAuth } from '@hooks';

export const CustomerEditForm = ({ customerMobileForEdit, onCancel, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
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
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { authData } = useAuth();

    const defaultOperatorMobile = authData?.operator_mobile || import.meta.env.VITE_ENTRY_OPERATOR_MOBILE;

    // Fetch customer details when customerMobileForEdit changes
    useEffect(() => {
        if (customerMobileForEdit) {
            const loadProfile = async () => {
                setIsLoading(true);
                setErrors({});
                try {
                    const response = await fetchCustomerProfile(customerMobileForEdit);
                    if (response && response.customer) {
                        const customerData = response.customer;
                        setFormData({
                            customer_name: customerData.customer_name || '',
                            customer_mobile: customerData.customer_mobile || '', // This field should be read-only
                            customer_email: customerData.customer_email || '',
                            gender: customerData.gender || '',
                            primary_address: customerData.primary_address || '',
                            city: customerData.city || '',
                            state: customerData.state || '',
                            country: customerData.country || '',
                            pincode: customerData.pincode || '',
                            channel: customerData.channel || '',
                            base_gps_loc: customerData.base_gps_loc || '',
                            role_name: customerData.role_name || '',
                            operator_mobile: customerData.operator_mobile || defaultOperatorMobile,
                        });
                    } else {
                        toast.error("Failed to load customer details for editing.");
                        onCancel(); // Optionally close form if data can't be loaded
                    }
                } catch (error) {
                    toast.error("Error loading customer details.");
                    console.error("Error fetching customer profile for edit:", error);
                    onCancel(); // Optionally close form
                } finally {
                    setIsLoading(false);
                }
            };
            loadProfile();
        }
    }, [customerMobileForEdit, defaultOperatorMobile, onCancel]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleLocationChange = (updatedValues) => {
        setFormData(prev => ({ ...prev, ...updatedValues }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.customer_name.trim()) newErrors.customer_name = 'Customer Name is required.';
        // customer_mobile is key, usually not editable. If it is, add validation.
        // Add other validations as needed
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // Ensure pincode is an integer
            const submissionData = {
                ...formData,
                pincode: formData.pincode ? parseInt(formData.pincode, 10) : 0,
            };
            const customerToUpdate = new CustomerModel(submissionData);
            await updateCustomerProfile(customerToUpdate);
            toast.success(`Customer ${formData.customer_name} profile updated successfully!`);
            if (onSaveSuccess) {
                onSaveSuccess();
            }
        } catch (error) {
            console.error('Failed to update customer profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !formData.customer_name) return <div className="p-4 text-center">Loading customer data...</div>; // Show loading if fetching initial data

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full mx-auto p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] scroll-hide" // Adjust max-h as needed
        >
            <h2 className="text-lg font-semibold textPrimary mb-3">Edit Customer Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField name="customer_name" placeholder="Customer Name" value={formData.customer_name} onChange={handleChange} required error={errors.customer_name} />
                <InputField name="customer_mobile" placeholder="Customer Mobile" type="tel" value={formData.customer_mobile} onChange={handleChange} required readOnly error={errors.customer_mobile} />
                <InputField name="customer_email" placeholder="Customer Email" type="email" value={formData.customer_email} onChange={handleChange} error={errors.customer_email} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} error={errors.gender} />
                <InputField name="channel" placeholder="Channel" value={formData.channel} onChange={handleChange} error={errors.channel} />
                <InputField name="role_name" placeholder="Role Name" value={formData.role_name} onChange={handleChange} readOnly error={errors.role_name} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField name="operator_mobile" placeholder="Operator Mobile" value={formData.operator_mobile} onChange={handleChange} readOnly error={errors.operator_mobile} />
                <InputField name="base_gps_loc" placeholder="Base GPS Location" value={formData.base_gps_loc} onChange={handleChange} error={errors.base_gps_loc} />
            </div>

            <div className="border-t border-gray-300 my-4" />

            <h3 className="text-icon textPrimary">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                    <TextareaField name="primary_address" placeholder="Primary Address" value={formData.primary_address} onChange={handleChange} className="min-h-[5rem]" error={errors.primary_address} />
                    <InputField name="pincode" placeholder="Pincode" type="number" value={formData.pincode} onChange={handleChange} error={errors.pincode} />
                </div>
                <div className="flex flex-col gap-4">
                    <CountryStateCityPicker render="country" value={formData.country} onChange={handleLocationChange} />
                    <CountryStateCityPicker render="state" value={formData.state} countryValue={formData.country} onChange={handleLocationChange} isDisabled={!formData.country} />
                    <CountryStateCityPicker render="city" value={formData.city} countryValue={formData.country} stateValue={formData.state} onChange={handleLocationChange} isDisabled={!formData.state} />
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <ButtonLight type="button" onClick={onCancel} variant="outlined" disabled={isLoading}>
                    Cancel
                </ButtonLight>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
            </div>
        </form>
    );
};