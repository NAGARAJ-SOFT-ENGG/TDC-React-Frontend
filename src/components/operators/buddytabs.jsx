import React, { useState } from "react";
import { BuddyTable } from "./buddytable";
import { MyBuddyTable } from "./mybuddytable";

export const BuddyTabs = ({ 
    buddies, 
    myBuddies, 
    buddySummary, 
    myBuddySummary, 
    currentOperatorMobile, 
    currentOperatorName, 
    onUpdateBuddySuccess 
}) => {
    const [activeTab, setActiveTab] = useState("buddies");

    const currentSummary = activeTab === "buddies" ? buddySummary : myBuddySummary;

    return (
        <div className="p-4">
            {/* Toggle and Cards Side by Side */}
            <div className="flex flex-col md:flex-row items-center md:items-stretch justify-around gap-4 mb-4">
                
              {/* Capsule Tabs */}
<div className="bg-gray-200 rounded-full flex w-[160px] h-[40px] p-0.5 text-sm mt-3">
    <button
        className={`flex-1 textPrimary py-0.5 rounded-full transition-all duration-300 ease-in-out ${
            activeTab === "buddies"
                ? "bg-white text-icon shadow"
                : "textPrimary"
        }`}
        onClick={() => setActiveTab("buddies")}
    >
        Buddy
    </button>
    <button
        className={`flex-1 textPrimary py-0.5 rounded-full transition-all duration-300 ease-in-out ${
            activeTab === "myBuddies"
                ? "bg-white text-icon shadow"
                : "textPrimary"
        }`}
        onClick={() => setActiveTab("myBuddies")}
    >
        MyBuddy
    </button>
</div>


                {/* Summary Cards */}
                <div className="flex gap-4">
                    <div className="bg-gray-200 w-[160px] px-6 py-1.5 rounded-xl text-center shadow-md">
                        <div className="textSecondary text-black">Trips Shared</div>
                        <div className="text-black font-bold mt-1">{currentSummary?.total_trip_shared_count || 0}</div>
                    </div>
                    <div className="bg-gray-200 w-[160px] px-6 py-1.5 rounded-xl text-center shadow-md">
                        <div className="textSecondary text-black">Revenue</div>
                        <div className="text-black font-bold mt-1">{currentSummary?.total_revenue || 0}</div>
                    </div>
                </div>
            </div>

            {/* Tab Table Content */}
            <div>
                {activeTab === "buddies" ? (
                    <BuddyTable 
                        buddies={buddies} 
                        currentOperatorMobile={currentOperatorMobile} 
                        currentOperatorName={currentOperatorName}
                        onUpdateBuddy={onUpdateBuddySuccess} 
                    />
                ) : (
                    <MyBuddyTable 
                        myBuddies={myBuddies} 
                        currentOperatorMobile={currentOperatorMobile} 
                        currentOperatorName={currentOperatorName}
                        onUpdateBuddy={onUpdateBuddySuccess} // Assuming MyBuddyTable might need this too
                    />
                )}
            </div>
        </div>
    );
};
