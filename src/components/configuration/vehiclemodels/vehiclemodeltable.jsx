import React, { useState, useEffect } from 'react';
import { Pencil, Trash2  } from 'lucide-react';
import { filterData } from '@utils';
import { CustomDataTable } from '@components';
import { EditVehicleModelPopup } from './editvehiclemodel'; // Assuming it's in the same directory
import { VehicleModelDeletePopup } from './vehiclemodeldeletepopup'; // Import the new delete popup
import { fetchVehicleModelList, deleteVehicleModel } from '@services'; // Import deleteVehicleModel
import { toast } from 'react-toastify'; // For notifications
import { usePermissions } from '@hooks'; // Import usePermissions hook
import { PERMISSIONS } from '@configs'; // Import PERMISSIONS

export const VehicleModelTable = ({ searchTerm, refreshTrigger }) => {
    const [vehicleModels, setVehicleModels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
     const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);

    const { can } = usePermissions(); // Get the 'can' function

    const loadVehicleModels = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchVehicleModelList();
            setVehicleModels(response?.vehicle_models || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch vehicle models.');
            setVehicleModels([]);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const loadVehicleModels = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchVehicleModelList();
                if (response && response.vehicle_models) {
                    setVehicleModels(response.vehicle_models);
                } else {
                    setVehicleModels([]);
                    console.warn("Received unexpected response structure for vehicle models:", response);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch vehicle models.');
                console.error("Error fetching vehicle models:", err);
                setVehicleModels([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadVehicleModels();
    }, [refreshTrigger]); // Add refreshTrigger to the dependency array

    const vehicleModelColumns = [
        { field: 'vehicle_make', header: 'Make' },
        { field: 'vehicle_model', header: 'Model' },
        { field: 'model_year', header: 'Year' },
        { field: 'vehicle_seating_capacity', header: 'Seating Capacity' },
        { field: 'misc_details', header: 'Misc Details', body: (rowData) => rowData.misc_details || '-' },
        { field: 'vehicle_type', header: 'Vehicle Type' },
    ];

    const searchableFields = ['vehicle_make', 'vehicle_model', 'vehicle_type'];
    const filteredData = filterData(vehicleModels, searchTerm, searchableFields);

    const handleEditClick = (row) => {
        setSelectedRow(row);
        setIsEditModalOpen(true);
    };

    const openDeletePopup = (row) => {
        setRowToDelete(row);
        setIsDeletePopupOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!rowToDelete || !rowToDelete.vehicle_model) {
            toast.error("Cannot delete: Vehicle model name is missing.");
            setIsDeletePopupOpen(false);
            setRowToDelete(null);
            return;
        }

        try {
            await deleteVehicleModel(rowToDelete.vehicle_model);
            toast.success(`Vehicle model ${rowToDelete.vehicle_model} deleted successfully.`);
            loadVehicleModels(); // Refresh the data
        } catch (err) {
            toast.error(err.message || `Failed to delete vehicle model ${rowToDelete.vehicle_model}.`);
            console.error("Error deleting vehicle model:", err);
        } finally {
            setIsDeletePopupOpen(false);
            setRowToDelete(null);
        }
    };


    if (isLoading) {
        return <div className="p-4 text-center">Loading vehicle models...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className=''>
            <CustomDataTable
                keyField="vehicle_model_id" // Use the unique ID from the API
                data={filteredData}
                columns={vehicleModelColumns}
                actions={(rowData) => (
                    (can(PERMISSIONS.EDIT_VEHICLE_MODEL) || can(PERMISSIONS.DELETE_VEHICLE_MODEL)) && (
                        <div className="flex items-center gap-2">
                            {can(PERMISSIONS.EDIT_VEHICLE_MODEL) && (
                                <button
                                    onClick={() => handleEditClick(rowData)}
                                    className="text-icon hover:text-textCta"
                                    title="Edit"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            )}
                            {can(PERMISSIONS.DELETE_VEHICLE_MODEL) && (
                                <button
                                    onClick={() => openDeletePopup(rowData)}
                                    className="text-icon hover:text-textCta"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )
                )}
                paginationOptions={false}
            />

            <EditVehicleModelPopup
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                selectedRow={selectedRow}
                onSaveSuccess={loadVehicleModels}
            />
              <VehicleModelDeletePopup
                isOpen={isDeletePopupOpen}
                onClose={() => { setIsDeletePopupOpen(false); setRowToDelete(null); }}
                onConfirm={handleConfirmDelete}
                vehicleModelName={rowToDelete?.vehicle_model}
            />
        </div>
    );
};
