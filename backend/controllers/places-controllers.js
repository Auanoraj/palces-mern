const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const fs = require("fs");

const getCoordsForAddress = require("../utils/location");

const HttpError = require("../models/http-error");
const Place = require("../models/placeSchema");
const User = require("../models/userSchema");

const fetchPlaces = (req, res, next) => {
  Place.find({})
    .then((places) => {
      if (places) res.status(200).send(places);
      else res.status(200).send(`There are no places.`);
    })
    .catch(() => {
      return next(new HttpError(`Oops, something went wrong`, 422));
    });
};

const getPlaceByPlaceId = async (req, res, next) => {
  let { pid } = req.params,
    place;

  try {
    place = await Place.findById({ _id: pid });
  } catch (err) {
    return next(
      new HttpError(`The requested id "${pid}" is not present.`, 404)
    );
  }

  res.status(200).send(place);
};

const getPlaceByUserId = async (req, res, next) => {
  let { uid } = req.params,
    places;

  try {
    places = await User.findById(uid).populate("places");
  } catch (err) {
    return next(
      new HttpError(`The requested id "${uid}" is not present.`, 404)
    );
  }

  res.status(200).send(places);
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { title, description, address } = req.body;

  const coordinates = await getCoordsForAddress(address);

  const user = await User.findOne({ _id: req.userData.userId });

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    creator: req.userData.userId,
    image: req.file.path,
  });

  if (user) {
    try {
      //Transactions let you execute multiple operations in isolation and potentially undo all the operations if one of them fails.

      //Start session to create transaction.
      const session = await mongoose.startSession();
      session.startTransaction();

      // New Place is created.
      await createdPlace.save({ session: session });

      //Push the new created place to the existing array of places(user).
      user.places.push(createdPlace);

      //Save the user into DB
      await user.save({ session: session });

      // Once the transaction is committed, the write operation becomes
      // visible outside of the transaction.
      await session.commitTransaction();
    } catch (err) {
      return next(
        new HttpError(`Something went wrong, couldn't create place.`, 422)
      );
    }
  } else {
    return next(
      new HttpError(
        `Something went wrong, couldn't find the user id of ${req.userData.userId}.`,
        404
      )
    );
  }

  res.status(201).send(createdPlace);
};

const updatePlace = (req, res, next) => {
  const { title, address, description } = req.body,
    { placeId } = req.params;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError(`Invalid ${placeId}.`, 422);
  }

  const location = getCoordsForAddress(address);

  Place.findByIdAndUpdate(
    { _id: placeId },
    {
      title,
      address,
      description,
      creator: req.userData.userId,
      location,
    }
  )
    .then((place) => {
      if (place) return res.status(200).send("Successfully updated the place.");
    })
    .catch(() => {
      return next(
        new HttpError(
          `The requested place id "${placeId}" is not present.`,
          404
        )
      );
    });
};

const deletePlace = async (req, res, next) => {
  const { placeId } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError(`Invalid ${placeId}.`, 422);
  }

  let place;

  try {
    place = await Place.findById({ _id: placeId }).populate("creator");
  } catch (err) {
    return next(new HttpError(`Couldn't find place with id ${placeId}.`, 422));
  }

  if (place.creator._id.toString() === req.userData.userId) {
    if (place) {
      let userId = place.creator._id,
        user;

      try {
        user = await User.findById(userId);
      } catch (err) {
        return next(
          new HttpError(`The requested id "${userId}" is not present.`, 404)
        );
      }

      let updatedPlaces = user.places.filter((pId) => pId != placeId);

      Promise.all([
        User.findByIdAndUpdate(userId, { places: updatedPlaces }),
        Place.findByIdAndDelete(placeId),
      ])
        .then(() => {
          fs.unlink(place.image, (err) => {
            console.log(err);
          });
          res.status(200).send("Successfully deleted the place.");
        })
        .catch(() => {
          return next(
            new HttpError(
              `Oops, something is not right, please check user id and place id.`,
              404
            )
          );
        });
    } else {
      return next(
        new HttpError(`Couldn't find place with id ${placeId}.`, 422)
      );
    }
  } else {
    return next(
      new HttpError("Authentication failed, you are not allowed", 401)
    );
  }
};

module.exports = {
  fetchPlaces,
  getPlaceByPlaceId,
  getPlaceByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
