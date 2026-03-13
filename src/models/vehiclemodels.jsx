/**
 * Helper function to format date to YYYY-MM-DD
 * @param {Date|string|null} dateInput
 * @returns {string}
 */
const formatDateToYYYYMMDD = (dateInput) => {
  if (!dateInput) return '';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return ''; // Invalid date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return '';
  }
};

export class VehicleModel {
  constructor(data) {
    this.vehicle_number = data.vehicleNumber || '';
    this.vehicle_type = data.vehicleType || ''; // Expecting a string from dataForModelConstructor
    this.vehicle_model = data.vehicleModel || ''; // Expecting a string from dataForModelConstructor
    this.fuel_type = data.fuelType || ''; // Expecting a string from dataForModelConstructor
    this.fc_image = data.fcImageFile || null; // Expecting a File object, or null if not provided
    this.fc_number = data.fcNumber || '';
    this.fc_valid_from = formatDateToYYYYMMDD(data.fcFrom);
    this.fc_valid_upto = formatDateToYYYYMMDD(data.fcUpto);
    this.rc_image = data.rcImageFile || null; // Expecting a File object, or null if not provided
    this.rc_number = data.rcNumber || '';
    this.rc_valid_from = formatDateToYYYYMMDD(data.rcValidFrom); // Will be '' if data.rcValidFrom is null/undefined
    this.rc_validupto = formatDateToYYYYMMDD(data.rcValidUpto); // Will be '' if data.rcValidUpto is null/undefined
    this.active_permits = data.activePermits || '';
    this.insurance_image = data.insuranceImageFile || null; 
    this.insurance_number = data.insuranceNumber || '';
    this.insurance_valid_from = formatDateToYYYYMMDD(data.insuranceFrom);
    this.insurance_valid_upto = formatDateToYYYYMMDD(data.insuranceUpto);
    this.operator_mobile = data.operatorMobile || '';
  }

  toFormData() {
    const formData = new FormData();

    for (const key in this) {
      // Check if the property belongs to the instance and is a string
      if (this.hasOwnProperty(key) && typeof this[key] === 'string') {
        formData.append(key, this[key]);
      }
    }

    if (this.rc_image instanceof File) {
      formData.append('rc_image', this.rc_image, this.rc_image.name);
      } else {
      formData.append('rc_image', null);
    }
    if (this.fc_image instanceof File) {
      formData.append('fc_image', this.fc_image, this.fc_image.name);
    }else {
      formData.append('fc_image',null);
    }
    if (this.insurance_image instanceof File) {
      formData.append('insurance_image', this.insurance_image, this.insurance_image.name);
    }
    else {
      formData.append('insurance_image', null);
    }
    return formData;
  }
}

export class VehicleDriverAssignModel {
  constructor(operatorMobile, vehicleNumber, driverMobile) {
    this.operator_mobile = operatorMobile;
    this.vehicle_number = vehicleNumber;
    this.driver_mobile = driverMobile;
  }

  toPayload() {
    return {
      operator_mobile: this.operator_mobile,
      vehicle_number: this.vehicle_number,
      driver_mobile: this.driver_mobile,
    };
  }
}

export class VehicleDriverReassignModel {
  constructor(operatorMobile, vehicleNumber, currentDriverMobile, newDriverMobile) {
    this.operator_mobile = operatorMobile;
    this.vehicle_number = vehicleNumber;
    this.driver_mobile = currentDriverMobile; // The driver currently assigned to this vehicle
    this.new_driver_mobile = newDriverMobile; // The new driver to assign to this vehicle
  }

  toPayload() {
    return {
      operator_mobile: this.operator_mobile,
      vehicle_number: this.vehicle_number,
      driver_mobile: this.driver_mobile,
      new_driver_mobile: this.new_driver_mobile,
    };
  }
}