import React from 'react';


export const RideStatsGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Average Time for Scheduling */}
            <div className="bg-white rounded-lg p-4 text-center shadow-md">
                <h3 className="textSecondary">Average time for Scheduling</h3>
                <p className="text-2xl font-bold text-icon">67</p>
            </div>

            {/* Turnaround Time */}
            <div className="bg-white rounded-lg p-4 text-center shadow-md">
                <h3 className="textSecondary">Turnaround Time</h3>
                <p className="text-3xl font-bold text-icon">50</p>
            </div>

            {/* Ride Analysis */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="textSecondary text-center mb-2">Ride Analysis</h3>
                <div className="flex items-center justify-center">
                    {/* Circle Count */}
                    <div className="w-20 h-20 rounded-full border-4 border-icon flex items-center justify-center relative">
                        <span className="textSecondary">198</span>
                    </div>

                    {/* Legend */}
                   <div className="ml-4 text-sm space-y-1 textSecondary">
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 bg-icon rounded-full opacity-100"></span>
    <span>Within 50 km</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 bg-icon rounded-full opacity-70"></span>
    <span>Within 75 km</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 bg-icon rounded-full opacity-40"></span>
    <span>Within 100 km</span>
  </div>
</div>

                </div>
            </div>
        </div>
    );
};
