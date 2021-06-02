const mongoose = require("mongoose");
const schema = mongoose.Schema;

let Review = new mongoose.Schema({
  creator: {
    type: String,
    requied: true,
  },
  messege: String,
});

let HeathCentre = new schema(
  {
    uid: {
      type: String,
      required: true,
    },
    FacilityName: {
      type: String,
      required: true,
    },
    CreatorEmail: {
      type: String,
      required: true,
    },
    Email: String,
    PhoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    Beds: {
      Normal: Number,
      ICU: Number,
    },
    Oxygen: Number,
    CovidVaccines: {
      Available: Boolean,
      VaccineName: String,
      Quantity: Number,
    },
    Doctors: Number,
    Address: {
      // Location: {
      //   type: "Point",
      //   coordinates: [longitude,latitude],
      // },
      Location: {
        type: {
          type: String,
          enum: ["Point"],
        },
        coordinates: {
          type: [Number],
        },
        required: true,
      },
      StreetAddress: { State: String, District: String, City: String },
    },
    Rating: [Number],
    verified: Boolean,
    Reviews: {
      type: [Review],
    },
  },
  //TimeStamps will  be autometically created when data is new data is created or existing data is updated through backend route
  { timestamps: true }
);
HeathCentre.index({ "Address.Location": "2dsphere" });
module.exports = mongoose.model("HealthCentre", HeathCentre);
