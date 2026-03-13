import { useContext } from 'react';
import { AuthContext } from '@context';
import { ROLE_PERMISSIONS } from '@configs';

/**
 * Custom hook to check user permissions based on their role.
 * @returns {object} An object containing the `can` function.
 */
export const usePermissions = () => {
  const { authData } = useContext(AuthContext);

  // Determine the user's role. Adjust this path based on your authData structure.
  const userRole = authData?.user?.role_name || authData?.role_name;

  /**
   * Checks if the current user has a specific permission.
   * @param {string} permission - The permission string to check (e.g., PERMISSIONS.VIEW_OPERATORS_MENU).
   * @returns {boolean} True if the user has the permission, false otherwise.
   */
  const can = (permission) => {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) {
      return false; // No role or role not defined in ROLE_PERMISSIONS
    }
    return ROLE_PERMISSIONS[userRole].includes(permission);
  };

  return { can, userRole }; // Also returning userRole can be useful
};
