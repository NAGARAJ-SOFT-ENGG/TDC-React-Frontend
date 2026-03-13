import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from '@components';
import { useJsApiLoader } from '@react-google-maps/api';
import { TrackingMap, TrackingList, TrackingDetails } from '@components';
import { fetchOngoingRideList } from '@services'; // Import the service
import { useAuth } from '@hooks'; // To get operator_mobile

export const TrackingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Ride');
  const [ongoingRides, setOngoingRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRideId, setSelectedRideId] = useState(null); // To store the ID of the selected ride
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
      setSelectedRideId(null);
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

  const handleSelectRide = (rideId) => {
    setSelectedRideId(rideId);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading tracking data...</div>;
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full h-full gap-4">
        {error ? (
          <div className="w-full lg:w-1/3 text-red-500 ">Error: {error}</div>
        ) : (
          <TrackingList
            rides={ongoingRides}
            onSelectRide={handleSelectRide}
            selectedRideId={selectedRideId}
          />
        )}
        <div className="flex flex-col w-full lg:w-2/3 rounded-md overflow-hidden">
          <TrackingMap isLoaded={isLoaded} />
          <TrackingDetails activeTab={activeTab} setActiveTab={setActiveTab} rideId={selectedRideId} />
        </div>
      </div>
    </>
  );
};
