import React, { useState } from 'react';
import { SearchBar, Button, LookupRadiusTable, AddLookupRadius } from '@components';

export const LookupRadiusPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleAddLookupRadiusSuccess = () => {
        setIsModalOpen(false);
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <h2 className="textPrimary font-bold text-xl mb-4">Lookup Radius</h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="w-full sm:w-[300px]">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Search Lookup Radius..."
                    />
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <span>＋ </span>
                    Add Lookup Radius
                </Button>
            </div>

            <LookupRadiusTable searchTerm={searchTerm} refreshTrigger={refreshKey} />

            {/* Lookup Radius Configuration Modal (Placeholder) */}
            <AddLookupRadius
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSaveSuccess={handleAddLookupRadiusSuccess}
            />

        </>
    );
};
