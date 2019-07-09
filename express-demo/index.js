// The require("debug") returns a function. So we call that
// function and give it an argument. This argument is an
// arbitrary namespace, we call it app.startup.
const startupDebugger = require("debug")("app.startup");
const dbDebugger = require("debug")("app.db");
const config = require("config");
// require('joi') returns a class. Naming conventions for a class
// is that it starts with an upper-case letter.
const Joi = require("joi");
const logger = require("./logger");
const courses = require("./routes/courses");
const main = require("./routes/main");
const authenticator = require("./authenticator");
const express = require("express");
const app = express();

console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
console.log(`app: ${app.get("env")}`);

// Configuration
console.log("Application name: " + config.get("name"));
console.log("Mail server: " + config.get("mail.host"));
// app_password is coming from an environment variable called app_password
console.log("Mail Password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  //   console.log("Development ...");
  startupDebugger("In development mode");
} else {
  console.log("Production...");
}

// Setting a view engine
app.set("view engine", "pug");
app.set("views", "./views");

// enable JSON middleware
app.use(express.json()); // populates req.body if there is JSON data
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.static("public"));
// any route that starts with "/api/courses" use the courses router
app.use("/api/courses", courses);
// main routes
app.use("/", main);

// Using custom middleware
app.use(logger);
app.use(authenticator);

function validateCourse(course_name) {
  // Validation rules - same as Laravel
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(course_name, schema);
}

// Environment variables
const port = process.env.PORT || 3000;
// app.listen(3000, () => console.log("Listening on port 3000"))
app.listen(port, () => console.log(`Listening on port ${port}`));
