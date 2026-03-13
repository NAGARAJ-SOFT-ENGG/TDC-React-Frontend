import React from 'react';
import {
  Phone,
  Clock,
  MapPin,
  CalendarDays,
  Users
} from 'lucide-react';

export const RideRequestsList = ({ requests }) => {
  return (
    <div className="h-full flex flex-col shadow-md rounded-md px-2 border">
      <h3 className=" textPrimary mb-3">Ride Requests</h3>
      
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-lg shadow-sm p-4 relative border border-gray-400">
              <span className="absolute top-2 right-4 textPrimary text-icon">{req.channel}</span>
              <p className="textPrimary font-medium">RideReq {req.id}</p>
              <p className="textSecondary">Operator Mobile: {req.operator}</p>
              <p className="textSecondary">Ride Created Date: {req.date}</p>
              
             <div className="flex items-center gap-2 mt-2">
  <div className="flex items-center gap-1 textSecondary">
    <Phone className="text-icon w-4 h-4" />
    <span>{req.rider}</span>
  </div>
  <div className="flex items-center gap-1 textSecondary">
    <Users className="text-icon w-4 h-4" />
    <span>3</span> {/* You can replace 3 with req.passengerCount if it's dynamic */}
  </div>
</div>

<div className="flex items-center gap-1 mt-1 textSecondary">
  <Clock className="text-icon w-4 h-4" />
  <span>{req.time}</span>
</div>

<div className="flex items-center gap-1 mt-1 textSecondary">
  <MapPin className="text-icon w-4 h-4" />
  <span>{req.route}</span>
</div>

<div className="flex items-center gap-1 mt-1 textSecondary">
  <CalendarDays className="text-icon w-4 h-4" />
  <span>{req.requestedDate}</span>
</div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};