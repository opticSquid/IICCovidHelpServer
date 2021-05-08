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
    FacilityName: {
      type: String,
      required: true,
    },
    CreatorEmail: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      unique: true,
      required: true,
    },
    PhoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    Beds: {
      Normal: String,
      ICU: String,
    },
    Oxygen: String,
    Address: {
      Location: {
        type: {
          type: String,
          enum: ["Point"],
          requied: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
      StreetAddress: { State: String, District: String, City: String },
    },
    Rating: [Number],
    verified: Boolean,
    Reviews: {
      type: [Review],
    },
  },
  { timestamps: true }
);
HeathCentre.index({ "Address.Location": "2dsphere" });
module.exports = mongoose.model("HealthCentre", HeathCentre);
