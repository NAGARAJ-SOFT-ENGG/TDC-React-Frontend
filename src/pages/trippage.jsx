import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from '@components';
import { useJsApiLoader } from '@react-google-maps/api';
import { TripDetails, TripList, CancelDriverTable, SelectDriver } from '@components';
import { fetchOngoingRideList } from '@services'; // Import the service
import { useAuth } from '@hooks'; // To get operator_mobile

const driverOptions = [
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
];

export const TripsPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Ride');
    const [ongoingRides, setOngoingRides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { authData } = useAuth();
    const operatorMobile = authData?.operator_mobile || import.meta.env.VITE_ENTRY_OPERATOR_MOBILE;

    const GMapApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GMapApiKey,
    });

    useEffect(() => {
        if (operatorMobile) {
            setIsLoading(true);
            setError(null);
            fetchOngoingRideList(operatorMobile)
                .then(response => {
                    setOngoingRides(response?.ongoing_rides || []);
                })
                .catch(err => {
                    setError(err.message || "Failed to fetch ongoing rides.");
                    console.error("Error fetching ongoing rides:", err);
                })
                .finally(() => setIsLoading(false));
        } else {
            setError("Operator mobile not available.");
            setIsLoading(false);
            setOngoingRides([]);
        }
    }, [operatorMobile]);

    const handleDriverAssign = (driver) => {
        console.log('Assigned driver:', driver);
        // Perform any logic like API call here
    };
    if (isLoading) {
        return <div className="p-4 text-center">Loading trips...</div>;
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row w-full h-full gap-4">
                {error && <div className="w-full lg:w-1/3 text-red-500 p-4">Error: {error}</div>}
                {!error && <TripList rides={ongoingRides} />}
                <div className="flex flex-col w-full lg:w-2/3 rounded-md overflow-hidden">
                    <TripDetails
                        card={{
                            startLocation: 'Chennai Central',
                            dropLocation: 'Chennai Airport',
                            pickupGPS: '13.0827, 80.2707',
                            kms: '18.5',
                            passengerCount: '3',
                            requestedDateTime: '2025-06-11 10:30 AM',
                            vehicleType: 'Sedan'
                        }}
                    />

                    <SelectDriver drivers={driverOptions} onAssign={handleDriverAssign} />
                    <CancelDriverTable />
                </div>
            </div>
        </>
    );
};
