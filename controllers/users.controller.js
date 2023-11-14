const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const User = require("../models/user.model");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const err = appError.create(
      "user already registered",
      400,
      httpStatusText.FAIL
    );
    return next(err);
  }

  //password hashing

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });

  //generate jwt token

  const token = await generateToken({
    email: newUser.email,
    id: newUser.id,
    role: newUser.role,
  });
  newUser.token = token;

  await newUser.save();
  res.status(201).json({ status: httpStatusText.SUCCESS, data: { newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    const err = appError.create(
      "please provide email and password",
      400,
      httpStatusText.FAIL
    );
    return next(err);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const err = appError.create("user not found", 404, httpStatusText.FAIL);
    return next(err);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    const token = await generateToken({
      email: user.email,
      id: user.id,
      role: user.role,
    });

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  }
  const err = appError.create(
    "check your email and password",
    400,
    httpStatusText.FAIL
  );
  return next(err);
});

module.exports = {
  getAllUsers,
  register,
  login,
};
