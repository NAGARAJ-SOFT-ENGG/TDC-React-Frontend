import React, { useState, useContext } from 'react';
import { SearchBar, Button, UsersTable, AddUserOnboard } from '@components'; // Added AddUserOnboard
import { AuthContext } from '@context'; // Import AuthContext

export const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { authData } = useContext(AuthContext); // Get authData from AuthContext

  const operatorMobileForUsers = authData?.user?.operator_mobile || authData?.operator_mobile; // Adjust based on your authData structure


  const handleAddUserSuccess = () => {
    setIsModalOpen(false);
    setRefreshKey(prevKey => prevKey + 1); // Trigger refresh
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="textPrimary font-bold text-xl mb-4">Users</h2>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="w-full sm:w-[300px]">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search Users..."
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <span>＋ </span>
          Add User
        </Button>
      </div>

      {operatorMobileForUsers ? (
        <UsersTable
          searchTerm={searchTerm}
          refreshTrigger={refreshKey}
          operatorMobile={operatorMobileForUsers}
        />
      ) : (
        <div className="p-4 text-center text-gray-500">Loading user data or operator mobile not available...</div>
      )}

      <AddUserOnboard
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveSuccess={handleAddUserSuccess}
      />

    </>
  );
};