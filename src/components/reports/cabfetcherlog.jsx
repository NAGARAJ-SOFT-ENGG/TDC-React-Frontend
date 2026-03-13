import React from 'react'
import { RefreshCcw } from 'lucide-react';

export const CabFetcherLog = () => {
    return (
        <div className="w-full md:w-2/3 mx-auto shadow-md">
            <div className=" p-4 space-y-2">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h3 className="textPrimary">CabFetcher Log</h3>
                    <button className="text-icon hover:text-Cta">
    <RefreshCcw className="w-5 h-5" />
</button>
                </div>

                {/* General Info */}
                <div className="text-sm space-y-1 text-center">
                    <p className='textPrimary'>Status : <span className="text-green-600 font-semibold">Cabs Available</span></p>
                    <p className='textSecondary'>Operator Mobile : 7502297739</p>
                    <p className='textSecondary'>Created at : <span>null</span></p>
                </div>

                {/* Radius1 Info */}
                <div className="border-t pt-2 text-center">
                    <p className="textPrimary">Radius1</p>
                    <p className="text-red-500 textSecondary">Driver Not Available within this Radius</p>
                </div>

                {/* Radius2 Info */}
                <div className="border-t pt-2 text-center">
                    <p className="textPrimary">Radius2</p>
                    <div className="flex flex-col items-center gap-2 mb-1">
                        {/* <img
                            src="/cabs-logo.png"
                            alt="cab"
                            className="w-10 h-10 rounded-full object-cover border"
                        /> */}
                        <p className="text-green-600 textSecondary">
                            Drivers available within Radius 100000 meter
                        </p>
                    </div>
                </div>

                {/* Driver Details - shown only if found in Radius2 */}
                <div className="pt-4">
                    <h4 className="textPrimary text-left">Driver Details</h4>
                    <div className="text-sm space-y-1 text-left">
                        <p className='textSecondary'><strong>Driver Mobile:</strong> 9876543210</p>
                        <p className='textSecondary'><strong>Distance:</strong> 8500m</p>
                        <p className='textSecondary'><strong>Location:</strong> [13.0837, 79.9773]</p>
                        <p className='textSecondary'><strong>Willingness:</strong> Yes</p>
                        <p className='textSecondary'><strong>Confirmation:</strong> Confirmed</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
