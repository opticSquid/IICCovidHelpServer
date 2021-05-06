const mongoose = require("mongoose");
const schema = mongoose.Schema;
let HeathCentre = new schema({
  FacilityName: {
    type: String,
    required: true,
  },
  CreatorEmail: {
    type: String,
    required: true,
  },
  Rating:String,
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
    Text: {
      type: String,
      required: true,
    },
  },
  Beds:{
      Normal: String,
      ICU: String,
  },
  Oxygen:String,
},{ timestamps: true });
HeathCentre.index({ "Address.Location": "2dsphere" });
module.exports = mongoose.model("HealthCentre", HeathCentre);
