// export { OperatorPage } from './operatorpage';
// export { DriversPage } from './driverspage';
// export { VehiclesPage } from './vehiclespage';
// export { BookingsPage } from './bookingspage';
// export { TrackingsPage } from './trackingspage';
// export { PricingModelPage } from './pricingmodelpage';
// export { VehicleModelsPage } from './vehiclemodelpage';
// export { ReportsPage } from './reportspage';
// export { CustomersPage } from './customerpage';
// export { TripsPage } from './trippage';
// export { LoginPage } from './loginpage';

export const pages = {
  OperatorPage: () => import('./operatorpage'),
  DriversPage: () => import('./driverspage'),
  VehiclesPage: () => import('./vehiclespage'),
  BookingsPage: () => import('./bookingspage'),
  TrackingsPage: () => import('./trackingspage'),
  PricingModelPage: () => import('./pricingmodelpage'),
  VehicleModelsPage: () => import('./vehiclemodelpage'),
  ReportsPage: () => import('./reportspage'),
  CustomersPage: () => import('./customerpage'),
  TripsPage: () => import('./trippage'),
  LoginPage: () => import('./loginpage'),
  ConfigurationPage: () => import('./configurationpage'),
};