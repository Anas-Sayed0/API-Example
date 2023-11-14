class AppError extends Error {
  constructor() {
    super();
  }

  create(message, statusCode, httpStatusText) {
    this.message = message;
    this.statusCode = statusCode;
    this.httpStatusText = httpStatusText;
    return this;
  }
}

module.exports = new AppError();
