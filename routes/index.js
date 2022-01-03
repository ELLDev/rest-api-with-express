const express = require("express");
const router = express.Router();
const user = require("./user");
const course = require("./course");

router.use("/users", user);
router.use("/courses", course);

module.exports = router;
