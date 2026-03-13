  import React, { useState } from "react";
  import { FaUserAlt } from "react-icons/fa";
  import { CustomDataTable } from "@components";
  import { BuddyStatusModal } from "./buddystatuspopup";

  export const BuddyTable = ({ 
    buddies = [], 
    onUpdateBuddy, 
    currentOperatorMobile, 
    currentOperatorName 
  }) => {
    const [selectedBuddy, setSelectedBuddy] = useState(null);

    const columns = [
      { field: "operator_name", header: "Buddy Name", sortable: false },
      { field: "operator_mobile", header: "Buddy Mobile", sortable: false },
     { field: "buddy_operator_priority", header: "Priority", sortable: true },
      { field: "trip_count", header: "Trips with Buddy", sortable: true },
      { field: "revenue", header: "Revenue", sortable: true },
      // { field: "driver_count", header: "Drivers", sortable: true },
      // { field: "vehicle_count", header: "Vehicles", sortable: true },
    ];

    const getBuddyStatusColor = (active_flag) => {
      switch (active_flag) {
        case 1:
          return 'text-textActive';
        case 2:
          return 'text-textInactive';
        case 3:
          return 'text-textWarn';
        default:
          return 'text-gray-300'; // Using text-gray-300 as 'grey' is often 'gray' in Tailwind
      }
    };

    const actionTemplate = (rowData) => (
      <div className="flex gap-3 items-center">
        <FaUserAlt
          className={`cursor-pointer ${getBuddyStatusColor(rowData.active_flag)}`}
          onClick={() => {
            console.log("[BuddyTable] FaUserAlt clicked, rowData:", rowData);
            setSelectedBuddy(rowData);
          }}
        />
      </div>
    );

    console.log("[BuddyTable] Rendering. Selected Buddy State:", selectedBuddy);
    return (
      <div className="p-4">
        <CustomDataTable
          data={buddies}
          columns={columns}
          actions={actionTemplate}
          paginationOptions={{ rows: 10, rowsPerPageOptions: [ 10, 20] }}
        />

        {selectedBuddy && (
          <BuddyStatusModal
            isOpen={!!selectedBuddy}
            buddy={selectedBuddy}
            maxPriority={buddies.length > 0 ? buddies.length : 1}
            currentOperatorMobile={currentOperatorMobile}
            currentOperatorName={currentOperatorName}
            onClose={() => {
              console.log("[BuddyTable] BuddyStatusModal onClose called. Setting selectedBuddy to null.");
              setSelectedBuddy(null); 
            }}
            onUpdate={(updatedDataFromModal) => {
              console.log("[BuddyTable] BuddyStatusModal onUpdate called with:", updatedDataFromModal);
              if (onUpdateBuddy) {
                onUpdateBuddy(updatedDataFromModal); 
              } else {
                console.warn("[BuddyTable] onUpdateBuddy prop is missing.");
              }
              setSelectedBuddy(null); 
            }}
          />
        )}
      </div>
    );
  };
