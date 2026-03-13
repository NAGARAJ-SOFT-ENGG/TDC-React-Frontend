// components/TrackingMap.jsx
import React from 'react';
import { GoogleMap } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 12.9716,
  lng: 77.5946,
};

export const TrackingMap = ({ isLoaded }) => {
  return (
    <div className="h-64 lg:flex-[2] min-h-0">
      {isLoaded ? (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} />
      ) : (
        <div className="flex items-center justify-center h-full">Loading Map...</div>
      )}
    </div>
  );
};
