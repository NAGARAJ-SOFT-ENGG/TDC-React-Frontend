import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { fetchRideDetails } from '@services';
import { toast } from 'react-toastify';

const tabs = ['Ride', 'Driver', 'Vehicle', 'Operator', 'Customer'];

const getDisplayValue = (value, fallback = "N/A") => value || fallback;

export const TrackingDetails = ({ activeTab, setActiveTab, rideId }) => {
  const [rideDetails, setRideDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (rideId) {
      setIsLoading(true);
      setError(null);
      fetchRideDetails(rideId)
        .then(response => {
          if (response) {
            setRideDetails(response);
          } else {
            throw new Error("Ride details not found.");
          }
        })
        .catch(err => {
          setError(err.message || "Failed to fetch ride details.");
          toast.error(err.message || "Failed to fetch ride details.");
          console.error("Error fetching ride details:", err);
        })
        .finally(() => setIsLoading(false));
    } else {
      setRideDetails(null);
    }
  }, [rideId]);

  return (
    <div className="lg:flex-[1] p-4 flex flex-col min-h-0 overflow-y-auto">
      <div className="relative mb-3 justify-around flex overflow-x-auto gap-x-12">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={classNames(
              'py-2 px-4 text-sm textPrimary relative whitespace-nowrap',
              activeTab === tab ? 'text-icon' : 'text-gray-500'
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto space-y-4 mt-4">
        {isLoading && <div className="text-center p-4">Loading ride details...</div>}
        {error && <div className="text-center p-4 text-red-500">Error: {error}</div>}
        {!isLoading && !error && !rideDetails && rideId && (
          <div className="text-center p-4 textSecondary">No details available for the selected ride.</div>
        )}
        {!isLoading && !error && !rideId && (
          <div className="text-center p-4 textSecondary">Select a ride from the list to see details.</div>
        )}

        {rideDetails && (
          <>
            {activeTab === 'Ride' && rideDetails.ride && (
              <div className="grid grid-cols-1 sm:grid-cols-3 text-left sm:text-center gap-4">
                <div><p className="textPrimary ">Pickup</p><p className="textSecondary">{getDisplayValue(rideDetails.ride.pickup)}</p></div>
                <div><p className="textPrimary ">Drop</p><p className="textSecondary">{getDisplayValue(rideDetails.ride.drop)}</p></div>
                <div><p className="textPrimary ">Kilometers</p><p className="textSecondary">{getDisplayValue(rideDetails.ride.kilometer)} km</p></div>
              </div>
            )}

            {activeTab === 'Driver' && rideDetails.driver && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center text-left sm:text-center">
                <div className="col-span-1">
                  {rideDetails.driver.driver_selfie ? (
                    <img src={rideDetails.driver.driver_selfie} alt="Driver" className="w-24 h-24 object-cover rounded-md mx-auto" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded-md mx-auto flex items-center justify-center textSecondary">No Image</div>
                  )}
                </div>
                <div><p className="textPrimary ">Name</p><p className="textSecondary">{getDisplayValue(rideDetails.driver.driver_name)}</p></div>
                <div><p className="textPrimary ">Mobile</p><p className="textSecondary">{getDisplayValue(rideDetails.driver.driver_mobile)}</p></div>
                <div><p className="textPrimary ">Rating</p><p className="textSecondary">{getDisplayValue(rideDetails.driver.driver_rating)} ⭐</p></div>
              </div>
            )}

            {activeTab === 'Vehicle' && rideDetails.vehicle && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center text-left sm:text-center">
                <div className="col-span-1"><div className="w-16 h-16 bg-gray-300 rounded-md mx-auto flex items-center justify-center textSecondary">Vehicle Img</div></div>
                <div><p className="textPrimary ">Number</p><p className="textSecondary">{getDisplayValue(rideDetails.vehicle.vehicle_number)}</p></div>
                <div><p className="textPrimary ">Model</p><p className="textSecondary">{getDisplayValue(rideDetails.vehicle.vehicle_model)}</p></div>
                <div><p className="textPrimary ">Type</p><p className="textSecondary">{getDisplayValue(rideDetails.vehicle.vehicle_type)}</p></div>
                {/* Vehicle rating seems to be missing from the provided API response for vehicle, using placeholder */}
                {/* <div><p className="textSecondary font-medium">Rating</p><p className="textSecondary">{getDisplayValue(rideDetails.vehicle.vehicle_rating)} ⭐</p></div> */}
              </div>
            )}

            {activeTab === 'Operator' && rideDetails.operator && (
              <div className="grid grid-cols-1 sm:grid-cols-3 text-left sm:text-center gap-4">
                <div><p className="textPrimary ">Name</p><p className="textSecondary">{getDisplayValue(rideDetails.operator.operator_name)}</p></div>
                <div><p className="textPrimary ">Mobile</p><p className="textSecondary">{getDisplayValue(rideDetails.operator.operator_mobile)}</p></div>
                <div><p className="textPrimary ">Executive</p><p className="textSecondary">{getDisplayValue(rideDetails.operator.opexecutive_mobile)}</p></div>
              </div>
            )}

            {activeTab === 'Customer' && rideDetails.customer && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 text-left sm:text-center gap-4">
                <div><p className="textPrimary ">Customer Name</p><p className="textSecondary">{getDisplayValue(rideDetails.customer.rider_name)}</p></div>
                <div><p className="textPrimary ">Mobile</p><p className="textSecondary">{getDisplayValue(rideDetails.customer.rider_mobile)}</p></div>
                <div><p className="textPrimary ">Booking Date</p><p className="textSecondary">{getDisplayValue(rideDetails.customer.booking_date)}</p></div>
                <div><p className="textPrimary ">Ride Date</p><p className="textSecondary">{getDisplayValue(rideDetails.customer.ride_date)}</p></div>
                <div><p className="textPrimary ">Channel</p><p className="textSecondary">{getDisplayValue(rideDetails.customer.channel)}</p></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
