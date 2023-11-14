const Course = require("../models/course.model");
const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");

const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { courses } });
});

const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    const err = appError.create("Course not found", 404, httpStatusText.FAIL);
    return next(err);
  }
  return res.json({ status: httpStatusText.SUCCESS, data: { course } });
});

const createNewCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(err);
  }
  const newCourse = new Course(req.body);
  await newCourse.save();

  res.json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const findCourse = await Course.findById(req.params.id);
  if (!findCourse) {
    const err = appError.create("course not found", 400, httpStatusText.FAIL);
    next(err);
  }
  const updatedCourse = await Course.updateOne(
    { _id: id },
    {
      $set: { ...req.body },
    }
  );
  return res.json({
    status: httpStatusText.SUCCESS,
    data: { course: updatedCourse },
  });
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
  const deletedCourse = await Course.findByIdAndDelete(req.params.id);
  if (!deletedCourse) {
    const err = appError.create("course not found", 404, httpStatusText.FAIL);
    return next(err);
  }
  return res.json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  createNewCourse,
  updateCourse,
  deleteCourse,
};
