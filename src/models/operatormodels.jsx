/**
 * Model for Operator Onboarding data.
 * Transforms form data into a structure suitable for the API service.
 */
export class OperatorModel {
    constructor(formData, formType = 'onboarding') { // formType can be 'onboarding' or 'update'
        if (formType === 'update') {
            // Mapping from UpdateOperatorForm state
            this.Mobile_Number = formData.operatorMobile || ""; // Used as key for update
            this.operator_name = formData.operatorName || "";
            this.operator_business = formData.operatorBusiness || ""; // Assuming it might be part of formData
            this.operator_phone = formData.operatorMobile || ""; // Or a separate field if exists in form
            this.email_id = formData.operatorEmail || "";
            this.primary_address = formData.address || "";
            this.city = formData.city || "";
            this.state = formData.state || "";
            this.country = formData.country || "IN";
            this.pincode = formData.pincode || "";
            this.latitude = formData.latitude || ""; // If available in formData
            this.longitude = formData.longitude || ""; // If available in formData
            this.aadhar_number = formData.aadharNumber || "";
            this.pan_number = formData.panNumber || "";
            this.gst_number = formData.gstNumber || "";

            // Image fields can be string (URL) or File object
            this.operator_image = formData.profileImage || null;
            this.aadhar_image = formData.aadharImage || null;
            this.pan_image = formData.panImage || null;
            this.gst_image = formData.gstImage || null; // If GST image upload is part of the form

        } else { // Default 'onboarding' or other form types
            this.operator_name = formData.operatorName || "";
            this.operator_business = formData.operatorBusiness || "";
            this.Mobile_Number = formData.operatorMobile || "";
            this.operator_phone = formData.operatorPhone || formData.operatorMobile || "";
            this.email_id = formData.operatorEmail || "";
            this.primary_address = formData.address || "";
            this.city = formData.city || "";
            this.state = formData.state || "";
            this.country = formData.country || "IN";
            this.pincode = formData.pincode || "";
            this.latitude = formData.latitude || "";
            this.longitude = formData.longitude || "";
            this.aadhar_number = formData.aadharNumber || "";
            this.pan_number = formData.panNumber || "";
            this.gst_number = formData.gstNumber || "";
            this.operator_image = formData.profileImage || null; // Expects File for onboarding
            this.aadhar_image = formData.aadharFile || null;   // Expects File for onboarding
            this.pan_image = formData.panFile || null;     // Expects File for onboarding
            this.gst_image = formData.gstFile || null;       // Expects File for onboarding
        }
        // Common fields regardless of formType
        this.operator_status = formData.operatorStatus !== undefined ? formData.operatorStatus : null;
        this.notes = formData.notes || "";
        this.verificationStatus = formData.verificationStatus || "";
    }

    /**
     * Creates a FormData object suitable for API submission.
     * @returns {FormData}
     */
    toFormData() {
        const formData = new FormData();

        // Iterate over the model's properties to append non-file data
        for (const key in this) {
            if (
                Object.prototype.hasOwnProperty.call(this, key) && // Only own properties
                typeof this[key] !== 'function' &&                 // Exclude methods
                !(this[key] instanceof File) &&                  // Exclude File objects (handled separately)
                this[key] !== null &&                              // Exclude null values
                this[key] !== undefined                            // Exclude undefined values
                                                                   // Optionally, add this[key] !== "" to exclude empty strings
            ) {
                formData.append(key, this[key]);
            }
        }

        // Specifically append file fields with their API-expected names
        if (this.operator_image instanceof File) {
            formData.append('operator_image', this.operator_image, this.operator_image.name);
        }
        if (this.aadhar_image instanceof File) {
            formData.append('aadhar_image', this.aadhar_image, this.aadhar_image.name);
        }
        if (this.pan_image instanceof File) {
            formData.append('pan_image', this.pan_image, this.pan_image.name);
        }

        return formData;
    }

    /**
     * Creates a JSON payload suitable for operator verification status update API.
     * @param {string} operatorMobile The operator's mobile number.
     * @param {string} verificationStatus The new verification status.
     * @param {string} notes Optional notes for the update.
     * @param {number} active_flag
     * @returns {object}
     */
    static toVerificationUpdatePayload(operatorMobile, verificationStatus, active_flag, notes) {
        const payload = {
            operatorMobile: operatorMobile,
            verificationStatus: verificationStatus,
            active_flag: active_flag,
            
        };
        if (notes && String(notes).trim() !== "") {
            payload.notes = String(notes).trim();
        }
        return payload;
    }

    /**
     * Creates a JSON payload suitable for operator activation status update API.
     * @param {string} operatorMobile The operator's mobile number.
     * @param {number} operatorStatus The new status code (e.g., 1 for active, 0 or 2 for inactive/suspend).
     * @param {string} notes Optional notes for the update.
     * @returns {object}
     */
    static toActivationUpdatePayload(operatorMobile, operatorStatus, notes) {
        const payload = {
            operator_mobile: operatorMobile,
            operator_status: operatorStatus,
        };
        if (notes && String(notes).trim() !== "") {
            payload.notes = String(notes).trim();
        }
        return payload;
    }

    /**
     * Creates a JSON payload suitable for operator update API.
     * Image fields will only be included if they are strings (URLs).
     * New File objects for images need to be uploaded separately to get URLs first.
     * @returns {object}
     */
    toUpdateJsonPayload() {
        const payload = {
            Mobile_Number: this.Mobile_Number, // Key for identifying the operator
            operator_name: this.operator_name,
            operator_business: this.operator_business,
            operator_phone: this.operator_phone,
            email_id: this.email_id,
            primary_address: this.primary_address,
            city: this.city,
            state: this.state,
            country: this.country,
            pincode: this.pincode,
            latitude: this.latitude,
            longitude: this.longitude,
            aadhar_number: this.aadhar_number,
            pan_number: this.pan_number,
            gst_number: this.gst_number,
        };

        // Only include image fields if they are strings (URLs)
        if (typeof this.operator_image === 'string') payload.operator_image = this.operator_image;
        if (typeof this.aadhar_image === 'string') payload.aadhar_image = this.aadhar_image;
        if (typeof this.pan_image === 'string') payload.pan_image = this.pan_image;
        if (typeof this.gst_image === 'string') payload.gst_image = this.gst_image;

        // Remove undefined fields from payload
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
        return payload;
    }
}