import React, { useState } from 'react';
import { Sidebar } from '@components';
import { Header, RideRequestsList, CabFetcherLog, RideStatsGrid, Button, VehicleModelTable, VehicleModelOnboard } from '@components';

const OperatorMobile = import.meta.env.VITE_ENTRY_OPERATOR_MOBILE;

const request = [
    {
        id: 493,
        operator: "7502297739",
        date: "23/05/2024",
        rider: "9988766999",
        time: "13.45 to 22",
        route: "chennai --> mayiladuthurai",
        requestedDate: "23/05/2024",
        channel: "Whatsapp",
    },
    {
        id: 514,
        operator: "7502297739",
        date: "07/06/2024",
        rider: "7708668996",
        time: "13.45 to 22",
        route: "chennai --> mayiladuthurai",
        requestedDate: "07/06/2024",
        channel: "Whatsapp",
    },
    {
        id: 514,
        operator: "7502297739",
        date: "07/06/2024",
        rider: "7708668996",
        time: "13.45 to 22",
        route: "chennai --> mayiladuthurai",
        requestedDate: "07/06/2024",
        channel: "Whatsapp",
    },
    {
        id: 514,
        operator: "7502297739",
        date: "07/06/2024",
        rider: "7708668996",
        time: "13.45 to 22",
        route: "chennai --> mayiladuthurai",
        requestedDate: "07/06/2024",
        channel: "Whatsapp",
    },
    {
        id: 514,
        operator: "7502297739",
        date: "07/06/2024",
        rider: "7708668996",
        time: "13.45 to 22",
        route: "chennai --> mayiladuthurai",
        requestedDate: "07/06/2024",
        channel: "Whatsapp",
    },
    {
        id: 514,
        operator: "7502297739",
        date: "07/06/2024",
        rider: "7708668996",
        time: "13.45 to 22",
        route: "chennai --> mayiladuthurai",
        requestedDate: "07/06/2024",
        channel: "Whatsapp",
    },
]

export const ReportsPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
           <h2 className="textPrimary font-bold text-xl mb-4">Reports</h2>
            <RideStatsGrid />

            {/* Bottom Split Section */}
            <div className="flex flex-col md:flex-row gap-4 h-[calc(100%-170px)]">
                <div className="w-full md:w-1/3 space-y-4">
                    < RideRequestsList requests={request} />
                </div>
                {/* Right Section (2/3 width) */}
                <CabFetcherLog />
            </div>
        </>
    );
};