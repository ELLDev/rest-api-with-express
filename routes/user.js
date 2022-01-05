const express = require("express");
const router = express.Router();
const User = require("../models").User;
const { authenticateUser } = require("../middleware/auth-user");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

router.get(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    let user;
    try {
      user = req.currentUser;
      res.location('/');
      res.status(200).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    let user;
    try {
      user = await User.create(req.body);
      res.status(201).end();
    } catch (error) {
      console.log("ERROR: ", error.name);
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
