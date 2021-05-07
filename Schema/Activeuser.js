const mongoose = require("mongoose");
const schema = mongoose.Schema;
let ActiveUser = new schema({
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Refresh_Token:{
        type: String,
        required: true
    }
  });
  module.exports = mongoose.model("ActiveUser", ActiveUser);