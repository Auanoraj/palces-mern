const express = require("express");
const router = express();

const { check } = require("express-validator");

const checkAuth = require("../middlewares/check-auth");
const fileUpload = require("../middlewares/custom-multer");
const placeController = require("../controllers/places-controllers");

router.get("/", placeController.fetchPlaces);
router.get("/:pid", placeController.getPlaceByPlaceId);
router.get("/user/:uid", placeController.getPlaceByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
    check("creator").not().isEmpty(),
  ],
  placeController.createPlace
);
router.put(
  "/:placeId",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placeController.updatePlace
);
router.delete(
  "/",
  [check("placeId").not().isEmpty()],
  placeController.deletePlace
);

module.exports = router;
