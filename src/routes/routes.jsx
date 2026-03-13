import { lazy } from 'react';
import { pages } from '@pages';
import { Layout } from '@components';
import { Navigate } from 'react-router-dom';


const load = (page) => lazy(() => pages[page]().then(mod => ({ default: mod[page] })));

const LoginPage = load('LoginPage');
const OperatorPage = load('OperatorPage');
const DriversPage = load('DriversPage');
const VehiclesPage = load('VehiclesPage');
const BookingsPage = load('BookingsPage');
const TrackingsPage = load('TrackingsPage');
const PricingModelPage = load('PricingModelPage');
const VehicleModelsPage = load('VehicleModelsPage');
const ReportsPage = load('ReportsPage');
const CustomersPage = load('CustomersPage');
const TripsPage = load('TripsPage');
const ConfigurationPage = load('ConfigurationPage');

const publicRoutes = [
  {
    index: true,
    element: <LoginPage />,
  },
];

const protectedRoutes = {
  path: '/',
  element: <Layout />,
  children: [
    { path: 'operators', element: <OperatorPage /> },
    { path: 'drivers', element: <DriversPage /> },
    { path: 'vehicles', element: <VehiclesPage /> },
    { path: 'bookings', element: <BookingsPage /> },
    { path: 'trackings', element: <TrackingsPage /> },
    { path: 'pricing', element: <PricingModelPage /> },
    { path: 'vehiclemodel', element: <VehicleModelsPage /> },
    { path: 'reports', element: <ReportsPage /> },
    { path: 'customers', element: <CustomersPage /> },
    { path: 'trips', element: <TripsPage /> },
    { path: 'configuration', element: <ConfigurationPage /> },
  ],
};

const fallbackRoute = {
  path: '*',
  element: <Navigate to="/login" replace />
};

export const routes = [...publicRoutes, protectedRoutes, fallbackRoute];