/**
 * Represents a vehicle pricing configuration.
 */
export class VehiclePricingModel {
    constructor({
        price_operatormobile,
        price_vehtype,
        price_kmrate,
        price_drivercharge,
        price_drivermaxkms,
        price_pet,
        price_waiting,
        price_discount,
        price_timeaddon,
        price_kmsaddon,
        price_minimumkms,
    }) {
        this.operatorMobile = price_operatormobile;
        this.vehicleType = price_vehtype; // Used for display and searching
        this.kmRate = parseFloat(price_kmrate);
        this.driverCharge = parseFloat(price_drivercharge);
        this.driverMaxKms = parseFloat(price_drivermaxkms);
        this.petCharges = parseFloat(price_pet);
        this.waitingCharges = parseFloat(price_waiting);
        this.discount = parseFloat(price_discount); // e.g., 0.05 for 5%
        this.timeAddon = price_timeaddon; // Format: HH:MM:SS
        this.kmsAddon = parseFloat(price_kmsaddon);
        this.minimumKms = parseFloat(price_minimumkms);
        // A unique identifier for React keys, combining potentially unique fields or using a generated one.
        this.id = `${price_operatormobile}-${price_vehtype}-${price_kmrate}-${price_minimumkms}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Returns a JSON representation of the pricing data suitable for API submission.
     * Ensures all relevant fields are converted to strings as expected by the API.
     */
    toJSON() {
        return {
            price_operatormobile: String(this.operatorMobile),
            price_vehtype: String(this.vehicleType),
            price_kmrate: String(this.kmRate),
            price_drivercharge: String(this.driverCharge),
            price_drivermaxkms: String(this.driverMaxKms),
            price_pet: String(this.petCharges),
            price_waiting: String(this.waitingCharges),
            price_discount: String(this.discount),
            price_timeaddon: String(this.timeAddon),
            price_kmsaddon: String(this.kmsAddon),
            price_minimumkms: String(this.minimumKms),
        };
    }
}