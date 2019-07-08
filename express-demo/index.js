// require('joi') returns a class. Naming conventions for a class
// is that it starts with an upper-case letter.
const Joi = require('joi');
const express = require("express");
const app = express();

// enable JSON middleware
app.use(express.json());

// Middleware - authentication
app.use((req, res, next) => {
    console.log("Authenticating ...");
    next(); // Important! without next(), the request hangs
});

function validateCourse(course_name) {
    // Validation rules - same as Laravel
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course_name, schema);
}

const courses = [{
        id: 1,
        name: 'course1'
    },
    {
        id: 2,
        name: 'course2'
    },
    {
        id: 3,
        name: 'course3'
    }
];

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // 404
    if (!course) {
        res.status(404).send(`The course with id ${req.params.id} was not found.`);
    } else {
        res.send(course);
    }
});

// Route to describe req parameters and query strings
app.get("/api/posts/:year/:month", (req, res) => {
    //   res.send(req.params);
    res.send(req.query);
});

// POST
app.post('/api/courses', (req, res) => {

    // Using object destructuring syntax
    const {
        error
    } = validateCourse(req.body);

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
app.put('/api/courses/:id', (req, res) => {
    // Look up the course. 
    // It nonexistent, return 400
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // 404
    if (!course) {
        return res.status(404).send(`The course with id ${req.params.id} was not found.`);
    }

    // result.error
    const {
        error
    } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the course
    course.name = req.body.name;
    res.send(course);

});

// DELETE
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course. 
    // It nonexistent, return 400
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // 404
    if (!course) {
        return res.status(404).send(`The course with id ${req.params.id} was not found.`);
    }

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Response
    res.send(course);

});

// Environment variables
const port = process.env.PORT || 3000;
// app.listen(3000, () => console.log("Listening on port 3000"))
app.listen(port, () => console.log(`Listening on port ${port}`));