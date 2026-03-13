import React, { useState, useEffect } from 'react';
import { InputField } from '../input';
import { AVATAR } from '@assets';
import { FiUploadCloud } from 'react-icons/fi';
import { CountryStateCityPicker } from '../countrystatecitypicker';
import { Button, TextareaField, ButtonLight } from '@components';
import { fetchOperatorProfile } from '@services';
import { Country, State } from "country-state-city"; // Import Country and State
export const UpdateOperatorForm = ({ operatorMobile, onSubmit, onCancel }) => {
    const [form, setForm] = useState({
        operatorName: '',
        operatorEmail: '',
        operatorMobile: '',
        address: '',
        operatorBusiness: '',
        country: 'India',
        state: '',
        city: '',
        pincode: '',
        aadharNumber: '',
        panNumber: '',
        gstNumber: '',
        opExecutiveName: '',
        opExecutiveMobile: '',
        aadharImage: null,
        panImage: null,
        profileImage: null,
    });
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [isLoadingForm, setIsLoadingForm] = useState(true);

    useEffect(() => {

        const loadOperatorData = async () => {
            console.log("[UpdateOperatorForm useEffect] operatorMobile prop value:", operatorMobile); // <-- Add this line
            if (!operatorMobile) {
                setIsLoadingForm(false);
                return;
            }
            setIsLoadingForm(true);
            try {
                const data = await fetchOperatorProfile(operatorMobile);
                console.log("[UpdateOperatorForm useEffect] Fetched operator data:", data); // <-- Modify this line for clarity
                const op = data.operator; 

                if (op) {
                    let countryName = 'India'; // Default
                    let stateName = '';    // Default
                    let cityName = op.city || ''; // Assume city is usually a name

                    if (op.country) {
                        const apiCountryValue = String(op.country).trim();
                        const countryObjFromAPI = Country.getAllCountries().find(
                            c => c.isoCode.toLowerCase() === apiCountryValue.toLowerCase() ||
                                 c.name.toLowerCase() === apiCountryValue.toLowerCase()
                        );
                        if (countryObjFromAPI) {
                            countryName = countryObjFromAPI.name; // Use canonical name

                            if (op.state && countryObjFromAPI.isoCode) {
                                const apiStateValue = String(op.state).trim();
                                const stateObjFromAPI = State.getStatesOfCountry(countryObjFromAPI.isoCode).find(
                                    s => s.isoCode.toLowerCase() === apiStateValue.toLowerCase() ||
                                         s.name.toLowerCase() === apiStateValue.toLowerCase()
                                );
                                if (stateObjFromAPI) {
                                    stateName = stateObjFromAPI.name; // Use canonical name
                                }
                            }
                        }
                    }

                    setForm({
                        operatorName: op.operator_name || '',
                        operatorBusiness: op.operator_business || '',
                        operatorEmail: op.email_id || '',
                        operatorMobile: op.operator_mobile || op.Mobile_Number || '',
                        address: op.primary_address?.trim() || '',
                        country: countryName,
                        state: stateName,
                        city: cityName,
                        pincode: op.pincode || '',
                        aadharNumber: op.aadhar_number || '',
                        panNumber: op.pan_number || '',
                        gstNumber: op.gst_number || '',
                        profileImage: op.operator_image_url || op.operator_image || null,
                        aadharImage: op.aadhar_image_url || op.aadhar_image || null,
                        panImage: op.pan_image_url || op.pan_image || null,
                        // opExecutiveName and opExecutiveMobile are commented out in your JSX, ensure they are handled if needed
                    });
                    console.log("[UpdateOperatorForm useEffect] Form state set with:", { country: countryName, state: stateName, city: cityName });

                    if (op.operator_image_url || op.operator_image) {
                        setProfileImagePreview(op.operator_image_url || op.operator_image);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch operator profile for update form:", error);
            } finally {
                setIsLoadingForm(false);
            }
        }
        loadOperatorData();
    }, [operatorMobile]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const file = files[0];
            setForm((prev) => ({ ...prev, [name]: file }));

            if (name === 'profileImage') {
                setProfileImagePreview(URL.createObjectURL(file));
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(form);
    };

    if (isLoadingForm) {
        return <div className="w-full md:w-2/3 p-4 text-center textSecondary">Loading operator details...</div>;
    }

    return (
        <form
            onSubmit={handleFormSubmit}
            className="w-full mx-auto my-2 p-4 space-y-6 bg-white shadow rounded-md overflow-y-auto max-h-[700px] scroll-hide"
        >
            <h2 className="font-bold text-lg">Update Operator Details</h2>

            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden">
                    {profileImagePreview ? (
                        <img
                            src={profileImagePreview} // Use the preview state
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={AVATAR} // Fallback to default avatar
                            alt="Default Avatar"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <label className="cursor-pointer text-primary hover:underline">
                    Upload Profile Image
                    <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                    />
                </label>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                    name="operatorName"
                    placeholder="Operator Name"
                    value={form.operatorName}
                    onChange={handleChange}
                    required
                />
                {/* <InputField
                    name="operatorBusiness"
                    placeholder="Operator Business"
                    value={form.operatorBusiness}
                    onChange={handleChange}
                    // required // Make required based on your needs
                /> */}

                <InputField
                    name="operatorEmail"
                    placeholder="Operator Email"
                    value={form.operatorEmail}
                    onChange={handleChange}
                    required
                />
                <InputField
                    name="operatorMobile"
                    placeholder="Operator Mobile"
                    value={form.operatorMobile}
                    onChange={handleChange}
                    //disabled 
                    required
                />
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            <h3 className="text-primary font-semibold">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full md:col-start-1 md:row-start-1 md:row-span-2">
                    <TextareaField
                        name="address"
                        placeholder="Address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="min-h-[6.5rem] w-full"
                    />
                </div>

                <div className="w-full md:col-start-2 md:row-start-1">
                    <CountryStateCityPicker
                        value={form.country}
                        onChange={(newVal) => setForm((prev) => ({ ...prev, ...newVal }))}
                        render="country"
                    />
                </div>

                <div className="w-full md:col-start-1 md:row-start-3">
                    <InputField
                        name="pincode"
                        placeholder="Pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="w-full md:col-start-2 md:row-start-2">
                    <CountryStateCityPicker
                        value={form.state}
                        onChange={(newVal) => setForm((prev) => ({ ...prev, ...newVal }))}
                        render="state"
                        countryValue={form.country}
                    />
                </div>

                <div className="w-full md:col-start-2 md:row-start-3">
                    <CountryStateCityPicker
                        value={form.city}
                        onChange={(newVal) => setForm((prev) => ({ ...prev, ...newVal }))}
                        render="city"
                        countryValue={form.country}
                        stateValue={form.state}
                    />
                </div>
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            <h3 className="text-primary font-semibold mb-4">Documents</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Aadhar */}
                <div>
                    <InputField
                        name="aadharNumber"
                        placeholder="Aadhar Number"
                        value={form.aadharNumber}
                        onChange={handleChange}
                        required
                    />
                    <label className="cursor-pointer flex items-center gap-2 mt-2 textSecondary hover:text-primary transition">
                        <input
                            type="file"
                            name="aadharImage"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                        <FiUploadCloud className="text-xl text-icon" />
                        <span>Upload Aadhar</span>
                    </label>
                </div>

                {/* PAN */}
                <div>
                    <InputField
                        name="panNumber"
                        placeholder="PAN Number"
                        value={form.panNumber}
                        onChange={handleChange}
                        required
                    />
                    <label className="cursor-pointer flex items-center gap-2 mt-2 textSecondary hover:text-primary transition">
                        <input
                            type="file"
                            name="panImage"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                        <FiUploadCloud className="text-xl text-icon" />
                        <span>Upload PAN</span>
                    </label>
                </div>

                {/* GST */}
                <div>
                    <InputField
                        name="gstNumber"
                        placeholder="GST Number"
                        value={form.gstNumber}
                        onChange={handleChange}
                        required
                    />
                    {/* No upload for GST here */}
                </div>
            </div>


            {/* <div className="border-t border-gray-300 my-4"></div>

            <h3 className="text-primary font-semibold">Operator Executive</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="opExecutiveName"
                    placeholder="Executive Name"
                    value={form.opExecutiveName}
                    onChange={handleChange}
                //required
                />
                <InputField
                    name="opExecutiveMobile"
                    placeholder="Executive Mobile"
                    value={form.opExecutiveMobile}
                    onChange={handleChange}
                //required
                />
            </div> */}
            <div className="flex justify-end gap-4 mt-4">
                <ButtonLight type="button" variant="outline" onClick={onCancel}>Cancel</ButtonLight>
                <Button type="submit">Update</Button>
            </div>
        </form>
    );
};
