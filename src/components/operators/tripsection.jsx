import React from 'react';
import { TripCard } from './tripcard';

// Mapper function to transform raw trip data into the format expected by TripCard
const mapTripDataToCard = (trip, sectionKey) => {
  const card = { 
    pickup: 'N/A', drop: 'N/A', channel: 'N/A', 
    name: 'N/A', mobile: 'N/A', vehicleNumber: 'N/A', 
    vehicleType: 'N/A', vehicleModel: 'N/A' 
  };

  if (sectionKey === 'my_trips' || sectionKey === 'managed_by_tdc') {
    const { location, driver } = trip;
    if (location) {
      card.pickup = location.pickup || 'N/A';
      card.drop = location.drop || 'N/A';
      card.channel = location.channel || 'N/A';
    }
    if (driver) {
      card.name = driver.name || 'N/A';
      card.mobile = driver.mobile || 'N/A';
      card.vehicleNumber = driver.vehicle_number || 'N/A';
      card.vehicleType = driver.vehicle_type || 'N/A';
      card.vehicleModel = driver.vehicle_model || 'N/A';
    }
  } else if (sectionKey === 'shared_with_buddy') {
    const locationData = trip.locations?.[0] || trip.location;
    const driverData = trip.drivers?.[0] || trip.driver;
    if (locationData) {
      card.pickup = locationData.pickup || 'N/A';
      card.drop = locationData.drop || 'N/A';
      card.channel = locationData.channel || 'N/A';
    }
    if (driverData) {
      card.name = driverData.name || 'N/A';
      card.mobile = driverData.mobile || 'N/A';
      card.vehicleNumber = driverData.vehicle_number || 'N/A';
      card.vehicleType = driverData.vehicle_type || 'N/A';
      card.vehicleModel = driverData.vehicle_model || 'N/A';
    }
  } else if (sectionKey === 'shared_by_buddy') {
    const locationData = trip.locations?.[0];
    const driverData = trip.drivers?.[0];
    if (locationData) {
      card.pickup = locationData.pickup || 'N/A';
      card.drop = locationData.drop || 'N/A';
      card.channel = locationData.channel || 'N/A';
    }
    if (driverData) {
      card.name = driverData.name || 'N/A';
      card.mobile = driverData.mobile || 'N/A';
      card.vehicleNumber = driverData.vehicle_number || 'N/A';
      card.vehicleType = driverData.vehicle_type || 'N/A';
      card.vehicleModel = driverData.vehicle_model || 'N/A';
    }
  }
  return card;
};

const SECTION_CONFIGS = [
  { key: 'my_trips', title: 'My Live Trips' },
  { key: 'shared_with_buddy', title: 'Shared With Buddy' },
  { key: 'shared_by_buddy', title: 'Shared By Buddy' },
  { key: 'managed_by_tdc', title: 'Managed By TDC' },
];

export const TripSections = ({
  liveTripsData, // Changed from tripSections and tripCardData
  openCards,
  onToggleCard
}) => {
  const populatedSections = SECTION_CONFIGS.map(config => {
    const rawTrips = liveTripsData && liveTripsData[config.key];
    if (rawTrips && rawTrips.length > 0) {
      return {
        ...config,
        cards: rawTrips.map(trip => mapTripDataToCard(trip, config.key)),
      };
    }
    return null;
  }).filter(Boolean); // Remove nulls for sections with no data or if liveTripsData is not yet populated

  if (populatedSections.length === 0) {
    return (
      <div className="p-4">
        <h2 className="textPrimary mb-2">No Live Trips Available</h2>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-6">
        {populatedSections.map(({ key, title, cards }) => (
          <div key={key}>
            <h2 className="textPrimary mb-2">{title}</h2>
            <div className="space-y-1 max-h-80 overflow-y-auto pr-2 scroll-hide">
              {cards.map((card, idx) => {
                const cardKey = `${key}-${idx}`;
                const isOpen = openCards[cardKey];
                return (
                  <TripCard
                    key={cardKey}
                    card={card}
                    isOpen={isOpen}
                    onToggle={() => onToggleCard(key, idx)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
