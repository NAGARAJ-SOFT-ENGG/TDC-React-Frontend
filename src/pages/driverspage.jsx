import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { TriCard } from '@components';
import { FaSearch } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { DriversListView, DriverOnboarding, AnimatedTabPanel } from '@components';
import { fetchAssociatedDrivers } from '@services';
import { useAuth } from '@hooks';
import { Button } from '../components';

export const DriversPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [driverSummary, setDriverSummary] = useState({ active: 0, suspend: 0, in_progress: 0 });
  const { authData } = useAuth();

  const OperatorMobile = authData.operator_mobile

  const loadDrivers = useCallback(async () => {
    if (!OperatorMobile) {
      console.error("Operator Mobile not found. Cannot fetch drivers.");
      setIsLoadingDrivers(false);
      setDrivers([]);
      return;
    }
    console.log("[DriversPage] Loading drivers for operator:", OperatorMobile);
    setIsLoadingDrivers(true);
    try {
      // Assuming fetchAssociatedDrivers from operatorservices.jsx returns the array directly
      const driversArray = await fetchAssociatedDrivers(OperatorMobile);
      console.log("[DriversPage] API Response Data (drivers array):", driversArray);
      if (Array.isArray(driversArray)) {
        setDrivers(driversArray);
        // Calculate summary for TriCard
        const summary = driversArray.reduce((acc, driver) => {
          if (driver.active_flag === 1) acc.active++;
          else if (driver.active_flag === 2) acc.suspend++;
          else if (driver.active_flag === 3) acc.in_progress++;
          return acc;
        }, { active: 0, suspend: 0, in_progress: 0 });
        setDriverSummary(summary);
      } else {
        setDrivers([]);
        setDriverSummary({ active: 0, suspend: 0, in_progress: 0 });
      }
    } catch (error) {
      console.error("[DriversPage] Failed to fetch drivers:", error);
      setDrivers([]);
      setDriverSummary({ active: 0, suspend: 0, in_progress: 0 });
    } finally {
      setIsLoadingDrivers(false);
    }
  }, [OperatorMobile]);

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  console.log("[DriversPage] 'drivers' state before filtering:", drivers);

  const handleTriCardFilter = (label) => {
    setSelectedStatus(label === selectedStatus ? null : label);
  };

  const statusMap = {
    'Active': 1,
    'Suspend': 2,
    'In Progress': 3,
  };

  const filteredDrivers = drivers.filter(driver => {
    const searchTermLower = searchTerm.toLowerCase();
    const nameMatch = driver.driver_name?.toLowerCase().includes(searchTermLower);
    const mobileMatch = driver.driver_mobile?.toLowerCase().includes(searchTermLower);
    const vehicleMatch = driver.vehicle_assigned?.toLowerCase().includes(searchTermLower);

    const matchesSearchTerm = nameMatch || mobileMatch || vehicleMatch;
    const matchesStatus = selectedStatus ? driver.active_flag === statusMap[selectedStatus] : true;

    return matchesSearchTerm && matchesStatus;
  });
  console.log("[DriversPage] 'filteredDrivers' after filtering:", filteredDrivers);

  // Use driverSummary for TriCard values
  const triCardValues = [driverSummary.in_progress || 0, driverSummary.active || 0, driverSummary.suspend || 0];

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <div className='flex justify-between mb-4 mt-2'>
            <div><h2 className="textPrimary font-bold text-xl mb-4">Drivers</h2></div>
            <div>
              <Button onClick={() => setShowForm((prev) => !prev)}>
                {showForm ? 'Close' : '+ Add Driver'}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2 gap-4 flex-wrap">
            <motion.div
              className="flex-grow max-w-full"
            >
              <TriCard
                values={triCardValues}
                selectedLabel={selectedStatus}
                onSelect={handleTriCardFilter}
              />
            </motion.div>

            {/* Right side: Search input + icons */}
            <div className="flex items-center gap-1 relative">
              <motion.input
                type="text"
                placeholder="Search"
                className="border border-gray-300 p-2 rounded-l-md focus:outline-none focus:border-primary font-secondary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                initial={{ width: 0, opacity: 0 }}
                animate={searchOpen ? { width: 200, opacity: 1 } : { width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 1 }} // anchor scale from right
              />

              {/* Search icon button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className=" text-icon rounded-r-md hover:bg-primary-dark transition flex items-center justify-center"
                aria-label={searchOpen ? 'Close search' : 'Open search'}
              >
                <FaSearch />
              </button>

              {/* <button
                className="text-icon text-2xl hover:text-primary-dark transition ml-3"
                aria-label="Toggle Form"
                onClick={() => setShowForm((prev) => !prev)}
              >
                {showForm ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </button> */}

              {/* Upload icon */}
              <button
                className="text-icon ml-2 hover:text-primary-dark transition"
                aria-label="Upload"
              >
                <Upload className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Drivers list below */}
          <div className="w-full">
            {isLoadingDrivers ? (
              <p className="text-center textSecondary p-4">Loading drivers...</p>
            ) : (
              <AnimatePresence mode="wait">
                {showForm ? (
                  <AnimatedTabPanel key="driver-form">
                    <DriverOnboarding
                      operatorMobile={OperatorMobile}
                      onClose={() => setShowForm(false)}
                      onSuccess={loadDrivers} // Refresh list on successful onboarding
                    />
                  </AnimatedTabPanel>
                ) : (
                  <AnimatedTabPanel key="drivers-list">
                    <DriversListView
                      drivers={filteredDrivers}
                      operatorMobile={OperatorMobile}
                      onListRefresh={loadDrivers} // Changed prop name for clarity
                    />
                  </AnimatedTabPanel>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </>
  );
};