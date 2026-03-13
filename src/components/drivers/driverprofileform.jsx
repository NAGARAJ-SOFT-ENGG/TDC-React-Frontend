import React, { useState } from 'react';
import { InputField } from '@components';
import { TextareaField } from '@components';
import { CountryStateCityPicker } from '@components';
import { Button } from '@components';
// import { AVATAR } from '@assets';

export const DriverProfileForm = ({ formData, onInputChange, onFileChange, onNext }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onInputChange(name, value);
    };

    const handleFileSelected = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            onFileChange(name, files[0]);
        }
    };

    const handleLocationChange = (updatedValues) => {
        // For CountryStateCityPicker, it returns an object like { country: 'IN' } or { state: 'TN' }
        // We need to call onInputChange for each key in updatedValues
        Object.keys(updatedValues).forEach(key => {
            onInputChange(key, updatedValues[key]);
        });
    };

    const handleSubmit = (e) => { // This now just calls onNext
        e.preventDefault();
        if (onNext) onNext();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full mx-auto p-4 space-y-2 overflow-y-auto max-h-[500px] scroll-hide"
        >

            {/* Driver Image Upload */}
            <div className="flex flex-col items-center mb-4">
                <label htmlFor="driver_image" className="cursor-pointer">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-primary transition">
                        {formData.driver_image ? (
                            <img src={URL.createObjectURL(formData.driver_image)} alt="Driver" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span className="text-gray-400 text-sm">Upload Image</span>
                        )}
                    </div>
                </label>
                <input type="file" id="driver_image" name="driver_image" accept="image/*" className="hidden" onChange={handleFileSelected} />
                {formData.driver_image && <span className="text-xs text-gray-500 mt-1">{formData.driver_image.name}</span>}
            </div>


            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField name="name" placeholder="Driver Name" value={formData.name} onChange={handleChange} required />
                <InputField name="email" placeholder="Driver Email" type="email" value={formData.email} onChange={handleChange} required />
                <InputField name="mobile" placeholder="Driver Mobile" type="tel" value={formData.mobile} onChange={handleChange} required />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* Address Section */}
            <h3 className="text-primary font-semibold">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Address + Pincode */}
                <div className="flex flex-col gap-4">
                    <TextareaField
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="min-h-[6rem]"
                    />
                    <InputField
                        name="pincode"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Right Column: Country, State, City */}
                <div className="flex flex-col gap-4">
                    <CountryStateCityPicker
                        render="country"
                        value={formData.country}
                        onChange={handleLocationChange}
                    />
                    <CountryStateCityPicker
                        render="state"
                        value={formData.state}
                        countryValue={formData.country}
                        onChange={handleLocationChange}
                    />
                    <CountryStateCityPicker
                        render="city"
                        value={formData.city}
                        countryValue={formData.country}
                        stateValue={formData.state}
                        onChange={handleLocationChange}
                    />
                </div>
            </div>

            {/* Submit */}
            <div className="text-end mt-4">
                <Button type="submit">Next</Button>
            </div>
        </form>
    );
};
