import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { filterData } from '@utils';
import { CustomDataTable } from '@components';
import { EditLookupRadiusModal } from './editlookupradius'; // Import EditLookupRadiusModal
import { LookupRadiusDeactivatePopup } from './lookupradiusdeactivatepopup'; // Import Deactivate Popup
import { fetchLookupRadiusList, updateLookupRadiusStatus } from '@services';
import { toast } from 'react-toastify';

export const LookupRadiusTable = ({ searchTerm, refreshTrigger }) => {
    const [lookupRadii, setLookupRadii] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRadiusForEdit, setSelectedRadiusForEdit] = useState(null); // Renamed
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);

    const loadLookupRadii = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const lookupRadiusData = await fetchLookupRadiusList(); // Service already returns the array
            // Assign a temporary unique ID for table key, as operator_mobile can be non-unique
            const processedData = (lookupRadiusData || []).map((item, index) => ({
                ...item,
                id: `${item.operator_mobile}_${index}` // Temporary unique ID
            }));
            setLookupRadii(processedData);
        } catch (err) {
            setError(err.message || 'Failed to fetch lookup radii.');
            setLookupRadii([]);
            console.error("Error fetching lookup radii:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLookupRadii();
    }, [refreshTrigger]);

    const lookupRadiusColumns = [
        { field: 'operator_mobile', header: 'Operator Mobile' },
        { field: 'operator_radius1', header: 'Radius 1 (km)' },
        { field: 'operator_radius2', header: 'Radius 2 (km)' },
        { field: 'operator_radius3', header: 'Radius 3 (km)' },
    ];

    const searchableFields = ['operator_mobile'];
    const filteredData = filterData(lookupRadii, searchTerm, searchableFields);

    const handleEditClick = (row) => {
        setSelectedRadiusForEdit(row);
        setIsEditModalOpen(true);
    };

    const openDeletePopup = (row) => {
        setRowToDelete(row);
        setIsDeletePopupOpen(true);
    };

    const handleConfirmDeactivate = async () => {
        if (!rowToDelete || !rowToDelete.operator_mobile) {
            // toast.error("Cannot deactivate: Operator mobile is missing.");
            setIsDeletePopupOpen(false);
            setRowToDelete(null);
            return;
        }
        try {
            const payload = {
                operator_mobile: rowToDelete.operator_mobile,
                active_flag: 0, // 0 for deactivation
            };
            await updateLookupRadiusStatus(payload);
            // toast.success(`Lookup radius for ${rowToDelete.operator_mobile} deactivated successfully.`);
            loadLookupRadii(); // Refresh the list
        } catch (err) {
            // toast.error(err.message || `Failed to deactivate lookup radius for ${rowToDelete.operator_mobile}.`);
            console.error("Error deactivating lookup radius:", err);
        } finally {
            setIsDeletePopupOpen(false);
            setRowToDelete(null);
        }
        setIsDeletePopupOpen(false);
        setRowToDelete(null);
    };

    if (isLoading) return <div className="p-4 text-center">Loading lookup radii...</div>;
    if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;

    return (
        <div>
            <CustomDataTable
                keyField="id" // Use the temporary unique id
                data={filteredData}
                columns={lookupRadiusColumns}
                actions={(rowData) => (
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleEditClick(rowData)} className="text-icon hover:text-textCta" title="Edit"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => openDeletePopup(rowData)} className="text-icon hover:text-textCta" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                )}
                paginationOptions={false}
            />
            <EditLookupRadiusModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                selectedRadius={selectedRadiusForEdit}
                onSaveSuccess={() => { setIsEditModalOpen(false); loadLookupRadii(); }}
            />
            <LookupRadiusDeactivatePopup
                isOpen={isDeletePopupOpen}
                onClose={() => { setIsDeletePopupOpen(false); setRowToDelete(null); }}
                onConfirm={handleConfirmDeactivate}
                operatorMobile={rowToDelete?.operator_mobile}
            />
        </div>
    );
};