const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");

const HttpError = require("./models/http-error");

app.use(
  cors({
    origin: "http://localhost:5000",
    optionsSuccessStatus: 200,
  })
);

app.use(express.json(), express.urlencoded({ extended: true }));

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

// Handler for unnamed routes
app.use(() => {
  throw new HttpError("Could not find this route,", 404);
});

//Error handling custom middleware
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .send({ message: error.message || "An unknown error occured!" });
});

const port = process.env.PORT || 8000;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qyfmf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    app.listen(port, () => console.log(`Listening on port ${port}`));
  })
  .catch(() => {
    return new HttpError(
      `Couldn't establish connection with the database, please try again.`
    );
  });
