import React, { useState, useEffect } from 'react';
import { BaseModal, InputField, Button, ButtonLight } from '@components';
import { updateLookupRadius } from '@services';
import { toast } from 'react-toastify';

export const EditLookupRadiusModal = ({ isOpen, onClose, onSaveSuccess, selectedRadius }) => {
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
    if (isOpen && selectedRadius) {
      setFormData({
        operator_mobile: selectedRadius.operator_mobile || '',
        operator_radius1: selectedRadius.operator_radius1?.toString() || '',
        operator_radius2: selectedRadius.operator_radius2?.toString() || '',
        operator_radius3: selectedRadius.operator_radius3?.toString() || '',
      });
      setErrors({});
    }
  }, [isOpen, selectedRadius]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    // operator_mobile is the identifier and likely non-editable
    if (!formData.operator_mobile.trim()) newErrors.operator_mobile = "Operator mobile is required (and usually non-editable).";

    if (!formData.operator_radius1.toString().trim()) newErrors.operator_radius1 = "Radius 1 is required.";
    else if (isNaN(formData.operator_radius1) || Number(formData.operator_radius1) <= 0) newErrors.operator_radius1 = "Radius 1 must be a positive number.";
    // ... similar validation for radius2 and radius3
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
        operator_mobile: formData.operator_mobile, // This is the key
        operator_radius1: Number(formData.operator_radius1),
        operator_radius2: Number(formData.operator_radius2),
        operator_radius3: Number(formData.operator_radius3),
      };
      await updateLookupRadius(payload);
      toast.success("Lookup radius updated successfully!");
      onSaveSuccess();
    } catch (error) {
      console.error("Failed to update lookup radius:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} modalTitle={`Edit Lookup Radius: ${selectedRadius?.operator_mobile || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Operator Mobile" name="operator_mobile" placeholder="Operator Mobile" value={formData.operator_mobile} disabled error={errors.operator_mobile} required />
        <InputField label="Operator Radius 1 (km)" name="operator_radius1" placeholder="Operator Radius 1 (km)" type="number" value={formData.operator_radius1} onChange={handleChange} error={errors.operator_radius1} required />
        <InputField label="Operator Radius 2 (km)" name="operator_radius2" placeholder="Operator Radius 2 (km)" type="number" value={formData.operator_radius2} onChange={handleChange} error={errors.operator_radius2} required />
        <InputField label="Operator Radius 3 (km)" name="operator_radius3" placeholder="Operator Radius 3 (km)" type="number" value={formData.operator_radius3} onChange={handleChange} error={errors.operator_radius3} required />
        <div className="flex justify-end space-x-3 pt-4">
          <ButtonLight type="button" onClick={onClose} variant="secondary" disabled={isLoading}>Cancel</ButtonLight>
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Updating...' : 'Update Lookup Radius'}</Button>
        </div>
      </form>
    </BaseModal>
  );
};