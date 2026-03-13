import React, { useState } from 'react';
import Select from 'react-select';
import { Button } from '@components';
import { toast } from 'react-toastify';

export const SelectDriver = ({ drivers = [], onAssign }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);

  const handleAssign = () => {
    if (selectedDriver) {
      onAssign(selectedDriver);
    } else {
      toast.warn("Please select a driver to assign.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 mt-4">
      <h3 className="text-sm font-semibold mb-3 text-gray-700">Select Driver</h3>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="flex-1 min-w-0">
          <Select
            name="driver"
            options={drivers}
            value={selectedDriver}
            onChange={setSelectedDriver}
            className="react-select"
            classNamePrefix="react-select"
            placeholder="Choose a driver..."
            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
            menuPosition="fixed"
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 })
            }}
            required
          />
        </div>

        <div className="sm:w-auto w-full">
          <Button onClick={handleAssign} className="h-full">
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
};
