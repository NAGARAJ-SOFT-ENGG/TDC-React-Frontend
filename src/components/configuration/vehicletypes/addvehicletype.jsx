import React, { useState, useEffect } from 'react';
import { BaseModal, InputField, Button, TextareaField, ButtonLight } from '@components';
import { createVehicleType } from '@services';
import { toast } from 'react-toastify';

export const AddVehicleType = ({ isOpen, onClose, onSaveSuccess }) => {
  const initialFormState = {
    vehicle_type: '',
    capacity: '',
    description: '',
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
    if (!formData.vehicle_type.trim()) newErrors.vehicle_type = "Vehicle type is required.";
    if (!formData.capacity.toString().trim()) newErrors.capacity = "Capacity is required.";
    else if (isNaN(formData.capacity) || Number(formData.capacity) <= 0) newErrors.capacity = "Capacity must be a positive number.";
    // Description is optional
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        description: formData.description.trim() || null, // Send null if empty
      };
      await createVehicleType(payload);
      toast.success("Vehicle type created successfully!");
      onSaveSuccess();
    } catch (error) {
      console.error("Failed to create vehicle type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} modalTitle="Add New Vehicle Type">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
        placeholder="Vehicle Type"
          label="Vehicle Type"
          name="vehicle_type"
          value={formData.vehicle_type}
          onChange={handleChange}
          error={errors.vehicle_type}
          required
        />
        <InputField
          label="Capacity"
          placeholder="Capacity"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={handleChange}
          error={errors.capacity}
          required
        />
        <TextareaField
          label="Description (Optional)"
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          rows={3}
        />
        <div className="flex justify-end space-x-3 pt-4">
          <ButtonLight type="button" onClick={onClose} variant="secondary" disabled={isLoading}>
            Cancel
          </ButtonLight>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Vehicle Type'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};