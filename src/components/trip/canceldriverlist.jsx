import React from "react";
import { CustomDataTable } from "@components";

const canceldriverlist = [
  {
    driverName: "Ravi Kumar",
    driverMobile: "9876543210",
    distance: "3.5 km",
    location: "12.9716, 77.5946",
    willingness: "Yes",
    confirmation: "No",
  },
  {
    driverName: "Anita Sharma",
    driverMobile: "9123456780",
    distance: "5.2 km",
    location: "12.2958, 76.6394",
    willingness: "No",
    confirmation: "No",
  },
  {
    driverName: "Suresh Menon",
    driverMobile: "9988776655",
    distance: "1.8 km",
    location: "11.0168, 76.9558",
    willingness: "Yes",
    confirmation: "Yes",
  },
   {
    driverName: "jeba Kumar",
    driverMobile: "9876543210",
    distance: "3.5 km",
    location: "12.9716, 77.5946",
    willingness: "Yes",
    confirmation: "No",
  },
   {
    driverName: "shuba Kumar",
    driverMobile: "9876543210",
    distance: "3.5 km",
    location: "12.9716, 77.5946",
    willingness: "Yes",
    confirmation: "No",
  },
];

const columns = [
  { field: "driverName", header: "Driver Name", sortable: true },
  { field: "driverMobile", header: "Driver Mobile", sortable: false },
  { field: "distance", header: "Distance", sortable: true },
  { field: "location", header: "Location (GPS)", sortable: false },
  { field: "willingness", header: "Willingness", sortable: true },
  { field: "confirmation", header: "Confirmation", sortable: true },
];

export const CancelDriverTable = () => {
  return (
    <div className="mt-4">
      <CustomDataTable
        data={canceldriverlist}
        columns={columns}
        paginationOptions={false}
      />
    </div>
  );
};
