require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const httpStatusText = require("./utils/httpStatusText");
const path = require("path");

const url = process.env.MONGODB_URL;
mongoose.connect(url).then(() => {
  console.log("Connected to the database!");
});

const port = process.env.PORT;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());

const coursesRouter = require("./routes/courses.route");
const usersRouter = require("./routes/users.route");

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

//global middleware for notfound routes
app.all("*", (req, res) => {
  res
    .status(404)
    .json({ status: httpStatusText.ERROR, message: "Route not found" });
});

//global middleware for error handling
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.httpStatusText || httpStatusText.ERROR,
    message: err.message,
    code: err.statusCode || 500,
    data: null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
