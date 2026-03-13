import React, { Fragment, useState, useEffect } from "react";
import { DialogPanel, Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { fetchBookingDetails } from "@services";
import { toast } from "react-toastify";
import { Button } from "@components";

export const BookingDetailModal = ({ rideId, isOpen, onClose }) => {
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBoxes, setShowBoxes] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowBoxes(false);
      setBookingData(null);
      setError(null);
      return;
    }

    if (!rideId) {
      return;
    }

    const loadBookingDetails = async () => {
      setIsLoading(true);
      setError(null);
      setBookingData(null);
      try {
        const details = await fetchBookingDetails(rideId);
        setBookingData(details);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load booking details.");
        toast.error(err.response?.data?.message || "Failed to load booking details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadBookingDetails();
  }, [isOpen, rideId]);

  const LabelValue = ({ label, value }) => (
    <div className="flex flex-col min-w-[100px]">
      <span className="textSecondary">{label}</span>
      <span className="textSecondary">{value || "-"}</span>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="border-b border-gray-300 pb-2 mb-1">
      <h3 className="text-icon font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />

        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-20">
          <DialogPanel className="w-[80vh] lg:w-[50vw] max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[80vh] overflow-auto rounded-md bg-white px-2 py-1">
            {isLoading && (
              <div className="p-6 text-center text-gray-500">Loading booking details...</div>
            )}
            {error && !isLoading && (
              <div className="p-6 text-center text-red-500">
                Error: {error}
                <Button onClick={onClose} >
                  Close
                </Button>
              </div>
            )}
            {!isLoading && !error && bookingData && (
              <>
                <div className="sticky top-0 z-10 bg-white py-2 flex justify-between items-center border-b border-gray-200 mb-2">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-icon py-1 rounded text-xs font-semibold">
                      Ride Id : {bookingData.ride_id}
                    </span>
                    <span className="text-icon px-3 py-1 rounded text-xs font-semibold">
                      Status : {bookingData.ride_status}
                    </span>
                    <span className="text-icon px-3 py-1 rounded text-xs font-semibold">
                      Time Taken : {bookingData.time_taken}
                    </span>
                  </div>
                  <button onClick={onClose}>
                    <X className="text-gray-500 hover:text-red-500" size={20} />
                  </button>
                </div>

                <Section title="Rider Details">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    <LabelValue label="Rider" value={bookingData.rider?.name} />
                    <LabelValue label="Mobile" value={bookingData.rider?.mobile} />
                    <LabelValue label="Booking Date" value={bookingData.dates?.booking_date} />
                    <LabelValue label="Ride Date" value={bookingData.dates?.ride_date} />
                    <LabelValue label="Channel" value={bookingData.channel} />
                  </div>
                </Section>

                <Section title="Operator Details">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    <LabelValue label="Name" value={bookingData.operator?.name} />
                    <LabelValue label="Mobile" value={bookingData.operator?.mobile} />
                  </div>
                </Section>

                <Section title="Driver Details ">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    <LabelValue label="Name" value={bookingData.driver?.name} />
                    <LabelValue label="Mobile" value={bookingData.driver?.mobile} />
                    <LabelValue label="Rating" value={bookingData.driver?.rating} />
                    {bookingData.driver?.selfie && (
                      <div className="flex flex-col min-w-[100px]">
                        <span className="font-secondary text-xs text-gray-500">Selfie</span>
                        <img
                          src={bookingData.driver.selfie}
                          alt={`${bookingData.driver?.name || 'Driver'} Selfie`}
                          className="w-[80px] h-[60px] rounded object-cover mt-1"
                        />
                      </div>
                    )}
                  </div>
                </Section>

                <Section title="Vehicle Details">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    <LabelValue label="Vehicle Number" value={bookingData.vehicle?.number} />
                    <LabelValue label="Car Name" value={bookingData.vehicle?.name} />
                    <LabelValue label="Car Type" value={bookingData.vehicle?.type} />
                    <LabelValue label="Rating" value={bookingData.vehicle?.rating} />
                  </div>
                </Section>

                <Section title="Ride Details">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    <LabelValue label="Pickup" value={bookingData.locations?.pickup} />
                    <LabelValue label="Drop" value={bookingData.locations?.drop} />
                    {!showBoxes ? (
                      <span
                        className="text-blue-600 underline cursor-pointer text-sm self-end mb-1"
                        onClick={() => setShowBoxes(true)}
                      >
                        View Odometer
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <LabelValue label="Odo. Start" value={bookingData.odometer?.start} />
                        <LabelValue label="Odo. End" value={bookingData.odometer?.end} />
                      </div>
                    )}
                  </div>
                </Section>

                <Section title="Payment Details">
                  <div className="grid grid-cols-2 gap-1">
                    <LabelValue label="Payment Type" value={bookingData.payment?.type} />
                    <LabelValue
                      label="Fare"
                      value={bookingData.payment?.fare !== undefined ? `Rs. ${bookingData.payment.fare}` : "-"}
                    />
                  </div>
                </Section>
              </>
            )}
            {!isLoading && !error && !bookingData && isOpen && (
              <div className="p-6 text-center text-gray-500">No details found for this booking.</div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
};
