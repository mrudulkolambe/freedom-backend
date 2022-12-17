const mongoose = require("mongoose");

const specialitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    }
  },
);

module.exports = mongoose.model("speciality", specialitySchema);
