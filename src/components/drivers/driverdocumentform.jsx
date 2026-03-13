import React, { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { Button, ButtonLight, DatePickerComponent, InputField} from '@components'

export const DriverDocumentForm = ({ formData, onInputChange, onFileChange, onDateChange, onSubmit, onBack, isLoading }) => {
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            onFileChange(name, files[0]);
        } else {
            onInputChange(name, value);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
    };

    return (
        <form
            onSubmit={handleFormSubmit}
            className="w-full mx-auto p-2 space-y-6 max-h-[600px] overflow-y-auto scroll-hide"
        >

            {/* License Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="licenseType"
                    placeholder="License Type"
                    value={formData.licenseType}
                    onChange={handleChange}
                    required
                />
                <InputField
                    name="licenseNumber"
                    placeholder="License Number"
                    value={formData.licenseNumber}
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
                        <span>{formData.licenseFile ? formData.licenseFile.name : 'Upload License'}</span>
                    </div>
                </label>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="flex flex-col">
    <label className="textSecondary mb-1">Valid From</label>
    <DatePickerComponent
  selected={formData.validFrom}
  onChange={(date) => onDateChange('validFrom', date)}
  placeholderText="Select start date"
/>
  </div>

  <div className="flex flex-col">
    <label className="textSecondary mb-1">Valid To</label>
    <DatePickerComponent
  selected={formData.validTo}
  onChange={(date) => onDateChange('validTo', date)}
  placeholderText="Select end date"
/>
  </div>
</div>

            {/* Document Numbers + Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aadhar */}
                <div>
                    <InputField
                        name="aadharNumber"
                        placeholder="Aadhar Number"
                        value={formData.aadharNumber}
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
                            <span>{formData.aadharFile ? formData.aadharFile.name : 'Upload Aadhar'}</span>
                        </div>
                    </label>
                </div>

                {/* PAN */}
                <div>
                    <InputField
                        name="panNumber"
                        placeholder="PAN Number"
                        value={formData.panNumber}
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
                            <span>{formData.panFile ? formData.panFile.name : 'Upload PAN'}</span>
                        </div>
                    </label>
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
                {onBack && (
                    <ButtonLight type="button" variant="outline" onClick={onBack} disabled={isLoading}>
                        Back
                    </ButtonLight>
                )}
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
            </div>
        </form>
    );
};
