import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { BaseModal, InputField, Button, ButtonLight } from '@components';
import { fetchRoleList, createUser } from '@services';
import { AuthContext } from '@context';
import { toast } from 'react-toastify';

export const AddUserOnboard = ({ isOpen, onClose, onSaveSuccess }) => {
  const { authData } = useContext(AuthContext);
  const initialOperatorMobile = authData?.user?.operator_mobile || authData?.operator_mobile || '';

  const [formData, setFormData] = useState({
    name: '',
    user_name: '',
    password: '',
    operator_mobile: initialOperatorMobile,
    role_id: null,
    // is_superuser is now derived from role_id
  });
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Reset form data when modal opens
      setFormData({
        name: '',
        user_name: '',
        password: '',
        operator_mobile: initialOperatorMobile,
        role_id: null,
      });
      setErrors({});

      const loadRoles = async () => {
        try {
          const roleData = await fetchRoleList();
          // Filter out the 'TDCAdmin' role before setting the state
          const filteredRoles = roleData.filter(role => role.role_name !== 'TDCAdmin');
          setRoles(filteredRoles.map(role => ({ value: role.role_id, label: role.role_name })));
        } catch (error) {
          console.error("Failed to fetch roles:", error);
        //   toast.error("Failed to load roles for user creation.");
        }
      };
      loadRoles();
    }
  }, [isOpen, initialOperatorMobile]);

  // Effect to auto-generate username
  useEffect(() => {
    // Generate username only if both operator_mobile and name are present
    // Replace spaces in name for a cleaner username part
    const namePart = formData.name.trim().replace(/\s+/g, '');
    if (formData.operator_mobile && namePart) {
      setFormData(prev => ({
        ...prev,
        user_name: `${prev.operator_mobile}.${namePart}`
      }));
    }
  }, [formData.name, formData.operator_mobile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleRoleChange = (selectedOption) => {
    const newRoleId = selectedOption ? selectedOption.value : null;
    const selectedRoleName = selectedOption ? selectedOption.label : '';

    setFormData(prev => ({
      ...prev,
      role_id: newRoleId,
      // Automatically set operator_mobile if the role is not 'Operator'
      // and ensure it's editable if it IS 'Operator'
      operator_mobile: selectedRoleName === 'Operator' ? prev.operator_mobile : initialOperatorMobile,
    }));

    if (errors.role_id) {
      setErrors(prev => ({ ...prev, role_id: null }));
    }

  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.user_name.trim()) newErrors.user_name = "Username is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.operator_mobile.trim()) newErrors.operator_mobile = "Operator mobile is required.";
    if (formData.role_id === null) newErrors.role_id = "Role is required.";
    // Add more specific validations if needed (e.g., password complexity, username format)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const selectedRoleObject = roles.find(role => role.value === formData.role_id);
      const selectedRoleName = selectedRoleObject ? selectedRoleObject.label : '';

      // Determine is_superuser based on role name
      const isSuperuser = (selectedRoleName === 'Operator' || selectedRoleName === 'TDCAdmin') ? 1 : 0;

      const payload = {
        ...formData,
        is_superuser: isSuperuser,
      };
      
      await createUser(payload);
    //   toast.success("User created successfully!");
      onSaveSuccess(); // This will close the modal and refresh the user list
    } catch (error) {
      console.error("Failed to create user:", error);
      // The apiCall utility should already show a toast for API errors.
      // You might add a more generic one here if needed, or handle specific error codes.
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedRoleForOperatorMobile = roles.find(role => role.value === formData.role_id)?.label;
  const isOperatorRoleSelected = selectedRoleForOperatorMobile === 'Operator';

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} modalTitle="Add New User">
      <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
          placeholder="Operator Mobile"
          label="Operator Mobile"
          name="operator_mobile"
          value={formData.operator_mobile}
          onChange={handleChange}
          error={errors.operator_mobile}
          required
          disabled={!isOperatorRoleSelected && !!initialOperatorMobile} // Disable if not Operator role AND initialOperatorMobile is set
        />
        <InputField placeholder="Name" label="Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
       


        <InputField
          placeholder="Username (auto-generated)"
          label="Username"
          name="user_name"
          value={formData.user_name}
          error={errors.user_name} // Keep error display for validation consistency
          disabled // Username is auto-generated and disabled
          required // Still mark as required for validation logic
        />
        <InputField placeholder="Password" label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} required />
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <Select
            options={roles}
            onChange={handleRoleChange}
            value={roles.find(role => role.value === formData.role_id)}
            placeholder="Select a role..."
            classNamePrefix="react-select"
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} // Ensure dropdown is on top
            menuPortalTarget={document.body} // Render dropdown in body to avoid overflow issues
            isClearable
          />
          {errors.role_id && <p className="text-red-500 text-xs mt-1">{errors.role_id}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <ButtonLight type="button" onClick={onClose} variant="secondary" disabled={isLoading}>
            Cancel
          </ButtonLight>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create User'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};