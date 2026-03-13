import React, { useState, useEffect, useCallback } from 'react';
import {
  UpdateOperatorForm,
  OperatorProfile,
  VehiclesList,
  DriversList,
  TripSections,
  NavItem,
  ToggleSwitch,
  TriCard,
  OperatorList,
  Header,
  Sidebar,
  OperatorOnboardingForm,
  BuddyTabs,
  AnimatedTabPanel,
  OperatorStatusModal,
  OperatorStatusHandlingModal,
  SearchBar,
  CarPricingTable
} from '@components';
import {
  CircleDot,
  CarFront,
  Users,
  UserCircle,
  Pencil,
  ShieldCheck,
  IndianRupee
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { DROPTAXILOGO } from '@assets';
import { fetchOperatorList, fetchLiveTrips, fetchOperatorProfile, fetchAssociatedDrivers, fetchAssociatedVehicles, fetchOperatorBuddyList, fetchOperatorMyBuddyList, updateOperatorActivationStatus, updateOperatorVerificationStatus, updateOperatorDetails } from '@services'; // Import updateOperatorDetails and fetchOperatorMyBuddyList
import { OperatorModel } from '@models';
import {filterData} from '@utils'
import { X, Plus, Upload } from 'lucide-react';



export const OperatorPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openCards, setOpenCards] = useState({});
  const [activeTab, setActiveTab] = useState('Live Trips'); // Default tab
  // const [isActive, setIsActive] = useState(false); // Status is now derived from detailedOperatorProfile
  const [isLoadingSuspend, setIsLoadingSuspend] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  // Renamed state for clarity, this will control the verification status modal
  const [isVerificationStatusModalOpen, setIsVerificationStatusModalOpen] = useState(false);
  const [isOperatorDeleteModalOpen, setIsOperatorDeleteModalOpen] = useState(false);
  const [operators, setOperators] = useState([]);
  const [isLoadingOperators, setIsLoadingOperators] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [onboardingSummary, setOnboardingSummary] = useState({ in_progress: 0, active: 0, suspend: 0 });
  const [selectedOperatorMobile, setSelectedOperatorMobile] = useState(null);
  const [selectedOperatorDetails, setSelectedOperatorDetails] = useState(null);
  const [liveTrips, setLiveTrips] = useState({}); // Store raw API response
  const [isLoadingLiveTrips, setIsLoadingLiveTrips] = useState(false);
  const [detailedOperatorProfile, setDetailedOperatorProfile] = useState(null);
  const [isLoadingOperatorProfile, setIsLoadingOperatorProfile] = useState(false);
  const [associatedDrivers, setAssociatedDrivers] = useState([]);
  const [isLoadingAssociatedDrivers, setIsLoadingAssociatedDrivers] = useState(false);
  const [associatedVehicles, setAssociatedVehicles] = useState([]);
  const [isLoadingAssociatedVehicles, setIsLoadingAssociatedVehicles] = useState(false);
  const [operatorBuddyList, setOperatorBuddyList] = useState([]);
  const [isLoadingOperatorBuddyList, setIsLoadingOperatorBuddyList] = useState(false);
  const [myBuddyList, setMyBuddyList] = useState([]); // State for "MyBuddies" list
  const [myBuddySummary, setMyBuddySummary] = useState({ total_trip_shared_count: 0, total_revenue: 0 }); // State for "MyBuddies" summary
  const [isLoadingVerification, setIsLoadingVerification] = useState(false); // Loading state for verification update
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false); // Loading state for operator update
  const [operatorBuddySummary, setOperatorBuddySummary] = useState({ total_trip_shared_count: 0, total_revenue: 0 });

  // Derive current operator status from selectedOperatorDetails, which is set immediately on selection.
  // Use 'active_flag' from the operator list data (1 for active).
  const isCurrentOperatorActive = !!(selectedOperatorDetails && selectedOperatorDetails.active_flag === 1);

  // Function to refresh both buddy lists
  // Memoize refreshBuddyLists to stabilize its reference
  const refreshBuddyLists = useCallback(async () => {
    if (!selectedOperatorMobile) {
      console.log("[OperatorPage] refreshBuddyLists: No operator selected, skipping refresh.");
      return;
    }
    console.log("[OperatorPage] Refreshing buddy lists for:", selectedOperatorMobile);
    setIsLoadingOperatorBuddyList(true); // Use a single loading state for both buddy list fetches
    try {
      const [buddyData, myBuddyData] = await Promise.all([
        fetchOperatorBuddyList(selectedOperatorMobile),
        fetchOperatorMyBuddyList(selectedOperatorMobile)
      ]);

      setOperatorBuddyList(buddyData.buddies || []);
      setOperatorBuddySummary(buddyData.summary || { total_trip_shared_count: 0, total_revenue: 0 });

      setMyBuddyList(myBuddyData.myBuddies || []); // Ensure key matches what fetchOperatorMyBuddyList returns
      setMyBuddySummary(myBuddyData.summary || { total_trip_shared_count: 0, total_revenue: 0 });
    } catch (error) {
      console.error(`[OperatorPage] Failed to refresh buddy lists for ${selectedOperatorMobile}:`, error);
    } finally {
      setIsLoadingOperatorBuddyList(false);
    }
  }, [selectedOperatorMobile]); // Dependency for useCallback


  const toggleCard = (section, index) => {
    const cardKeyToToggle = `${section}-${index}`;
    setOpenCards(prevOpenCards => {
      // If the clicked card is already open, close it. Otherwise, open it and close all others.
      const isCurrentlyOpen = prevOpenCards[cardKeyToToggle];
      return isCurrentlyOpen ? {} : { [cardKeyToToggle]: true };
    });
  };

  const loadAssociatedVehicles = useCallback(async () => {
    console.log('[OperatorPage] loadAssociatedVehicles triggered for operator:', selectedOperatorMobile);
    if (!selectedOperatorMobile) {
      setAssociatedVehicles([]); // Clear if no operator selected
      return;
    }
    setIsLoadingAssociatedVehicles(true);
    try {
      const fetchedVehicles = await fetchAssociatedVehicles(selectedOperatorMobile);
      setAssociatedVehicles(fetchedVehicles || []); // Ensure it's an array
      console.log('[OperatorPage] Associated vehicles fetched:', fetchedVehicles);
    } catch (error) {
      console.error(`[OperatorPage] Failed to fetch associated vehicles for ${selectedOperatorMobile}:`, error);
      setAssociatedVehicles([]);
    } finally {
      setIsLoadingAssociatedVehicles(false);
    }
  }, [selectedOperatorMobile]);

  const loadAssociatedDrivers = useCallback(async () => {
    console.log('[Effect: loadAssociatedDrivers] Triggered. Active Tab:', activeTab, 'Selected Mobile:', selectedOperatorMobile);
    if (!selectedOperatorMobile) { // No need to check activeTab here, as this can be called from DriversList directly
      console.log('[Effect: loadAssociatedDrivers] Conditions not met, returning.');
      setAssociatedDrivers([]); // Clear drivers if no operator is selected
      return;
    }
    setIsLoadingAssociatedDrivers(true);
    console.log(`[Effect: loadAssociatedDrivers] Fetching drivers for ${selectedOperatorMobile}...`);
    try {
      const fetchedDrivers = await fetchAssociatedDrivers(selectedOperatorMobile);
      setAssociatedDrivers(fetchedDrivers || []); // Ensure it's an array
      console.log('[Effect: loadAssociatedDrivers] API Response:', fetchedDrivers);
    } catch (error) {
      console.error(`[Effect: loadAssociatedDrivers] Failed to fetch drivers for ${selectedOperatorMobile}:`, error);
      setAssociatedDrivers([]);
    } finally {
      setIsLoadingAssociatedDrivers(false);
    }
  }, [selectedOperatorMobile]); // Removed activeTab from dependencies as it's a direct refresh call

  useEffect(() => {
    const loadOperators = async () => {
      setIsLoadingOperators(true);
      try {
        const responseData = await fetchOperatorList(); // Assuming this returns the whole object
        if (responseData && responseData.operators && Array.isArray(responseData.operators)) {
          setOperators(responseData.operators);
        }
        if (responseData && responseData.onboarding_summary) {
          setOnboardingSummary(responseData.onboarding_summary);
        }

        // Automatically select the first operator if the list is not empty
        // and no operator is currently selected (which will be true on initial load)
        if (responseData && responseData.operators && responseData.operators.length > 0 && !selectedOperatorMobile) {
          const firstOperator = responseData.operators[0];
          handleOperatorSelect(firstOperator.operator_mobile, firstOperator);
        }
      } catch (error) {
        console.error("Failed to fetch operators:", error);
        setOperators([]);
      } finally {
        setIsLoadingOperators(false);
      }
    };

    loadOperators();
    // Add selectedOperatorMobile to dependency array to prevent re-running if it's already set by this effect.
    // However, since we only want this on initial load when selectedOperatorMobile is null,
    // the check `!selectedOperatorMobile` inside the effect handles this. Keeping it empty is fine for one-time load.
  }, []); // Runs once on component mount

  const handleEditClick = () => {
    if (!selectedOperatorMobile) {
      return; // Prevent showing the form if no operator is selected
    }
    setShowUpdateForm(true); // Just show the form, it will fetch its own data
  };

  useEffect(() => {
    const loadLiveTrips = async () => {
      console.log('[Effect: loadLiveTrips] Triggered. Active Tab:', activeTab, 'Selected Mobile:', selectedOperatorMobile);

      if (!selectedOperatorMobile || activeTab !== 'Live Trips') {
        console.log('[Effect: loadLiveTrips] Conditions not met, returning. Mobile:', selectedOperatorMobile, 'Tab:', activeTab);
        return;
      }
      setIsLoadingLiveTrips(true);
      console.log(`[Effect: loadLiveTrips] Fetching live trips for ${selectedOperatorMobile}...`);
      try {
        const fetchedLiveTrips = await fetchLiveTrips(selectedOperatorMobile);
        const liveTripsData = fetchedLiveTrips || {}; // Ensure it's an object
        setLiveTrips(liveTripsData);
        console.log('[Effect: loadLiveTrips] Raw Live Trips State set:', liveTripsData);
       setOpenCards({}); 
      } catch (error) {
        console.error(`Failed to fetch live trips for ${selectedOperatorMobile}:`, error);
        setLiveTrips({}); // Set to empty object on error
        setOpenCards({}); // Clear open cards on error
      } finally {
        setIsLoadingLiveTrips(false);
      }
    };

    loadLiveTrips();
  }, [selectedOperatorMobile, activeTab]);

  useEffect(() => {
    const loadOperatorProfile = async () => {
      console.log('[Effect: loadOperatorProfile] Triggered. Active Tab:', activeTab, 'Selected Mobile:', selectedOperatorMobile);
      if (!selectedOperatorMobile || activeTab !== 'Profile') {
        console.log('[Effect: loadOperatorProfile] Conditions not met, returning.');
        setDetailedOperatorProfile(null); // Clear previous profile when not applicable
        return;
      }
      setIsLoadingOperatorProfile(true);
      console.log(`[Effect: loadOperatorProfile] Fetching profile for ${selectedOperatorMobile}...`);
      try {
        const fetchedProfileData = await fetchOperatorProfile(selectedOperatorMobile);
        setDetailedOperatorProfile(fetchedProfileData);
        console.log('[Effect: loadOperatorProfile] API Response:', fetchedProfileData);
      } catch (error) {
        console.error(`[Effect: loadOperatorProfile] Failed to fetch profile for ${selectedOperatorMobile}:`, error);
        setDetailedOperatorProfile(null);
      } finally {
        setIsLoadingOperatorProfile(false);
      }
    };
    loadOperatorProfile();
  }, [selectedOperatorMobile, activeTab]);

  useEffect(() => {
    // Load vehicles when the "Vehicles" tab is active or when selectedOperatorMobile changes
    if (activeTab === 'Vehicles' && selectedOperatorMobile) {
      loadAssociatedVehicles();
    }
  }, [selectedOperatorMobile, activeTab, loadAssociatedVehicles]);

  useEffect(() => {
    // Load drivers when the "Drivers" tab is active or when selectedOperatorMobile changes
    if (activeTab === 'Drivers' && selectedOperatorMobile) {
      loadAssociatedDrivers();
    }
  }, [selectedOperatorMobile, activeTab, loadAssociatedDrivers]);

  useEffect(() => {
    const loadOperatorBuddies = async () => {
      console.log('[Effect: loadOperatorBuddies] EFFECT RUNNING. Active Tab:', activeTab, 'Selected Mobile:', selectedOperatorMobile);
      if (!selectedOperatorMobile || activeTab !== 'Buddy') {
        console.log('[Effect: loadOperatorBuddies] Conditions not met, returning.');
        // Clear lists if conditions are not met to avoid showing stale data
        setOperatorBuddyList([]);
        setOperatorBuddySummary({ total_trip_shared_count: 0, total_revenue: 0 });
        setMyBuddyList([]);
        setMyBuddySummary({ total_trip_shared_count: 0, total_revenue: 0 });
        return;
      }
      await refreshBuddyLists();
    };
    loadOperatorBuddies();
  }, [selectedOperatorMobile, activeTab, refreshBuddyLists]); // Added refreshBuddyLists

  const handleOperatorStatusSubmit = async (reason) => {
    console.log("Operator status change reason:", reason);
    if (!selectedOperatorMobile || !selectedOperatorDetails) {
      console.warn("Cannot update status: No operator selected or essential operator details missing.", { selectedOperatorMobile, selectedOperatorDetails });
      setIsOperatorDeleteModalOpen(false);
      return;
    }

    const currentUiActiveFlag = selectedOperatorDetails.active_flag;

    const operatorStatusForApi = currentUiActiveFlag === 1 ? 0 : 1;

    setIsLoadingSuspend(true);
    try {
      const response = await updateOperatorActivationStatus(selectedOperatorMobile, operatorStatusForApi, reason);

      console.log("Operator status update API response:", response);
      const newUiActiveFlag = response.active_flag === 1 ? 1 : 2;

      // Update selectedOperatorDetails to reflect the new status
      setSelectedOperatorDetails(prevDetails => ({
        ...prevDetails,
        active_flag: newUiActiveFlag
      }));

      // Update the main operators list to reflect the change
      setOperators(prevOperators => prevOperators.map(op =>
        op.operator_mobile === selectedOperatorMobile
          ? { ...op, active_flag: newUiActiveFlag }
          : op
      ));

      // Update onboarding summary counts
      setOnboardingSummary(prevSummary => {
        const newSummary = { ...prevSummary };
        if (currentUiActiveFlag === 1 && newUiActiveFlag === 2) { // Was Active, became Suspend
          newSummary.active = Math.max(0, newSummary.active - 1);
          newSummary.suspend += 1;
        } else if (currentUiActiveFlag !== 1 && newUiActiveFlag === 1) { // Was Inactive/Suspend, became Active
          if (currentUiActiveFlag === 2) newSummary.suspend = Math.max(0, newSummary.suspend - 1);
          // If currentUiActiveFlag was 3 (In Progress), adjust accordingly if needed.
          newSummary.active += 1;
        }
        return newSummary;
      });

    } catch (error) {
      console.error("Failed to update operator status:", error);
    } finally {
      setIsLoadingSuspend(false);
    }
    setIsOperatorDeleteModalOpen(false);
  };

  // Callback for when a buddy link is successfully updated via the modal
  const handleBuddyUpdateSuccess = () => {
    console.log("[OperatorPage] Buddy link update successful, refreshing lists.");
    refreshBuddyLists(); // Re-fetch buddy lists to show updated data
  };

  // Function to open the verification status modal
  const openVerificationStatusModal = () => {
    if (!selectedOperatorMobile || !selectedOperatorDetails) {
      return;
    }
    setIsVerificationStatusModalOpen(true);
  };

  // Function to handle verification status update submission from the modal
  const handleVerificationStatusSubmit = async (verificationStatus, notes) => {
    if (!selectedOperatorMobile) {
      console.warn("Cannot update verification status: No operator mobile selected.");
      setIsVerificationStatusModalOpen(false); // Close modal on error
      return;
    }

    setIsLoadingVerification(true);
    try {
      const response = await updateOperatorVerificationStatus(
        selectedOperatorMobile,
        verificationStatus,
        notes
      );

      console.log("Verification status update API response:", response);

      setSelectedOperatorDetails(prevDetails => ({
        ...prevDetails,
        verification_status: response.verificationStatus // Assuming API response includes this field
      }));
      setIsVerificationStatusModalOpen(false); // Close modal on success
    } catch (error) {
      console.error("Failed to update verification status:", error);
    } finally {
      setIsLoadingVerification(false);
    }
  };

  const handleUpdateSubmit = async (formDataFromComponent) => {
    console.log("Form data received for update:", formDataFromComponent);
    if (!selectedOperatorMobile) {
      return;
    }
    setIsLoadingUpdate(true);

    const newFilesInForm = Object.values(formDataFromComponent).some(value => value instanceof File);
    if (newFilesInForm) {
    }

    try {
      const modelData = { ...formDataFromComponent, operatorMobile: selectedOperatorMobile };
      const model = new OperatorModel(modelData, 'update');
      const payload = model.toUpdateJsonPayload();

      console.log("Payload for update:", payload);
      const response = await updateOperatorDetails(payload);
      setShowUpdateForm(false);
      if (selectedOperatorMobile) {
        const refreshedProfile = await fetchOperatorProfile(selectedOperatorMobile);
        setDetailedOperatorProfile(refreshedProfile);
        setSelectedOperatorDetails(prev => ({ ...prev, ...refreshedProfile, operator_name: refreshedProfile.operator_name, operator_mobile: refreshedProfile.operator_mobile, operator_image_url: refreshedProfile.operator_image_url })); // Update summary card
      }
    } catch (error) {
      console.error("Failed to update operator details:", error);
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const handleCancelUpdate = () => {
    setShowUpdateForm(false);
  };

  const openStatusReasonModal = () => {
    if (!selectedOperatorMobile || !selectedOperatorDetails) {
      console.warn("Cannot open status modal: No operator selected or essential details missing.");
      return;
    }
    setIsOperatorDeleteModalOpen(true);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleTriCardFilter = (label) => {
    setSelectedStatus(label === selectedStatus ? null : label);
  };

  const handleOperatorSelect = (mobile, operator) => {
    setSelectedOperatorMobile(mobile);
    setSelectedOperatorDetails(operator);
    console.log('[OperatorPage] Operator Selected:', { mobile, operator });
    setActiveTab('Live Trips');
    setShowForm(false);
    setShowUpdateForm(false);
  };

  const statusMap = {
    'In Progress': 3,
    'Active': 1,
    'Suspend': 2
  };

  // filterData import was removed as it's not used here, assuming it's from @utils
  const searchedOperators = filterData(operators, searchTerm, ['operator_name', 'operator_business', 'operator_mobile']);

  const filteredOperators = searchedOperators.filter(operator => {
    if (selectedStatus && statusMap[selectedStatus] !== undefined) {
      return Number(operator.active_flag) === statusMap[selectedStatus];
    }
    return true; // If no status is selected, include all operators (that match search)
  });
  const triCardValues = [onboardingSummary.in_progress, onboardingSummary.active, onboardingSummary.suspend];

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Pane */}
        <div className="w-full md:w-1/3">
          <h2 className="textPrimary font-bold text-xl mb-4">Operators</h2>
          <TriCard
            values={triCardValues}
            selectedLabel={selectedStatus}
            onSelect={handleTriCardFilter}
          />
          <div className="flex items-center gap-2 mb-4">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search"
            />
           <button
  onClick={() => setShowForm(!showForm)}
  className="text-icon text-2xl hover:text-primary-dark transition"
  aria-label="Toggle Form"
>
  {showForm ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
</button>

<button className="text-icon hover:text-primary-dark transition" aria-label="Upload">
  <Upload className="w-6 h-6" />
</button>
          </div>
          <div className="w-full md:w-full">
            {isLoadingOperators ? (
              <p className='text-center textSecondary'> Loading Operators...</p>
            ) : (
              <OperatorList
                operators={filteredOperators}
                onOperatorSelect={handleOperatorSelect}
              />
            )}

          </div>
        </div>

        {/* Right Pane */}
        <AnimatePresence mode="wait">
          {showForm ? (
            <AnimatedTabPanel key="onboarding-form" className="w-full md:w-2/3">
              <OperatorOnboardingForm />
            </AnimatedTabPanel>
          ) : showUpdateForm ? (
            <AnimatedTabPanel key="update-form" className="w-full md:w-2/3">
              <UpdateOperatorForm
                operatorMobile={selectedOperatorMobile}
                onSubmit={handleUpdateSubmit}
                onCancel={handleCancelUpdate}
              />
            </AnimatedTabPanel>
          ) : (
            <AnimatedTabPanel key="operator-details" className="w-full md:w-2/3">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedOperatorDetails?.operator_image_url || selectedOperatorDetails?.logoUrl || DROPTAXILOGO} // Use selected operator's image if available
                    alt={`Logo`}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <h3 className="textPrimary">{selectedOperatorDetails?.operator_business || selectedOperatorDetails?.operator_name || 'Operator Details'}</h3>
                    <p className="textSecondary">{selectedOperatorDetails?.operator_mobile || selectedOperatorDetails?.operator_phone || selectedOperatorDetails?.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Pencil
                    className="w-5 h-5 text-icon cursor-pointer"
                    onClick={handleEditClick}
                  />
                  <ShieldCheck
                    className="w-5 h-5 text-icon cursor-pointer"
                    onClick={openVerificationStatusModal}
                  />
                  <label className="inline-flex items-center cursor-pointer">
                    <ToggleSwitch
                      isActive={isCurrentOperatorActive}
                      onToggle={openStatusReasonModal}
                      disabled={isLoadingSuspend}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-around items-center py-2 mt-2">
                <NavItem
                  icon={<CircleDot className="w-6 h-6" />}
                  label="Live Trips"
                  active={activeTab === "Live Trips"}
                  onClick={() => handleTabChange("Live Trips")}
                />
                <NavItem
                  icon={<Users className="w-6 h-6" />}
                  label="Drivers"
                  active={activeTab === "Drivers"}
                  onClick={() => handleTabChange("Drivers")}
                />
                <NavItem
                  icon={<CarFront className="w-6 h-6" />}
                  label="Vehicles"
                  active={activeTab === "Vehicles"}
                  onClick={() => handleTabChange("Vehicles")}
                />
                <NavItem
                  icon={<Users className="w-6 h-6" />}
                  label="Buddy"
                  active={activeTab === "Buddy"}
                  onClick={() => handleTabChange("Buddy")}
                />
                <NavItem
                  icon={<UserCircle className="w-6 h-6" />}
                  label="Profile"
                  active={activeTab === "Profile"}
                  onClick={() => handleTabChange("Profile")}
                />
                <NavItem
                  icon={<IndianRupee className="w-6 h-6" />}
                  label="Pricing"
                  active={activeTab === "Pricing"}
                  onClick={() => handleTabChange("Pricing")}
                />
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "Live Trips" && (
                  <AnimatedTabPanel key="Live Trips">
                    {isLoadingLiveTrips ? (
                      <p className="text-center textSecondary p-4">Loading live trips...</p>
                    ) : (
                      <TripSections
                        liveTripsData={liveTrips}
                        openCards={openCards}
                        onToggleCard={toggleCard}
                      />
                    )}
                  </AnimatedTabPanel>
                )}

                {activeTab === "Drivers" && (
                  <AnimatedTabPanel key="Drivers">
                    {isLoadingAssociatedDrivers ? (
                      <p className="text-center textSecondary p-4">Loading drivers...</p>
                    ) : (
                      <DriversList 
                        drivers={associatedDrivers} 
                        operatorMobile={selectedOperatorMobile} 
                        onDriverListUpdate={loadAssociatedDrivers} // Pass the refresh function
                      />
                    )}
                  </AnimatedTabPanel>
                )}

                {activeTab === "Vehicles" && (
                  <AnimatedTabPanel key="Vehicles">
                    {isLoadingAssociatedVehicles ? (
                      <p className="text-center textSecondary p-4">Loading vehicles...</p>
                    ) : (
                      <VehiclesList 
                        vehicles={associatedVehicles} 
                        operatorMobile={selectedOperatorMobile} 
                        onVehicleListUpdate={loadAssociatedVehicles} // Pass the refresh function
                      />
                    )}
                  </AnimatedTabPanel>
                )}

                {activeTab === "Buddy" && (
                  <AnimatedTabPanel key="Buddy">
                    {isLoadingOperatorBuddyList ? (
                      <p className="text-center textSecondary p-4">Loading buddies...</p>
                    ) : (
                      <BuddyTabs
                        buddies={operatorBuddyList}
                        myBuddies={myBuddyList}
                        buddySummary={operatorBuddySummary}
                        myBuddySummary={myBuddySummary}
                        currentOperatorMobile={selectedOperatorMobile}
                        currentOperatorName={selectedOperatorDetails?.operator_name}
                        onUpdateBuddySuccess={handleBuddyUpdateSuccess} />
                    )}
                  </AnimatedTabPanel>
                )}

                {activeTab === "Profile" && (
                  <AnimatedTabPanel key="Profile">
                    {isLoadingOperatorProfile ? (
                      <p className="text-center textSecondary p-4">Loading profile...</p>
                    ) : detailedOperatorProfile ? (
                      <OperatorProfile profileData={detailedOperatorProfile} />
                    ) : <p className="text-center textSecondary p-4">No profile data available or select an operator.</p>}
                  </AnimatedTabPanel>
                )}

                {activeTab === "Pricing" && (
                  <AnimatedTabPanel key="Pricing">
                    {/* Placeholder for Pricing content */}
                    <CarPricingTable operatorMobile={selectedOperatorMobile} searchTerm={searchTerm} />
                  </AnimatedTabPanel>
                )}

              </AnimatePresence>
            </AnimatedTabPanel>
          )}
          <OperatorStatusModal
            operator={selectedOperatorDetails}
            isOpen={isVerificationStatusModalOpen}
            onClose={() => setIsVerificationStatusModalOpen(false)}
            onSubmit={handleVerificationStatusSubmit}
            currentVerificationStatus={selectedOperatorDetails?.verification_status}
            isLoading={isLoadingVerification}
          />
          <OperatorStatusHandlingModal
            operator={selectedOperatorDetails || null}
            isOpen={isOperatorDeleteModalOpen}
            onClose={() => setIsOperatorDeleteModalOpen(false)}
            onSubmit={handleOperatorStatusSubmit}
            isActive={isCurrentOperatorActive}
          />
        </AnimatePresence>
      </div>
    </>
  );
};