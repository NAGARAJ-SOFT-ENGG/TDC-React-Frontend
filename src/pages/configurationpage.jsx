import React, { useState } from 'react';
import { VehicleModelsPage } from './vehiclemodelpage';
import { UsersPage } from './userspage'; // Import UsersPage
import { LookupRadiusPage } from './lookupradiuspage'; // Import LookupRadiusPage
import { VehicleTypesPage } from './vehiclestypePage'; // Import VehicleTypesPage
import {
    NavItem,
    AnimatedTabPanel,
} from '@components';
import {
    Radar,
    Car,
    Users,
    UserCircle,
    Truck,
    Settings // Added a generic settings icon for a "General" tab example
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const TABS = [
    // { name: "Live Trips", icon: CircleDot },
    { name: "Users", icon: Users },
    { name: "Lookup Radius", icon: Radar },
    { name: "Vehicle Models", icon: Car },
    { name: "Vehicle Types", icon: Truck },
];

export const ConfigurationPage = () => {
    const [activeTab, setActiveTab] = useState(TABS[0].name); // Default to the first tab

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

    // Placeholder content for tabs
    const renderTabContent = () => {
        switch (activeTab) {
            case "Vehicle Models":
                return <VehicleModelsPage />;
            case "Users":
                return <UsersPage />; // Use UsersPage
            case "Lookup Radius":
                return <LookupRadiusPage />; // Use LookupRadiusPage
            case "Vehicle Types":
                return <VehicleTypesPage />; // Use VehicleTypesPage
            // case "Vehicles":
            //     return <div className="p-4 text-secondary">Vehicles Configuration Content</div>;
            // case "Buddy":
            //     return <div className="p-4 text-secondary">Buddy System Configuration Content</div>;
            // case "Profile":
            //     return <div className="p-4 text-secondary">User Profile Settings or Configuration</div>;
            default:
                return <div className="p-4 text-secondary">Select a configuration section.</div>;
        }
    };

    return (
        <>
            {/* Page Title (Optional, can be part of a Layout component if you have one) */}
            <h2 className="textPrimary font-bold text-xl">Configurations</h2>

            <div className=" p-4"> {/* Added a container for styling */}
                {/* Tab Navigation */}
                <div className="flex justify-around items-center py-2 mt-2 mb-4">
                    {TABS.map((tab) => (
                        <NavItem
                            key={tab.name}
                            icon={<tab.icon className="w-6 h-6" />}
                            label={tab.name}
                            active={activeTab === tab.name}
                            onClick={() => handleTabChange(tab.name)}
                        />
                    ))}
                </div>

                {/* Tab Content Area */}
                <AnimatePresence mode="wait">
                    <AnimatedTabPanel key={activeTab}>
                        {renderTabContent()}
                    </AnimatedTabPanel>
                </AnimatePresence>
            </div>
        </>
    );
};