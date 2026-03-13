import React, { useState } from 'react';
import { DriverProfileForm } from './driverprofileform';
import { DriverDocumentForm } from './driverdocumentform';
import { AnimatePresence } from 'framer-motion';
import { AnimatedTabPanel, ButtonLight } from '@components'; // Added Button
import { DriverModel } from '@models/drivermodels'; // Import the model
import { onboardDriver } from '@services'; // Import the service
import { toast } from 'react-toastify'; // For notifications

export const DriverOnboarding = ({ operatorMobile, onClose, onSuccess }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState(DriverModel.getInitialFormState());
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (formName, fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const handleFileChange = (formName, fieldName, file) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: file,
        }));
    };

    const handleDateChange = (formName, fieldName, date) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: date,
        }));
    };

    const handleSubmitAllForms = async () => {
        if (!operatorMobile) {
            toast.error("Operator mobile is not available.");
            return;
        }
        setIsLoading(true);
        try {
            const driverModel = new DriverModel(formData, operatorMobile);
            const payload = driverModel.toFormData();
            await onboardDriver(payload);
            toast.success("Driver onboarded successfully!");
            if (onSuccess) onSuccess(); // Callback for successful onboarding (e.g., refresh list)
            if (onClose) onClose(); // Close the onboarding form/modal
        } catch (error) {
            console.error("Failed to onboard driver:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to onboard driver.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-2 bg-white min-h-screen">
            <h2 className="text-xl font-bold text-center mb-2">Driver Onboarding</h2>

            {/* Tabs container */}
            <div className="flex justify-center mb-2">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`text-sm px-3 py-1 font-medium border-b-2 transition ${activeTab === 'profile'
                        ? 'border-yellow-400 text-yellow-500'
                        : 'border-transparent text-gray-600'
                        }`}
                >
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('document')}
                    className={`text-sm px-3 py-1 font-medium border-b-2 transition ${activeTab === 'document'
                        ? 'border-yellow-400 text-yellow-500'
                        : 'border-transparent text-gray-600'
                        }`}
                >
                    Document
                </button>
            </div>

            {/* Active Tab Content */}
            <AnimatePresence mode='wait'>
                {activeTab === 'profile' ?
                    <AnimatedTabPanel key="driver-profile-form">
                        <DriverProfileForm
                            formData={formData}
                            onInputChange={(fieldName, value) => handleInputChange('profile', fieldName, value)}
                            onFileChange={(fieldName, file) => handleFileChange('profile', fieldName, file)}
                            onNext={() => setActiveTab('document')}
                        />
                    </AnimatedTabPanel> :
                    <AnimatedTabPanel key="driver-document-form">
                        <DriverDocumentForm
                            formData={formData}
                            onInputChange={(fieldName, value) => handleInputChange('document', fieldName, value)}
                            onFileChange={(fieldName, file) => handleFileChange('document', fieldName, file)}
                            onDateChange={(fieldName, date) => handleDateChange('document', fieldName, date)}
                            onSubmit={handleSubmitAllForms}
                            onBack={() => setActiveTab('profile')}
                            isLoading={isLoading}
                        />
                    </AnimatedTabPanel>
                }
            </AnimatePresence>
            {/* {onClose && (
                 <div className="text-center mt-4">
                    <ButtonLight onClick={onClose} variant="outline" disabled={isLoading}>
                        Cancel
                    </ButtonLight>
                </div>
            )} */}
        </div>
    );
};
