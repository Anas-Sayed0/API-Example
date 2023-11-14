const express = require("express");
const controller = require("../controllers/courses.controller");
const { validationSchema } = require("../middlewares/validationSchema");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middlewares/allowedTo");

router
  .route("/")
  .get(controller.getAllCourses)
  .post(verifyToken, validationSchema(), controller.createNewCourse);

router
  .route("/:id")
  .get(controller.getSingleCourse)
  .patch(verifyToken, controller.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANGER),
    controller.deleteCourse
  );

module.exports = router;
