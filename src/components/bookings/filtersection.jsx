import React from 'react';
import { DatePickerComponent } from '@components';
import Select from 'react-select';
import { SearchBar } from '@components';

// const StatusOptions = [ // No longer needed as it will be dynamic
//     { value: 'ongoing', label: 'Ongoing' },
//     { value: 'confirmed', label: 'Confirmed' },
//     { value: 'requested', label: 'Requested' },
//     { value: 'cancelled', label: 'Cancelled' },
//     { value: 'completed', label: 'Completed' },
// ];

export const FilterSection = ({
    search,
    setSearch,
    fromDate,
    setFromDate,
    selectedOperator,
    setSelectedOperator,
    selectedStatus,
    setSelectedStatus,
    operatorOptions = [],
    statusOptions = [], // Default to empty array, will be populated by BookingsPage
}) => {
    const selectStyles = {
        menu: (provided) => ({ ...provided, zIndex: 50 }),
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 items-end w-full mt-5">
            {/* Search Input */}
            <div className="relative w-full lg:w-1/4">
                <SearchBar
                    placeholder="Search"
                    searchTerm={search} // Pass the actual search term string
                    onSearchChange={setSearch} // Changed to pass setSearch directly
                    className="" 
                />
            </div>

            {/* Date Picker */}
            <div className="w-full lg:w-1/4">
                <DatePickerComponent
                    name="selectedDate"
                    placeholderText="Select Date" // Changed 'placeholder' to 'placeholderText'
                    selected={fromDate} // This prop is named fromDate in FilterSection
                    onChange={setFromDate} // This prop is named setFromDate in FilterSection
                />
            </div>

            {/* Operator Select */}
            <div className="w-full lg:w-1/4 textSecondary">
                <Select
                    styles={selectStyles}
                    options={operatorOptions}
                    value={selectedOperator}
                    onChange={setSelectedOperator}
                    placeholder="Select Operator"
                    classNamePrefix={'react-select'}
                    isClearable
                />
            </div>

            {/* Status Select */}
            <div className="w-full lg:w-1/4 textSecondary">
                <Select
                    styles={selectStyles}
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    placeholder="Select Status"
                    isClearable
                    classNamePrefix={'react-select'}
                />
            </div>
        </div>
    );
};
