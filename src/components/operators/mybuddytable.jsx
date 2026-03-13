import { CustomDataTable } from "@components";
export const MyBuddyTable = ({ myBuddies = [] }) => {

  const columns = [
    { field: "buddyoperator_name", header: "Name", sortable: false },
    { field: "buddy_operator_priority", header: "Priority", sortable: true },
    { field: "buddyoperator_mobile", header: "Mobile", sortable: false },
    { field: "trip_count", header: "Trip Shared", sortable: true },
    { field: "revenue", header: "Revenue", sortable: true },
  ];

  return (
    <div className="p-4">
      <CustomDataTable
        data={myBuddies}
        columns={columns}
        paginationOptions={{ rows: 10, rowsPerPageOptions: [ 10, 20] }}
      />
    </div>
  );
};
