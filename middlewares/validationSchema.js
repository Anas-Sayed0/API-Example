const { body } = require("express-validator");

const validationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLength({ min: 3 })
      .withMessage("title must be at least 3 characters long"),
    body("price")
      .notEmpty()
      .withMessage("price is required")
      .isNumeric()
      .withMessage("Price must be a number"),
  ];
};

module.exports = {
  validationSchema,
};
