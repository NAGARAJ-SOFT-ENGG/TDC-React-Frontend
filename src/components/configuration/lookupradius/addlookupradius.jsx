import React, { useState, useEffect, useContext } from 'react';
import { BaseModal, InputField, Button, ButtonLight } from '@components';
import { createLookupRadius } from '@services';
import { AuthContext } from '@context';
import { toast } from 'react-toastify';

export const AddLookupRadius = ({ isOpen, onClose, onSaveSuccess }) => {
  const { authData } = useContext(AuthContext);
  // Assuming TDCAdmin creates this, so operator_mobile is an input.
  // If an Operator role could create this, initialOperatorMobile would be from authData.
  const initialFormState = {
    operator_mobile: '',
    operator_radius1: '',
    operator_radius2: '',
    operator_radius3: '',
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.operator_mobile.trim()) newErrors.operator_mobile = "Operator mobile is required.";
    // Basic check for mobile number format (can be enhanced)
    else if (!/^\d{10,15}$/.test(formData.operator_mobile.trim())) newErrors.operator_mobile = "Invalid mobile number format.";

    if (!formData.operator_radius1.toString().trim()) newErrors.operator_radius1 = "Radius 1 is required.";
    else if (isNaN(formData.operator_radius1) || Number(formData.operator_radius1) <= 0) newErrors.operator_radius1 = "Radius 1 must be a positive number.";

    if (!formData.operator_radius2.toString().trim()) newErrors.operator_radius2 = "Radius 2 is required.";
    else if (isNaN(formData.operator_radius2) || Number(formData.operator_radius2) <= 0) newErrors.operator_radius2 = "Radius 2 must be a positive number.";

    if (!formData.operator_radius3.toString().trim()) newErrors.operator_radius3 = "Radius 3 is required.";
    else if (isNaN(formData.operator_radius3) || Number(formData.operator_radius3) <= 0) newErrors.operator_radius3 = "Radius 3 must be a positive number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        operator_mobile: formData.operator_mobile.trim(),
        operator_radius1: Number(formData.operator_radius1),
        operator_radius2: Number(formData.operator_radius2),
        operator_radius3: Number(formData.operator_radius3),
      };
      await createLookupRadius(payload);
      toast.success("Lookup radius created successfully!");
      onSaveSuccess();
    } catch (error) {
      console.error("Failed to create lookup radius:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} modalTitle="Add New Lookup Radius">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Operator Mobile"
          placeholder="Operator Mobile"
          name="operator_mobile"
          value={formData.operator_mobile}
          onChange={handleChange}
          error={errors.operator_mobile}
          required
        />
        <InputField
          label="Operator Radius 1 (km)"
            placeholder="operator_radius 1"
          name="operator_radius1"
          type="number"
          value={formData.operator_radius1}
          onChange={handleChange}
          error={errors.operator_radius1}
          required
        />
        <InputField
          label="Operator Radius 2 (km)"
            placeholder="Operator Radius 2"
          name="operator_radius2"
          type="number"
          value={formData.operator_radius2}
          onChange={handleChange}
          error={errors.operator_radius2}
          required
        />
        <InputField
          label="Operator Radius 3 (km)"
          name="operator_radius3"
            placeholder="Operator Radius 3"
          type="number"
          value={formData.operator_radius3}
          onChange={handleChange}
          error={errors.operator_radius3}
          required
        />
        <div className="flex justify-end space-x-3 pt-4">
          <ButtonLight type="button" onClick={onClose} variant="secondary" disabled={isLoading}>
            Cancel
          </ButtonLight>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Lookup Radius'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};