import { formatDateToYYYYMMDD } from "@utils"; // Assuming you have a date utility

export class DriverModel {
  constructor(data = {}, operatorMobile = null) {
    this.operator_mobile = operatorMobile || data.operator_mobile || "";
    this.driver_name = data.driver_name || data.name || "";
    this.driver_mobile = data.driver_mobile || data.mobile || "";
    this.driver_email = data.driver_email || data.email || "";
    this.driver_address = data.driver_address || data.address || "";
    this.driver_city = data.driver_city || data.city || "";
    this.driver_state = data.driver_state || data.state || "";
    this.driver_country = data.driver_country || data.country || "IN";
    this.driver_pincode = data.driver_pincode || data.pincode || "";
    this.driver_image = data.driver_image || null; // File object or URL string

    this.license_type = data.license_type || data.licenseType || "";
    this.licence_image = data.licence_image || data.licenseFile || null; // File object or URL string
    this.driving_license_number = data.driving_license_number || data.licenseNumber || "";
    // Ensure dates are formatted correctly if they are Date objects
    this.license_valid_from = data.license_valid_from || data.validFrom ? formatDateToYYYYMMDD(data.license_valid_from || data.validFrom) : "";
    this.license_valid_upto = data.license_valid_upto || data.validTo ? formatDateToYYYYMMDD(data.license_valid_upto || data.validTo) : "";

    this.aadhar_image = data.aadhar_image || data.aadharFile || null; // File object or URL string
    this.aadhar_number = data.aadhar_number || data.aadharNumber || "";
    this.pan_image = data.pan_image || data.panFile || null; // File object or URL string
    this.pan_number = data.pan_number || data.panNumber || "";

    this.notes = data.notes || "";
  }

  toFormData() {
    const formData = new FormData();

    // Append all string/number fields
    formData.append("operator_mobile", this.operator_mobile);
    formData.append("driver_name", this.driver_name);
    formData.append("driver_mobile", this.driver_mobile);
    formData.append("driver_email", this.driver_email);
    formData.append("driver_address", this.driver_address);
    formData.append("driver_city", this.driver_city);
    formData.append("driver_state", this.driver_state);
    formData.append("driver_country", this.driver_country);
    formData.append("driver_pincode", this.driver_pincode);

    formData.append("license_type", this.license_type);
    formData.append("driving_license_number", this.driving_license_number);
    formData.append("license_valid_from", this.license_valid_from);
    formData.append("license_valid_upto", this.license_valid_upto);

    formData.append("aadhar_number", this.aadhar_number);
    formData.append("pan_number", this.pan_number);
    formData.append("notes", this.notes);

    // Append file fields only if they are File objects
    if (this.driver_image instanceof File) {
      formData.append("driver_image", this.driver_image, this.driver_image.name);
    } else {
      // If not a file, append the value (which will be null if no image was selected,
      // or potentially a URL string if handling updates with existing images).
      // FormData converts null to the string "null".
      formData.append("driver_image", this.driver_image);
    }
    if (this.licence_image instanceof File) {
      formData.append("licence_image", this.licence_image, this.licence_image.name);
    } else {
      formData.append("licence_image", this.licence_image);
    }
    if (this.aadhar_image instanceof File) {
      formData.append("aadhar_image", this.aadhar_image, this.aadhar_image.name);
    } else {
      formData.append("aadhar_image", this.aadhar_image);
    }
    if (this.pan_image instanceof File) {
      formData.append("pan_image", this.pan_image, this.pan_image.name);
    } else {
      formData.append("pan_image", this.pan_image);
    }

    return formData;
  }

  // Helper to get initial form state for DriverOnboarding
  static getInitialFormState() {
    return {
      // Profile fields
      name: '', email: '', mobile: '', address: '', pincode: '', country: 'IN', state: '', city: '', driver_image: null,
      // Document fields
      licenseType: '', licenseNumber: '', validFrom: null, validTo: null, aadharNumber: '', panNumber: '',
      licenseFile: null, aadharFile: null, panFile: null,
      notes: '',
    };
  }
}

export class DriverVerificationUpdateModel {
  constructor(driverMobile, operatorMobile, verificationStatus, notes, active_flag) {
    this.driver_mobile = driverMobile;
    this.operator_mobile = operatorMobile;
    this.verification_status = verificationStatus;
    this.active_flag = active_flag;
    this.notes = notes;
  }

  toPayload() {
    return {
      driver_mobile: this.driver_mobile,
      operator_mobile: this.operator_mobile,
      verification_status: this.verification_status,
      active_flag: this.active_flag,
      notes: this.notes,
    };
  }
}

export class DriverDeleteModel {
  constructor(operatorMobile, driverMobile) {
    this.operator_mobile = operatorMobile;
    this.driver_mobile = driverMobile;
  }

  toPayload() {
    return {
      operator_mobile: this.operator_mobile,
      driver_mobile: this.driver_mobile,
    };
  }
}

export class DriverActivationUpdateModel {
  constructor(driverMobile, operatorMobile, activeFlag, notes) {
    this.driver_mobile = driverMobile;
    this.operator_mobile = operatorMobile;
    this.active_flag = activeFlag; // 0 or 1 or 2 based on API (e.g., 1 for active, 2 for suspended)
    this.notes = notes;
  }

  toPayload() {
    return {
      driver_mobile: this.driver_mobile,
      operator_mobile: this.operator_mobile,
      active_flag: this.active_flag,
      notes: this.notes,
    };
  }
}

export class DriverVehicleAssignModel {
  constructor(operatorMobile, driverMobile, vehicleNumber) {
    this.operator_mobile = operatorMobile;
    this.driver_mobile = driverMobile;
    this.vehicle_number = vehicleNumber;
  }

  toPayload() {
    return {
      operator_mobile: this.operator_mobile,
      driver_mobile: this.driver_mobile,
      vehicle_number: this.vehicle_number,
    };
  }
}

export class DriverVehicleReassignModel {
  constructor(operatorMobile, driverMobile, currentVehicleNumber, newVehicleNumber) {
    this.operator_mobile = operatorMobile;
    this.driver_mobile = driverMobile;
    this.vehicle_number = currentVehicleNumber; // The vehicle currently assigned (or to be unassigned if new is null)
    this.new_vehicle_number = newVehicleNumber; // The new vehicle to assign
  }

  toPayload() {
    return {
      operator_mobile: this.operator_mobile,
      driver_mobile: this.driver_mobile,
      vehicle_number: this.vehicle_number,
      new_vehicle_number: this.new_vehicle_number,
    };
  }
}
