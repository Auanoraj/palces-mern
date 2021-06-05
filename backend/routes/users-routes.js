const express = require("express");
const router = express();
const { check } = require("express-validator");

const fileUpload = require("../middlewares/custom-multer");

const userControllers = require("../controllers/users-controllers");

router.get("/", userControllers.fetchUsers);
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").not().isEmpty(),
    check("password").not().isEmpty().isLength({ min: 6 }),
  ],
  userControllers.createUser
);
router.post(
  "/login",
  [check("email").not().isEmpty(), check("password").not().isEmpty()],
  userControllers.loginUser
);

module.exports = router;
