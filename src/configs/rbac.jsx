/**
 * @file Centralized Role-Based Access Control (RBAC) configuration.
 * Defines roles and their associated permissions.
 */

export const ROLES = {
  TDC_ADMIN: 'TDCAdmin',
  TDC_ONBOARDING: 'TDCOnboarding',
  TDC_MONITORING: 'TDCMonitoring',
  OPERATOR: 'Operator',
  DRIVER: 'Driver',
  CUSTOMER: 'Customer',
};

export const PERMISSIONS = {
  VIEW_OPERATORS_MENU: 'view_operators_menu',
  VIEW_CONFIGURATION_USERS_TAB: 'view_configuration_users_tab',
  // Permissions for Vehicle Models
  EDIT_VEHICLE_MODEL: 'edit_vehicle_model',
  DELETE_VEHICLE_MODEL: 'delete_vehicle_model',
  ADD_VEHICLE_MODEL: 'add_vehicle_model', // Added permission

  // Permissions for Vehicle Types
  EDIT_VEHICLE_TYPE: 'edit_vehicle_type',
  DEACTIVATE_VEHICLE_TYPE: 'deactivate_vehicle_type',
  ADD_VEHICLE_TYPE: 'add_vehicle_type', // Added permission
};

// Maps roles to their permissions
export const ROLE_PERMISSIONS = {
  [ROLES.TDC_ADMIN]: [
    PERMISSIONS.VIEW_OPERATORS_MENU,
    PERMISSIONS.VIEW_CONFIGURATION_USERS_TAB,
    PERMISSIONS.EDIT_VEHICLE_MODEL,
    PERMISSIONS.DELETE_VEHICLE_MODEL,
    PERMISSIONS.ADD_VEHICLE_MODEL,
    PERMISSIONS.EDIT_VEHICLE_TYPE,
    PERMISSIONS.DEACTIVATE_VEHICLE_TYPE,
    PERMISSIONS.ADD_VEHICLE_TYPE,
  ],
  [ROLES.TDC_ONBOARDING]: [/* ... TDCOnboarding permissions ... */],
  // ... define permissions for other roles
};
