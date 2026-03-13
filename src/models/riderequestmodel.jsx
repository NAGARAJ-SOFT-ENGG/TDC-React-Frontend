/**
 * Model for Ride Request data.
 */
export class RideRequestModel {
  constructor(data = {}) {
    this.riderequest_occname = data.riderequest_occname || "";
    this.riderequest_operatormobile = data.riderequest_operatormobile || "";
    this.riderequest_mobilenumber = data.riderequest_mobilenumber || "";
    this.riderequest_pickupgps = data.riderequest_pickupgps || ""; // e.g., "latitude,longitude"
    this.riderequest_startloc = data.riderequest_startloc || "";
    this.riderequest_destination = data.riderequest_destination || "";
    this.riderequest_expstarttime = data.riderequest_expstarttime || ""; // Expected format: "YYYY-MM-DD HH:MM:SS"
    this.riderequest_vehicletype = data.riderequest_vehicletype || ""; // This will be the string value from select
    this.riderequest_passengerscount = data.riderequest_passengerscount || "";
    this.riderequest_ridefor = data.riderequest_ridefor || ""; // e.g., "Self", "Other"
    this.riderequest_ridecontact = data.riderequest_ridecontact || ""; // Contact number if ridefor is "Other"
    this.riderequest_generatedtime = data.riderequest_generatedtime || ""; // Expected format: "YYYY-MM-DD HH:MM:SS"
  }

  /**
   * Returns a JSON representation suitable for API submission.
   * @returns {object}
   */
  toPayload() {
    return {
      riderequest_occname: this.riderequest_occname,
      riderequest_operatormobile: this.riderequest_operatormobile,
      riderequest_mobilenumber: this.riderequest_mobilenumber,
      riderequest_pickupgps: this.riderequest_pickupgps,
      riderequest_startloc: this.riderequest_startloc,
      riderequest_destination: this.riderequest_destination,
      riderequest_expstarttime: this.riderequest_expstarttime,
      riderequest_vehicletype: this.riderequest_vehicletype,
      riderequest_passengerscount: this.riderequest_passengerscount,
      riderequest_ridefor: this.riderequest_ridefor,
      riderequest_ridecontact: this.riderequest_ridecontact,
      riderequest_generatedtime: this.riderequest_generatedtime,
    };
  }
}