import React, { useState } from 'react';
import {
    CarPricingTable,
    Button,
    SearchBar,
    NewCarTypeModal
} from '@components';
import { useAuth } from '@hooks'; // Import the useAuth hook

export const PricingModelPage = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { authData } = useAuth(); // Use the useAuth hook
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // State to trigger table refresh

    const operatorMobile = authData?.operator_mobile

    // This function will be called by the modal on successful save/update/delete
    const handleTariffChangeSuccess = () => {
        setIsModalOpen(false); // Close the modal
        setRefreshKey(prevKey => prevKey + 1); // Increment key to trigger refresh
    };

    return (
<>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="textPrimary font-bold text-xl">Tariff</h2>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="w-full sm:w-[300px]">
                            <SearchBar
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                placeholder="Search Vehicle Type..."
                            />
                        </div>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <span>＋</span> New Tariff
                        </Button>
                    </div>

                    <CarPricingTable 
                        searchTerm={searchTerm} 
                        operatorMobile={operatorMobile} 
                        refreshTrigger={refreshKey} // Pass the refresh trigger to the table
                    />

                    <NewCarTypeModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        operatorMobile = {operatorMobile}
                        onSaveSuccess={handleTariffChangeSuccess} // Pass the success handler
                    />
                    </>
    );
};
