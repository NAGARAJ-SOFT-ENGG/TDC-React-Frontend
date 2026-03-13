/**
 * Represents a customer.
 */
export class CustomerModel {
    constructor({
        customer_name,
        customer_mobile,
        customer_email,
        gender,
        primary_address,
        city,
        state,
        country,
        pincode,
        channel,
        base_gps_loc,
        role_name,
        operator_mobile,
    }) {
        this.customer_name = customer_name;
        this.customer_mobile = customer_mobile;
        this.customer_email = customer_email;
        this.gender = gender;
        this.primary_address = primary_address;
        this.city = city;
        this.state = state;
        this.country = country;
        this.pincode = pincode ? parseInt(pincode, 10) : 0; // API expects number
        this.channel = channel;
        this.base_gps_loc = base_gps_loc;
        this.role_name = role_name;
        this.operator_mobile = operator_mobile;
    }

    /**
     * Returns a JSON representation suitable for API submission.
     */
    toJSON() {
        // The constructor already matches the API payload structure
        return { ...this };
    }
}