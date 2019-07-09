const express = require("express");
// Cant use app
const router = express.Router(); // case specific

const courses = [
  {
    id: 1,
    name: "course1"
  },
  {
    id: 2,
    name: "course2"
  },
  {
    id: 3,
    name: "course3"
  }
];

router.get("/", (req, res) => {
  res.send(courses);
});
router.get("/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  // 404
  if (!course) {
    res.status(404).send(`The course with id ${req.params.id} was not found.`);
  } else {
    res.send(course);
  }
});

// POST
router.post("/", (req, res) => {
  // Using object destructuring syntax
  const { error } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

// PUT
router.put("/:id", (req, res) => {
  // Look up the course.
  // It nonexistent, return 400
  const course = courses.find(c => c.id === parseInt(req.params.id));
  // 404
  if (!course) {
    return res
      .status(404)
      .send(`The course with id ${req.params.id} was not found.`);
  }

  // result.error
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Update the course
  course.name = req.body.name;
  res.send(course);
});

// DELETE
router.delete("/:id", (req, res) => {
  // Look up the course.
  // It nonexistent, return 400
  const course = courses.find(c => c.id === parseInt(req.params.id));
  // 404
  if (!course) {
    return res
      .status(404)
      .send(`The course with id ${req.params.id} was not found.`);
  }

  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Response
  res.send(course);
});

module.exports = router;
