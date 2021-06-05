const Axios = require("axios");

const HttpError = require("../models/http-error");

const getCoordsForAddress = async (address) => {
  let coordinates;

  await Axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}+CA&key=${process.env.GOOGEL_API_KEY}`
  )
    .then((res) => {
      const { results, status } = res.data;

      if (status !== "ZERO_RESULTS") coordinates = results[0].geometry.location;
    })
    .catch((err) => {
      console.log(err);

      throw new HttpError(
        "Could not find coordinates for the specified address.",
        422
      );
    });

  return coordinates;
};

module.exports = getCoordsForAddress;
