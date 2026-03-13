import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react'; // Import Eye, Pencil, and Trash2
import { filterData } from '@utils';
import { CustomDataTable } from '@components';
import { EditPricingModal } from './editpricingmodel';
import { PricingDeletePopup } from './pricingdeletepopup'; // Import the new delete popup
import { PricingDetailModal } from './pricingdetailmodal'; // Import the detail modal
import { getVehiclePricingList, deleteVehiclePricing } from '@services';
import { toast } from 'react-toastify'; // For notifications

export const CarPricingTable = ({ searchTerm, operatorMobile, refreshTrigger }) => { // Added refreshTrigger prop
    const [pricingData, setPricingData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [rowForDetail, setRowForDetail] = useState(null);

    const fetchPricingData = async () => {
        if (!operatorMobile) {
            setError("Operator mobile not provided.");
            setIsLoading(false);
            setPricingData([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await getVehiclePricingList(operatorMobile);
            if (response && response.vehicles) {
                setPricingData(response.vehicles);
            } else {
                setPricingData([]); // Ensure it's an array in case of unexpected response
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch pricing data.');
            console.error("Error fetching pricing data:", err);
            setPricingData([]); // Ensure data is empty on error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPricingData();
    }, [operatorMobile, refreshTrigger]); // Re-fetch if operatorMobile or refreshTrigger changes

    // Columns aligned with the VehiclePricing model and API response
    const carPricingColumns = [
        { field: 'vehicleType', header: 'Vehicle Type', sortable: true }, // from price_vehtype
        { field: 'kmRate', header: 'KM Rate (INR)', sortable: true, body: (rowData) => `₹${rowData.kmRate?.toFixed(2)}` },
        // { field: 'minimumKms', header: 'Min. KMs', sortable: true, body: (rowData) => `${rowData.minimumKms} km` },
        { field: 'driverCharge', header: 'Driver Charge (INR)', sortable: true, body: (rowData) => `₹${rowData.driverCharge?.toFixed(2)}` },
        // { field: 'driverMaxKms', header: 'Driver Max KMs', sortable: true, body: (rowData) => `${rowData.driverMaxKms} km` },
        { field: 'waitingCharges', header: 'Waiting Charges (INR)', sortable: true, body: (rowData) => `₹${rowData.waitingCharges?.toFixed(2)}` },
        // { field: 'petCharges', header: 'Pet Charges (INR)', sortable: true, body: (rowData) => `₹${rowData.petCharges?.toFixed(2)}` },
        // { field: 'discount', header: 'Discount', sortable: true, body: (rowData) => `${(rowData.discount * 100).toFixed(0)}%` },
        // { field: 'timeAddon', header: 'Time Addon', sortable: false }, // Display as is (HH:MM:SS)
        // { field: 'kmsAddon', header: 'KMs Addon', sortable: true, body: (rowData) => `${rowData.kmsAddon} km` },
    ];

    const searchableFields = ['vehicleType'];
    const filteredData = filterData(pricingData, searchTerm, searchableFields);

    const handleEditClick = (row) => {
        setSelectedRow(row);
        setIsEditModalOpen(true);
    };

    const openDeletePopup = (row) => {
        setRowToDelete(row);
        setIsDeletePopupOpen(true);
    };

    const handleViewDetailsClick = (row) => {
        setRowForDetail(row);
        setIsDetailModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!rowToDelete || !operatorMobile || !rowToDelete.vehicleType) {
            toast.error("Cannot delete pricing: Operator or vehicle type is missing.");
            setIsDeletePopupOpen(false);
            setRowToDelete(null);
            return;
        }

        try {
            await deleteVehiclePricing(operatorMobile, rowToDelete.vehicleType);
            toast.success(`Pricing for ${rowToDelete.vehicleType} deleted successfully.`);
            fetchPricingData(); // Refresh the data
        } catch (err) {
            toast.error(err.message || `Failed to delete pricing for ${rowToDelete.vehicleType}.`);
            console.error("Error deleting pricing:", err);
        } finally {
            setIsDeletePopupOpen(false);
            setRowToDelete(null);
        }
    };

    if (isLoading) {
        return <div className="p-4 text-center">Loading pricing data...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className=''>
            <CustomDataTable
                keyField="id" // Assuming VehiclePricing model has a unique 'id' field
                data={filteredData}
                columns={carPricingColumns}
                onRowClick = {handleViewDetailsClick}
                actions={(rowData) => (
                    <div className="flex items-center gap-2">
                        {/* <button
                            onClick={() => handleViewDetailsClick(rowData)}
                            className="text-icon hover:text-textCta"
                            title="View Details"
                        >
                            <Eye className="w-4 h-4" />
                        </button> */}
                        <button
                            onClick={() => handleEditClick(rowData)}
                            className="text-icon hover:text-textCta"
                            title="Edit"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => openDeletePopup(rowData)}
                            className="text-icon"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
                paginationOptions={false}
            />

            {/* Edit Modal */}
            <EditPricingModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                selectedRow={selectedRow} // Pass the initially selected row
                onSaveSuccess={fetchPricingData} // Callback to refresh data
            />

            {/* Delete Confirmation Popup */}
            <PricingDeletePopup
                isOpen={isDeletePopupOpen}
                onClose={() => { setIsDeletePopupOpen(false); setRowToDelete(null); }}
                onConfirm={handleConfirmDelete}
                vehicleType={rowToDelete?.vehicleType}
            />

            {/* Detail Modal */}
            <PricingDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                pricing={rowForDetail}
            />
        </div>
    );
};
