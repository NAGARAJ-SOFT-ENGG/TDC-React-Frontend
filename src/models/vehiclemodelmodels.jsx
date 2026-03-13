/**
 * Represents a vehicle model.
 */
export class VehiclemodelModel {
    constructor({
        vehicle_model_id, // from GET response
        vehicle_make,
        vehicle_model,
        model_year,         // from GET response
        vehicle_seating_capacity, // from GET response
        misc_details,       // from GET response
        vehicle_type
    }) {
        this.id = vehicle_model_id;
        this.make = vehicle_make;
        this.model = vehicle_model;
        this.year = parseInt(model_year, 10); // Ensure year is a number
        this.seatingCapacity = parseInt(vehicle_seating_capacity, 10); // Ensure capacity is a number
        this.miscDetails = misc_details;
        this.vehicleType = vehicle_type;
    }

    /**
     * Returns a JSON representation of the vehicle model data suitable for API submission (PUT /modelupdate).
     */
    toJSON() {
        // Maps internal properties to the keys expected by the /modelupdate API
        return {
            // vehicle_model_id is not in the PUT request body example,
            // assuming the backend identifies the model by make/model or other means.
            // If ID is needed in payload, add: vehicle_model_id: this.id,
            vehicle_make: String(this.make || ""),
            vehicle_model: String(this.model || ""),
            vehicle_modelyear: String(this.year || ""), // API expects string
            vehicle_seating: String(this.seatingCapacity || ""), // API expects string
            vehicle_misc: String(this.miscDetails || ""), // API expects string, handle null/undefined
            vehicle_type: String(this.vehicleType || ""),
        };
    }
}

// Helper function to create an instance from form data if needed,
// ensuring correct property names for the constructor.
export const createVehicleModelFromFormData = (formData) => new VehicleModel({
    ...formData, // Spread formData which should have make, model, year, etc.
    // Ensure names match constructor if they differ from form names
});