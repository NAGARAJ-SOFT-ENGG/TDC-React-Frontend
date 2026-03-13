import React, { useState, useEffect } from 'react';
import { Barplot, Sidebar, Header, BookingList, FilterSection } from '@components';
import { fetchBookingList } from '@services'; // Import the service
import { useAuth } from '@hooks'; // To get operator_mobile
import { filterData as applySearchFilter } from '@utils'; // Import and alias your filter utility

export const BookingsPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedOperator, setSelectedOperator] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const [allBookings, setAllBookings] = useState([]);
    const [bookingSummary, setBookingSummary] = useState({});
    const [chartData, setChartData] = useState([]);
    const [operatorOptions, setOperatorOptions] = useState([]);
    const [dynamicStatusOptions, setDynamicStatusOptions] = useState([]); // New state for dynamic statuses
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { authData } = useAuth();
    const operatorMobile = authData?.operator_mobile || import.meta.env.VITE_ENTRY_OPERATOR_MOBILE;

    useEffect(() => {
        if (operatorMobile) {
            setIsLoading(true);
            setError(null);
            fetchBookingList(operatorMobile)
                .then(response => {
                    const bookings = response?.bookings || [];
                    setAllBookings(bookings);
                    setBookingSummary(response?.booking_summary || {});

                    // Transform booking_summary for Barplot
                    const summary = response?.booking_summary || {};
                    const transformedChartData = Object.keys(summary).map(key => ({
                        name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
                        value: summary[key]
                    }));
                    setChartData(transformedChartData);

                    // Derive operator options from fetched bookings (if needed, or use a dedicated endpoint)
                    const uniqueOperators = Array.from(new Set(bookings.map(b => b.operator?.name).filter(Boolean)));
                    setOperatorOptions(uniqueOperators.map(opName => ({ value: opName, label: opName })));

                    // Derive dynamic status options from fetched bookings
                    const uniqueStatuses = Array.from(new Set(bookings.map(b => b.status).filter(Boolean)));
                    setDynamicStatusOptions(uniqueStatuses.map(status => ({ 
                        value: status, 
                        label: status.charAt(0).toUpperCase() + status.slice(1) // Capitalize for display
                    })));
                })
                .catch(err => {
                    setError(err.message || "Failed to fetch bookings.");
                    console.error("Error fetching bookings:", err);
                })
                .finally(() => setIsLoading(false));
        } else {
            setError("Operator mobile not available.");
            setIsLoading(false);
            setAllBookings([]);
            setDynamicStatusOptions([]); // Clear status options if no operator mobile
        }
    }, [operatorMobile]);

    // Apply search filter first using your utility
    const searchedBookings = applySearchFilter(
        allBookings,
        search,
        ['ride_id', 'operator.name', 'status', 'locations.pickup', 'locations.drop'] // Fields to search within
    );

    // Then apply other filters on the result of the search
    const filteredData = searchedBookings.filter((item) => {
        // Search is already handled by applySearchFilter, so matchesSearch is effectively true here
        // if we are operating on `searchedBookings`.
        const itemDateObj = new Date(item.date.split(" ")[0]); // Consider only date part for comparison
        const matchesDate = selectedDate
            ? itemDateObj.toDateString() === selectedDate.toDateString()
            : true;

        const matchesOperator = selectedOperator
            ? item.operator?.name === selectedOperator.value
            : true;

        const matchesStatus = selectedStatus
            ? item.status === selectedStatus.value
            : true;

        return matchesDate && matchesOperator && matchesStatus;
    });

    if (isLoading) {
        return <div className="p-4 text-center">Loading bookings data...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-600">Error: {error}</div>;
    };

    return (
        <>
            <h2 className="textPrimary font-bold text-xl">Bookings</h2>

            <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-2/5">
                    <Barplot data={chartData} /> {/* Use transformed chartData */}
                </div>

                <div className="w-full lg:w-3/5 p-2">

                    <FilterSection
                        search={search}
                        setSearch={setSearch}
                        fromDate={selectedDate}
                        setFromDate={setSelectedDate}
                        selectedOperator={selectedOperator}
                        setSelectedOperator={setSelectedOperator}
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        operatorOptions={operatorOptions}
                        statusOptions={dynamicStatusOptions} // Pass dynamic status options
                    />

                </div>
            </div>

            <div className="mt-2">
                <BookingList data={filteredData} />
            </div>
        </>
    );
};
