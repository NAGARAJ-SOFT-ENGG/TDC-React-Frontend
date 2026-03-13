import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookingCard, CreateRideRequestModal, Button } from '@components'; // Added CreateRideRequestModal and Button
import {
  LayoutDashboard, MapPin, Calendar, Users, UserCheck,
  Car, DollarSign, FileText, Radio, Settings,
  Train, User, UserCog, ChevronLeft, ChevronRight, IndianRupee
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { usePermissions, useAuth } from '@hooks'; // Import usePermissions and useAuth
import { PERMISSIONS, ROLES } from '@configs'; // Import PERMISSIONS and ROLES
import { AnimatedTabPanel } from '@components'; // Make sure the path is correct

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: MapPin, label: 'Tracking', path: '/trackings' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Calendar, label: 'Bookings', path: '/bookings' },
  { icon: Train, label: 'Trip', path: '/trips' },
  { icon: UserCog, label: 'Operators', path: '/operators', permission: PERMISSIONS.VIEW_OPERATORS_MENU }, // Added permission
  { icon: User, label: 'Drivers', path: '/drivers' },
  { icon: Car, label: 'Vehicles', path: '/vehicles' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: IndianRupee, label: 'Tariff', path: '/pricing' },
  // Example: Add permission for Vehicle Model if needed
  // { icon: Settings, label: 'Vehicle Model', path: '/vehiclemodel', permission: PERMISSIONS.VIEW_VEHICLE_MODELS_MENU },
  { icon: Settings, label: 'Configuration', path: '/configuration' }
];

const Sidebar = React.memo(() => {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { can, userRole } = usePermissions(); // Use the permissions hook
  const { authData } = useAuth(); // Get authData to pass operatorMobile if current user is an operator

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreateBookingSuccess = () => {
    // Potentially refresh some data or navigate, if needed after booking creation
    console.log("Booking created successfully from sidebar modal.");
  };

  const accessibleSidebarItems = sidebarItems.filter(item => {
    // If item has a permission defined, check if the user has it
    // Otherwise, the item is considered accessible by default
    return item.permission ? can(item.permission) : true;
  });

  // Determine if the current user is an operator to pass their mobile number
  // Or if TDCAdmin/TDCMonitoring, they might create for any operator (modal would need an operator selector then)
  const operatorMobileForModal = userRole === ROLES.OPERATOR ? authData?.operator_mobile : null;

  return (
    <aside className={`h-screen shadow-md transition-all duration-300 ease-in-out bg-sidebarGradient ${collapsed ? 'w-16' : 'w-56'}`}>
      <div className="h-full flex flex-col">
        {/* Scrollable Section */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2 mt-4 flex flex-col gap-1 scroll-hide">
          {/* Menu Items */}
          {accessibleSidebarItems.map(({ icon: Icon, label, path }, index) => {
            const isActive = location.pathname === path;
            return (
              <div
                key={index}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 px-2 py-2 rounded-lg textPrimary cursor-pointer transition-colors
                  ${isActive ? 'bg-primary textPrimary' : 'hover:bg-primary textPrimary'}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className={`transition-all textPrimary whitespace-nowrap
                  ${collapsed ? 'opacity-0 w-0 scale-95 overflow-hidden' : 'opacity-100 w-auto scale-100'}`}>
                  {label}
                </span>
              </div>
            );
          })}

          {/* Create Booking Button/Card */}
          <AnimatePresence>
  {!isMobile && !collapsed && (
    <BookingCard onCreateBookingClick={() => setIsCreateBookingModalOpen(true)} />
  )}
</AnimatePresence>
          {/* Old Booking Card - you can remove this if the button above replaces its functionality */}
          {/* <AnimatePresence>
            {!isMobile && !collapsed && <BookingCard />}
          </AnimatePresence> */}

          {/* Chevron Toggle Below Card, stays in flow */}
          {!isMobile && (
            <div className="px-2 py-3 border-t border-gray-200/20 ">
              <div className="flex justify-end">
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="p-2 rounded-lg hover:bg-primary transition-colors"
                  title="Toggle Sidebar"
                >
                  {collapsed ? (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal for Creating Ride Request */}
      <CreateRideRequestModal
        isOpen={isCreateBookingModalOpen}
        onClose={() => setIsCreateBookingModalOpen(false)}
        operatorMobile={operatorMobileForModal} // Pass operator's mobile if applicable
        // If TDC admin creates, operatorMobile might need to be selected within the modal
        // or passed differently. For now, it uses the logged-in operator's mobile.
        onSaveSuccess={handleCreateBookingSuccess}
      />
    </aside>
  );
});

export { Sidebar };
