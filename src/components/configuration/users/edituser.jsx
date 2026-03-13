import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { BaseModal, InputField, Button, ButtonLight } from '@components';
import { fetchRoleList, updateUser } from '@services';
import { AuthContext } from '@context';
import { toast } from 'react-toastify';

export const EditUserModal = ({ isOpen, onClose, onSaveSuccess, selectedUser }) => {
  const { authData } = useContext(AuthContext);
  const loggedInUserOperatorMobile = authData?.user?.operator_mobile || authData?.operator_mobile || '';

  const [formData, setFormData] = useState({
    name: '',
    user_name: '',
    password: '', // For updates, password might be optional
    operator_mobile: '',
    role_id: null,
    // is_superuser is derived
  });
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && selectedUser) {
      setFormData({
        name: selectedUser.name || '',
        user_name: selectedUser.user_name || '',
        password: '', // Keep password blank by default for updates
        operator_mobile: selectedUser.operator_mobile || '',
        role_id: selectedUser.role_id || null, // Assuming role_id is part of selectedUser
      });
      setErrors({});

      const loadRoles = async () => {
        try {
          const roleData = await fetchRoleList();
          const filteredRoles = roleData.filter(role => role.role_name !== 'TDCAdmin');
          setRoles(filteredRoles.map(role => ({ value: role.role_id, label: role.role_name })));
        } catch (error) {
          console.error("Failed to fetch roles:", error);
        }
      };
      loadRoles();
    }
  }, [isOpen, selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleRoleChange = (selectedOption) => {
    const newRoleId = selectedOption ? selectedOption.value : null;
    const selectedRoleName = selectedOption ? selectedOption.label : '';

    setFormData(prev => ({
      ...prev,
      role_id: newRoleId,
      operator_mobile: selectedRoleName === 'Operator' ? prev.operator_mobile : loggedInUserOperatorMobile,
    }));
    if (errors.role_id) setErrors(prev => ({ ...prev, role_id: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    // user_name is likely non-editable or pre-filled
    if (!formData.user_name.trim()) newErrors.user_name = "Username is required (and usually non-editable).";
    // Password is optional for update, but if provided, might have validation
    if (!formData.operator_mobile.trim()) newErrors.operator_mobile = "Operator mobile is required.";
    if (formData.role_id === null) newErrors.role_id = "Role is required.";
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
      const isSuperuser = (selectedRoleName === 'Operator' || selectedRoleName === 'TDCAdmin') ? 1 : 0;

      const payload = {
        name: formData.name,
        user_name: formData.user_name, // This is the key for update
        operator_mobile: formData.operator_mobile,
        role_id: formData.role_id,
        is_superuser: isSuperuser,
      };
      // Only include password if it's entered
      if (formData.password) {
        payload.password = formData.password;
      }

      await updateUser(payload);
      toast.success("User updated successfully!");
      onSaveSuccess();
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedRoleForOperatorMobile = roles.find(role => role.value === formData.role_id)?.label;
  const isOperatorRoleSelected = selectedRoleForOperatorMobile === 'Operator';

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} modalTitle={`Edit User: ${selectedUser?.name || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Operator Mobile" name="operator_mobile" placeholder="Operator Mobile" value={formData.operator_mobile} onChange={handleChange} error={errors.operator_mobile} required disabled={!isOperatorRoleSelected && !!loggedInUserOperatorMobile} />
        <InputField label="Name" name="name" placeholder="Name" value={formData.name} onChange={handleChange} error={errors.name} required />
        <InputField label="Username" name="user_name" placeholder="Username" value={formData.user_name} disabled error={errors.user_name} required />
        <InputField label="New Password (optional)" name="password" placeholder="New Password (leave blank to keep current)" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <Select
            options={roles}
            onChange={handleRoleChange}
            value={roles.find(role => role.value === formData.role_id)}
            placeholder="Select a role..."
            classNamePrefix="react-select"
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            isClearable
          />
          {errors.role_id && <p className="text-red-500 text-xs mt-1">{errors.role_id}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <ButtonLight type="button" onClick={onClose} variant="secondary" disabled={isLoading}>
            Cancel
          </ButtonLight>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update User'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};