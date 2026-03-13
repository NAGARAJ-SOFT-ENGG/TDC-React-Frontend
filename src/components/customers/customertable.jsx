import React, { useState } from 'react';
import { CustomDataTable } from '@components';
import { FaUserAlt, FaEye, FaPencilAlt } from 'react-icons/fa';
import { CustomerStatusModal } from './customerstatuspopup';
import { CustomerDetailModal } from './customerviewpopup';
import { CustomerEditForm } from './customereditform'; // Import the edit form

const columns = [
  { field: 'customer_name', header: 'Name', sortable: true },
  { field: 'customer_mobile', header: 'Mobile', sortable: true },
  { field: 'operator_mobile', header: 'Operator Mobile', sortable: true },
  { field: 'channel', header: 'Channel', sortable: false },
  { field: 'ridecount', header: 'Ride Count', sortable: true },
  { field: 'revenue', header: 'Revenue', sortable: true },
];

export const CustomerTable = ({ customers = [], onDataNeedsRefresh }) => {
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [customerMobileForEdit, setCustomerMobileForEdit] = useState(null);

  const openStatusModal = (customer) => {
    setSelectedCustomer(customer);
    setStatusModalOpen(true);
  };

  const openDetailModal = (customer) => {
    setSelectedCustomer(customer);
    setDetailModalOpen(true);
  };

  const closeStatusModal = () => {
    setSelectedCustomer(null);
    setStatusModalOpen(false);
  };

  const closeDetailModal = () => {
    setSelectedCustomer(null);
    setDetailModalOpen(false);
  };

  const handleEditIconClick = (mobile) => {
    setCustomerMobileForEdit(mobile);
    setShowEditForm(true);
  };

  const handleEditFormCancel = () => {
    setShowEditForm(false);
    setCustomerMobileForEdit(null);
  };

  const handleEditFormSaveSuccess = () => {
    setShowEditForm(false);
    setCustomerMobileForEdit(null);
    if (onDataNeedsRefresh) {
      onDataNeedsRefresh(); // Tell the parent page to refresh the customer list
    }
  };

    const getStatusColor = (activeFlag) => {
    switch (activeFlag) {
      case 1:
        return 'text-textActive'; // Active
      case 2:
        return 'text-textInactive'; // Suspended
      // Case 0 (Delete) is filtered out, so no color needed here for the icon
      default:
        return 'text-gray-400'; // Default or unknown status
    }
  };

  const actionTemplate = (rowData) => (
    <div className="flex justify-start gap-2">
      <FaUserAlt
        className={`${getStatusColor(rowData.active_flag)} cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation(); // Stop the event from bubbling up to the row
          openStatusModal(rowData);
        }}
      />
      <FaPencilAlt
        className="text-icon hover:text-textCta cursor-pointer"
        onClick={(e) => {
          e.stopPropagation(); // Stop the event from bubbling up to the row
          handleEditIconClick(rowData.customer_mobile);
        }}
      />
    </div>
  );

  if (showEditForm && customerMobileForEdit) {
    return (
      <CustomerEditForm
        customerMobileForEdit={customerMobileForEdit}
        onCancel={handleEditFormCancel}
        onSaveSuccess={handleEditFormSaveSuccess}
      />
    );
  }

   const displayCustomers = customers.filter(customer => customer.active_flag !== 0);

  return (
    <div className="p-2 bg-white min-h-screen rounded-md shadow-sm">
      {/* The h2 title for "Customers" is usually in the parent page, not repeated here */}
      <CustomDataTable
        data={displayCustomers}
        columns={columns}
        actions={actionTemplate}
        paginationOptions={{
          rows: 10,
          rowsPerPageOptions: [5, 10, 20],
        }}
        onRowClick={(rowData) => openDetailModal(rowData)} // Add this line
      />

      {/* Modals */}
      <CustomerStatusModal
        isOpen={statusModalOpen}
        onClose={closeStatusModal}
        customer={selectedCustomer}
        onStatusUpdateSuccess={onDataNeedsRefresh} // Pass the refresh handler
      />

      <CustomerDetailModal
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
        customerMobile={selectedCustomer?.customer_mobile}
      />
    </div>
  );
};
