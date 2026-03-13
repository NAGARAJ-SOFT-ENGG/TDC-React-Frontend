import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { filterData } from '@utils';
import { CustomDataTable } from '@components';
import { EditVehicleTypeModal } from './editvehicletype'; // Import EditVehicleTypeModal
import { VehicleTypeDeactivatePopup } from './vehicletypedeactivatepopup';
import { fetchVehicleTypeList, suspendVehicleType } from '@services'; // Changed updateVehicleType to suspendVehicleType
import { toast } from 'react-toastify';
import { usePermissions } from '@hooks'; // Import usePermissions hook
import { PERMISSIONS } from '@configs'; // Import PERMISSIONS

export const VehicleTypesTable = ({ searchTerm, refreshTrigger }) => {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVehicleTypeForEdit, setSelectedVehicleTypeForEdit] = useState(null); // Renamed
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);

    const { can } = usePermissions(); // Get the 'can' function

    const loadVehicleTypes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const vehicleTypesData = await fetchVehicleTypeList(); // Service already returns the array
            setVehicleTypes(vehicleTypesData || []); // Directly use the returned array
        } catch (err) {
            setError(err.message || 'Failed to fetch vehicle types.');
            setVehicleTypes([]);
            console.error("Error fetching vehicle types:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVehicleTypes();
    }, [refreshTrigger]);

    const vehicleTypeColumns = [
        { field: 'vehicle_type', header: 'Vehicle Type' },
        { field: 'capacity', header: 'Capacity' },
        { field: 'description', header: 'Description', body: (rowData) => rowData.description || '-' },
        {
            field: 'active_flag',
            header: 'Status',
            body: (rowData) => {
                let statusText = 'Unknown';
                let statusColorClass = 'bg-gray-100 text-gray-700'; // Default
                if (rowData.active_flag === 1) {
                    statusText = 'Active';
                    statusColorClass = 'bg-green-100 text-green-700';
                } else if (rowData.active_flag === 2) {
                    statusText = 'Suspend'; // Assuming 2 means Suspend for vehicle types as well
                    statusColorClass = 'bg-red-100 text-red-700';
                } // Add other statuses if applicable for vehicle types
                return (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColorClass}`}>{statusText}</span>
                );
            },
        },
    ];

    const searchableFields = ['vehicle_type', 'description'];
    const filteredData = filterData(vehicleTypes, searchTerm, searchableFields);

    const handleEditClick = (row) => {
        setSelectedVehicleTypeForEdit(row);
        setIsEditModalOpen(true);
    };

    const openDeletePopup = (row) => {
        setRowToDelete(row);
        setIsDeletePopupOpen(true);
    };

    const handleConfirmDeactivate = async () => {
        if (!rowToDelete || !rowToDelete.vehicle_type) {
            toast.error("Cannot deactivate: Vehicle type name is missing.");
            setIsDeletePopupOpen(false);
            setRowToDelete(null);
            return;
        }
        try {
            const payload = {
                vehicle_type: rowToDelete.vehicle_type,
                active_flag: 0, // 0 for deactivation
            };
            await suspendVehicleType(payload); // Use the new dedicated suspend service
            toast.success(`Vehicle type ${rowToDelete.vehicle_type} deactivated successfully.`);
            loadVehicleTypes(); // Refresh the list
        } catch (err) {
            toast.error(err.message || `Failed to deactivate vehicle type ${rowToDelete.vehicle_type}.`);
            console.error("Error deactivating vehicle type:", err);
        } finally {
            setIsDeletePopupOpen(false);
            setRowToDelete(null);
        }
        setIsDeletePopupOpen(false);
        setRowToDelete(null);
    };

    if (isLoading) return <div className="p-4 text-center">Loading vehicle types...</div>;
    if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;

    return (
        <div>
            <CustomDataTable
                keyField="vehicle_type" // Assuming vehicle_type is unique
                data={filteredData}
                columns={vehicleTypeColumns}
                actions={(rowData) => (
                    (can(PERMISSIONS.EDIT_VEHICLE_TYPE) || can(PERMISSIONS.DEACTIVATE_VEHICLE_TYPE)) && (
                        <div className="flex items-center gap-2">
                            {can(PERMISSIONS.EDIT_VEHICLE_TYPE) && (
                                <button onClick={() => handleEditClick(rowData)} className="text-icon hover:text-textCta" title="Edit">
                                    <Pencil className="w-4 h-4" />
                                </button>
                            )}
                            {can(PERMISSIONS.DEACTIVATE_VEHICLE_TYPE) && (
                                <button
                                    onClick={() => openDeletePopup(rowData)}
                                    className="text-icon hover:text-textCta"
                                    title="Deactivate"> {/* Title changed for clarity */}
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )
                )}
                paginationOptions={false}
            />
            <EditVehicleTypeModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                selectedVehicleType={selectedVehicleTypeForEdit}
                onSaveSuccess={() => { setIsEditModalOpen(false); loadVehicleTypes(); }}
            />
            <VehicleTypeDeactivatePopup
                isOpen={isDeletePopupOpen}
                onClose={() => { setIsDeletePopupOpen(false); setRowToDelete(null); }}
                onConfirm={handleConfirmDeactivate}
                vehicleTypeName={rowToDelete?.vehicle_type}
            />
        </div>
    );
};