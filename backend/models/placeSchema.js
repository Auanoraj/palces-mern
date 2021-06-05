const { model, Schema, Types } = require("mongoose");

const placeSchema = new Schema({
  title: {
    type: String,
    requried: true,
  },
  description: {
    type: String,
    requried: true,
  },
  image: {
    type: String,
    requried: true,
  },
  address: {
    type: String,
    requried: true,
  },
  creator: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
});

module.exports = model("Place", placeSchema);
