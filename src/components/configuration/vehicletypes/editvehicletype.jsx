import React, { useState, useEffect } from 'react';
import { BaseModal, InputField, Button, TextareaField, ButtonLight } from '@components';
import { updateVehicleType } from '@services';
import { toast } from 'react-toastify';

export const EditVehicleTypeModal = ({ isOpen, onClose, onSaveSuccess, selectedVehicleType }) => {
  const initialFormState = {
    vehicle_type: '',
    capacity: '',
    description: '',
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && selectedVehicleType) {
      setFormData({
        vehicle_type: selectedVehicleType.vehicle_type || '',
        capacity: selectedVehicleType.capacity?.toString() || '',
        description: selectedVehicleType.description || '',
      });
      setErrors({});
    }
  }, [isOpen, selectedVehicleType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    // vehicle_type is the identifier and likely non-editable for an update
    if (!formData.vehicle_type.trim()) newErrors.vehicle_type = "Vehicle type is required (and usually non-editable).";
    if (!formData.capacity.toString().trim()) newErrors.capacity = "Capacity is required.";
    else if (isNaN(formData.capacity) || Number(formData.capacity) <= 0) newErrors.capacity = "Capacity must be a positive number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        vehicle_type: formData.vehicle_type, // This is the key
        capacity: Number(formData.capacity),
        description: formData.description.trim() || null,
      };
      await updateVehicleType(payload);
      toast.success("Vehicle type updated successfully!");
      onSaveSuccess();
    } catch (error) {
      console.error("Failed to update vehicle type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} modalTitle={`Edit Vehicle Type: ${selectedVehicleType?.vehicle_type || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Vehicle Type"
          name="vehicle_type"
          placeholder="Vehicle Type"
          value={formData.vehicle_type}
          onChange={handleChange} // Allow changes to vehicle_type
          error={errors.vehicle_type}
          required
        />
        <InputField
          label="Capacity"
          name="capacity"
          placeholder="Capacity"
          type="number"
          value={formData.capacity}
          onChange={handleChange}
          error={errors.capacity}
          required
        />
        <TextareaField
          label="Description (Optional)"
          name="description"
          placeholder="Description (Optional)"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          rows={3}
        />
        <div className="flex justify-end space-x-3 pt-4">
          <ButtonLight type="button" onClick={onClose} variant="secondary" disabled={isLoading}>Cancel</ButtonLight>
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Updating...' : 'Update Vehicle Type'}</Button>
        </div>
      </form>
    </BaseModal>
  );
};