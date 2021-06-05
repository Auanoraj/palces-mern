const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userSchema");
const HttpError = require("../models/http-error");

const fetchUsers = async (req, res) => {
  let users = await User.find({}, "-password");

  if (users) {
    res.status(200).send(users);
  } else {
    res.status(200).send("There are no users ...");
  }
};

const createUser = async (req, res, next) => {
  const { email, name, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let errDetail = errors.errors.map(({ param }) => param).toString();

    return next(
      new HttpError(
        `Invalid inputs passed, please check your ${errDetail}. `,
        422
      )
    );
  }

  let userExists = await User.findOne({ email });

  if (userExists) {
    return next(
      new HttpError(`User with the ${email} already exist, please login.`, 409)
    );
  }

  let createdUser = new User({
    email,
    name,
    password: bcrypt.hashSync(password, 10),
    image: req.file.path,
  });

  try {
    let token;

    await createdUser.save();

    try {
      token = jwt.sign(
        {
          userId: createdUser.id,
          email: createdUser.email,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "6h",
        }
      );
    } catch (err) {
      return next(new HttpError(`Authentication failed`, 401));
    }

    res.status(201).send({ creatorId: createdUser._id, token });
  } catch (err) {
    return next(
      new HttpError(`Something went wrong, couldn't create place.`, 422)
    );
  }
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError(`Invalid inputs passed, please check your data..`, 422);
  }

  User.findOne({ email })
    .then((existingUser) => {
      let isPasswordValid = bcrypt.compareSync(password, existingUser.password);

      if (existingUser && isPasswordValid) {
        let token;

        try {
          token = jwt.sign(
            {
              userId: existingUser._id,
              email: existingUser.email,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "12h",
            }
          );
        } catch (err) {
          return next(new HttpError(`Authentication failed`, 401));
        }

        res.status(200).send({ creatorId: existingUser._id, token });
      } else {
        return next(
          new HttpError(`Credentials are not matching, please check.`)
        );
      }
    })
    .catch(() => {
      return next(new HttpError(`Oops, something went wrong`, 400));
    });
};

module.exports = {
  fetchUsers,
  createUser,
  loginUser,
};
