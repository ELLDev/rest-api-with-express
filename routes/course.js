const express = require("express");
const router = express.Router();
const Course = require("../models").Course;
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
  asyncHandler(async (req, res) => {
    let courses;
    let course;
    let user;
    try {
      templateData = [];
      courses = await Course.findAll();
      for (let i = 0; i < courses.length; i++) {
        course = courses[i];
        user = await User.findByPk(courses[i].userId);
        pair = { course, user };
        templateData.push(pair);
      }
      res.status(200).send(templateData);
    } catch (error) {
      res.status(400).send(error);
    }
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    let course;
    let user;
    try {
      course = await Course.findByPk(req.params.id);
      user = await User.findByPk(course.userId);
      templateData = { course, user };
      res.status(200).send(templateData);
    } catch {
      res.status(404).json({ message: "Course not found." });
    }
  })
);

router.post(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    let course;
    try {
      course = await Course.create(req.body);
      res.location(`/api/courses/${course.id}`);
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

router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    let course;
    try {
      course = await Course.findByPk(req.params.id);
      await course.update(req.body);
      res.status(204).end();
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

router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    course.destroy();
    res.status(204).end();
  })
);

module.exports = router;
