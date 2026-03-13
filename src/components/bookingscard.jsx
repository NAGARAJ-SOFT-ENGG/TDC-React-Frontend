import React from 'react';
import { Plus } from 'lucide-react';
import { AnimatedTabPanel, Button } from '@components';


export const BookingCard = React.memo(({ onCreateBookingClick }) => (
  <AnimatedTabPanel className="mt-4 px-1">
    <div className="rounded-xl bg-[#005AC71A] p-3 text-center shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Let's start!</h3>
      <p className="text-xs text-gray-600 mb-3 leading-tight">
        Create a ride request for your customer
      </p>
      <Button onClick={onCreateBookingClick} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        <span className='textPrimary text-white'>Create Booking</span>
      </Button>
    </div>
  </AnimatedTabPanel>
));
