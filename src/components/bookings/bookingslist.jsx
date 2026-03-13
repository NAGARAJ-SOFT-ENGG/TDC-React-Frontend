import React, { useState } from "react";
import { CustomDataTable } from "@components";
import { FaEye } from "react-icons/fa";
import { BookingDetailModal } from "./bookingdetailsview";
import { toast } from "react-toastify"; // For error notifications

const columns = [
  {
    field: "operator.name",
    header: "Operator",
    sortable: true,
    body: (rowData) => rowData.operator?.name || "N/A",
  },
  { field: "date", header: "Date", sortable: true },
  {
    field: "locations.pickup",
    header: "Pickup",
    body: (rowData) => rowData.locations?.pickup || "N/A",
  },
  {
    field: "locations.drop",
    header: "Drop",
    body: (rowData) => rowData.locations?.drop || "N/A",
  },
  { field: "status", header: "Status", sortable: true },
  { field: "fare", header: "Fare", sortable: true },
  { field: "driver_rating", header: "Driver Rating", sortable: true },
  { field: "vehicle_rating", header: "Vehicle Rating", sortable: true },
];

export const BookingList = ({ data = [] }) => {
  const [selectedRideId, setSelectedRideId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = (rowData) => {
    if (!rowData.ride_id) {
      toast.error("Booking ID is missing to fetch details.");
      return;
    }
    setSelectedRideId(rowData.ride_id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRideId(null);
  };

  return (
    <div className="p-2 bg-white min-h-screen">
      <CustomDataTable
        data={data}
        columns={columns}
        // actions={actionTemplate} // Action column removed
        paginationOptions={{
          rows: 10,
          rowsPerPageOptions: [5, 10, 20],
        }}
        onRowClick={handleViewClick} // Row click now handles viewing details
      />

      <BookingDetailModal
        rideId={selectedRideId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
