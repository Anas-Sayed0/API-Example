const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      const err = appError.create(
        "you are not allowed to access this route",
        403,
        httpStatusText.ERROR
      );
      return next(err);
    }
    next();
  };
};
