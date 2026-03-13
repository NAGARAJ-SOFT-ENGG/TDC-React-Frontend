import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, ShieldCheck, UserX } from 'lucide-react';
import { filterData } from '@utils';
import { CustomDataTable } from '@components';
import { EditUserModal } from './edituser'; // Import EditUserModal
import { UserDeactivatePopup } from './userdeactivatepopup'; // Import Deactivate Popup
import { fetchUserList, updateUserActivationStatus } from '@services';
import { toast } from 'react-toastify';

export const UsersTable = ({ searchTerm, refreshTrigger, operatorMobile }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState(null); // Renamed for clarity
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);

    const loadUsers = async (currentOperatorMobile) => {
        if (!currentOperatorMobile) {
            // Don't set an error here if it's just initially undefined.
            // The parent (UsersPage) can show a loading state.
            // setError("Operator Mobile is required to fetch users."); 
            setIsLoading(false);
            setUsers([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const usersData = await fetchUserList(currentOperatorMobile); // Service already returns the array
            setUsers(usersData || []); // Directly use the returned array
        } catch (err) {
            setError(err.message || 'Failed to fetch users.');
            setUsers([]);
            console.error("Error fetching users:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(operatorMobile);
    }, [refreshTrigger, operatorMobile]);

    const userColumns = [
        { field: 'name', header: 'Name' },
        { field: 'user_name', header: 'Username' },
        { field: 'operator_mobile', header: 'Operator Mobile' },
        { field: 'role_name', header: 'Role' },
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
                    statusText = 'Suspend';
                    statusColorClass = 'bg-red-100 text-red-700';
                } else if (rowData.active_flag === 3) {
                    statusText = 'In Progress';
                    statusColorClass = 'bg-yellow-100 text-yellow-700';
                }
                return (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColorClass}`}>
                        {statusText}
                    </span>
                );
            },
        },
    ];

    const searchableFields = ['name', 'user_name', 'role_name', 'operator_mobile'];
    const filteredData = filterData(users, searchTerm, searchableFields);

    const handleEditClick = (row) => {
        setSelectedUserForEdit(row);
        setIsEditModalOpen(true);
    };

    const openDeletePopup = (row) => {
        setRowToDelete(row);
        setIsDeletePopupOpen(true);
    };
    const handleConfirmDeactivate = async () => {
        if (!rowToDelete || !rowToDelete.user_name) {
            toast.error("Cannot deactivate: Username is missing.");
            setIsDeletePopupOpen(false);
            setRowToDelete(null);
            return;
        }
        try {
            const payload = {
                name: rowToDelete.name,
                user_name: rowToDelete.user_name,
                operator_mobile: rowToDelete.operator_mobile,
                active_flag: 0, // 0 for deactivation
            };
            await updateUserActivationStatus(payload);
            toast.success(`User ${rowToDelete.name} deactivated successfully.`);
            loadUsers(operatorMobile); // Refresh the list
        } catch (err) {
            toast.error(err.message || `Failed to deactivate user ${rowToDelete.name}.`);
            console.error("Error deactivating user:", err);
        } finally {
            setIsDeletePopupOpen(false);
            setRowToDelete(null);
        }
        setIsDeletePopupOpen(false);
        setRowToDelete(null);
    };

    if (isLoading) return <div className="p-4 text-center">Loading users...</div>;
    // Only show error if it's a fetch error, not the initial "operator mobile required"
    if (error && error !== "Operator Mobile is required to fetch users.") {
        return <div className="p-4 text-center text-red-600">Error: {error}</div>;
    }
    // If users haven't loaded because operatorMobile wasn't ready, and not actively loading/error.
    if (!operatorMobile && users.length === 0 && !isLoading && !error) return <div className="p-4 text-center text-gray-500">Waiting for operator information...</div>;

    return (
        <div>
            <CustomDataTable
                keyField="user_name" // Assuming user_name is unique
                data={filteredData}
                columns={userColumns}
                actions={(rowData) => (
                    <div className="flex items-center gap-2">
                        {/* <button onClick={() => handleEditClick(rowData)} className="text-icon hover:text-textCta" title="Edit"><Pencil className="w-4 h-4" /></button> */}
                        <button onClick={() => openDeletePopup(rowData)} className="text-icon hover:text-textCta" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                )}
                paginationOptions={false} // Or configure as needed
            />
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                selectedUser={selectedUserForEdit}
                onSaveSuccess={() => { setIsEditModalOpen(false); loadUsers(operatorMobile); }} // Refresh list on save
            />
            <UserDeactivatePopup
                isOpen={isDeletePopupOpen}
                onClose={() => { setIsDeletePopupOpen(false); setRowToDelete(null); }}
                onConfirm={handleConfirmDeactivate}
                userName={rowToDelete?.name}
            />
        </div>
    );
};