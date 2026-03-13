import React, { useState } from 'react';
import { InputField } from '../input';
import { AVATAR } from '@assets'
import { CountryStateCityPicker } from '../countrystatecitypicker';
import { TextareaField, Button } from '@components';
import { FileUploader } from '../FileUploader';
import { onboardOperator } from '@services';
import { OperatorModel } from '@models';


export const OperatorOnboardingForm = () => {
  const [form, setForm] = useState({
    operatorName: '',
    operatorEmail: '',
    operatorMobile: '',
    address: '',
    country: 'IN',
    state: '',
    city: '',
    pincode: '',
    aadharNumber: '',
    panNumber: '',
    gstNumber: '',
    opExecutiveName: '',
    opExecutiveMobile: '',
    gstFile: null,
    profileImage: null,
    aadharFile: null,
    panFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // For file inputs, use the first file (if any)
    if (files && files.length > 0) {
      setForm((prevForm) => ({ ...prevForm, [name]: files[0] }));
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  // const validateForm = () => {
  //   const newErrors = {};
  //   if (!form.operatorName.trim()) newErrors.operatorName = 'Operator Name is required.';
  //   if (!form.operatorEmail.trim()) {
  //     newErrors.operatorEmail = 'Operator Email is required.';
  //   } else if (!/\S+@\S+\.\S+/.test(form.operatorEmail)) {
  //     newErrors.operatorEmail = 'Operator Email is invalid.';
  //   }
  //   if (!form.operatorMobile.trim()) {
  //     newErrors.operatorMobile = 'Operator Mobile is required.';
  //   } else if (!/^\d{10}$/.test(form.operatorMobile)) { // Basic 10-digit validation
  //     newErrors.operatorMobile = 'Operator Mobile must be 10 digits.';
  //   }
  //   if (!form.address.trim()) newErrors.address = 'Address is required.';
  //   if (!form.country) newErrors.country = 'Country is required.'; // Should always have 'IN'
  //   if (!form.state) newErrors.state = 'State is required.';
  //   if (!form.city) newErrors.city = 'City is required.';
  //   if (!form.pincode.trim()) {
  //     newErrors.pincode = 'Pincode is required.';
  //   } else if (!/^\d{6}$/.test(form.pincode)) { // Basic 6-digit validation
  //     newErrors.pincode = 'Pincode must be 6 digits.';
  //   }
  //   if (!form.aadharNumber.trim()) {
  //     newErrors.aadharNumber = 'Aadhar Number is required.';
  //   } // Add more specific Aadhar validation if needed
  //   // PAN is optional, so no validation unless a value is entered, then format check
  //   if (form.panNumber.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber.toUpperCase())) {
  //       newErrors.panNumber = 'PAN Number format is invalid.';
  //   }
  //   // GST Number validation (basic format)
  //   if (form.gstNumber.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.gstNumber.toUpperCase())) {
  //       newErrors.gstNumber = 'GST Number format is invalid.';
  //   }
  //   if (!form.opExecutiveName.trim()) newErrors.opExecutiveName = 'Executive Name is required.';
  //   if (!form.opExecutiveMobile.trim()) newErrors.opExecutiveMobile = 'Executive Mobile is required.';

  //   // File validations (e.g., if required)
  //   // if (!form.profileImage) newErrors.profileImage = 'Profile image is required.';
  //   // if (!form.aadharFile) newErrors.aadharFile = 'Aadhar document is required.';

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0; // Returns true if no errors
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form state:', {
      ...form,
      profileImage: form.profileImage instanceof File ? form.profileImage.name : form.profileImage,
      aadharFile: form.aadharFile instanceof File ? form.aadharFile.name : form.aadharFile,
      panFile: form.panFile instanceof File ? form.panFile.name : form.panFile,
    });

    // if (!validateForm()) {
    //   console.log("Validation failed", errors);
    //   return; // Stop submission if validation fails
    // }

    setIsSubmitting(true);
    try {
      const model = new OperatorModel(form);
      const formData = model.toFormData();

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      let response = await onboardOperator(form);
      console.log('Onboarding successful:', response);
    } catch (error) { // This catch is for API errors
      console.error('Onboarding failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto my-2 p-4 space-y-6 bg-white shadow rounded-md overflow-y-auto max-h-[700px] scroll-hide"
    >
      <h2 className="font-bold text-lg">Operator OnBoarding</h2>
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center space-y-4">
        <label htmlFor="profileImageInput" className="cursor-pointer">
          <div className="w-20 h-20 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center">
            {form.profileImage ? (
              <img
                src={URL.createObjectURL(form.profileImage)}
                alt="Operator"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={AVATAR} // Default placeholder avatar
                alt="Upload Operator"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </label>
        <input
          type="file"
          id="profileImageInput"
          name="profileImage" // Matches form state key and model expectation
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        <span className="textSecondary">Upload Operator Image</span>
      </div>
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField name="operatorName" placeholder="Operator Name" value={form.operatorName} onChange={handleChange} error={errors.operatorName} required />
        <InputField name="operatorEmail" placeholder="Operator Email" type="email" value={form.operatorEmail} onChange={handleChange} error={errors.operatorEmail} required />
        <InputField name="operatorMobile" placeholder="Operator Mobile" type="tel" value={form.operatorMobile} onChange={handleChange} error={errors.operatorMobile} required />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 my-4"></div>

      <h3 className="text-primary font-semibold">Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address spans rows 1 and 2, left column */}
        <div className="w-full md:col-start-1 md:row-start-1 md:row-span-2">
          <TextareaField
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange} // Consider if TextareaField needs an error prop too
            required
            className="min-h-[6.5rem] w-full textSecondary"
          />
        </div>

        {/* Country, right column, row 1 */}
        <div className="w-full md:col-start-2 md:row-start-1">
          <CountryStateCityPicker
            value={form.country}
            onChange={(newVal) => setForm((prev) => ({ ...prev, ...newVal }))}
            // Consider adding error display for CountryStateCityPicker if needed
            render="country"
          />
        </div>

        {/* Pincode, left column, row 3 */}
        <div className="w-full md:col-start-1 md:row-start-3">
          <InputField
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            error={errors.pincode}
            onChange={handleChange}
            required
          />
        </div>

        {/* State, right column, row 2 */}
        <div className="w-full md:col-start-2 md:row-start-2">
          <CountryStateCityPicker
            value={form.state}
            onChange={(newVal) => setForm((prev) => ({ ...prev, ...newVal }))}
            render="state"
            // error={errors.state}
            countryValue={form.country}
          />
        </div>

        {/* City, right column, row 3 */}
        <div className="w-full md:col-start-2 md:row-start-3">
          <CountryStateCityPicker
            value={form.city}
            onChange={(newVal) => setForm((prev) => ({ ...prev, ...newVal }))}
            render="city"
            // error={errors.city}
            countryValue={form.country}
            stateValue={form.state}
          />
        </div>
      </div>


      {/* Divider */}
      <div className="border-t border-gray-300 my-4"></div>

      {/* Document Section */}
      <h3 className="text-primary font-semibold mb-4">Documents</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Aadhar */}
        <div>
          <InputField
            name="aadharNumber"
            placeholder="Aadhar Number"
            value={form.aadharNumber}
            // error={errors.aadharNumber}
            onChange={handleChange}
            required
          />
          <FileUploader
            name="aadharFile" // Matches form state key and model expectation
            label="Upload Aadhar"
            // error={errors.aadharFile} // FileUploader would need an error prop
            onChange={handleChange}

          />
        </div>

        {/* PAN */}
        <div>
          <InputField
            name="panNumber"
            placeholder="PAN Number (Optional)"
            value={form.panNumber}
            // error={errors.panNumber}
            onChange={handleChange}
          />
          <FileUploader
            name="panFile" // Matches form state key and model expectation
            label="Upload PAN"
            onChange={handleChange}
          // error={errors.panFile}
          />
        </div>

        {/* GST */}
        <div>
          <InputField
            name="gstNumber"
            placeholder="GST Number"
            value={form.gstNumber}
            // error={errors.gstNumber}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      {/* Executive Section */}
      <h3 className="text-primary font-semibold">Operator Executive</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField name="opExecutiveName" placeholder="Executive Name" value={form.opExecutiveName} onChange={handleChange} error={errors.opExecutiveName} required />
        <InputField name="opExecutiveMobile" placeholder="Executive Mobile" type="tel" value={form.opExecutiveMobile} onChange={handleChange} error={errors.opExecutiveMobile} required />
      </div>
      <div className='text-end'>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>

    </form>
  );
};
