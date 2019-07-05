// require('joi') returns a class. Naming conventions for class
// is that it start with an upper case.
const Joi = require('joi');
const express = require("express");
const app = express();

// enable JSON middleware
app.use(express.json());

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
]

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/api/courses", (req, res) => {
    res.send([1, 2, 3]);
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
    // Validation rules - same as Laravel
    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);
    // console.log(result);

    // Manual validation
    // if (!req.body.name || req.body.name.length < 3) {
    //     res.status(400).send("name is required and should be at least 3 characters");
    //     return;
    // }

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up the course. 
    // It nonexistent, return 400
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // 404
    if (!course) {
        res.status(404).send(`The course with id ${req.params.id} was not found.`);
    } else {
        const schema = {
            name: Joi.string().min(3).required()
        };

        const result = Joi.validate(req.body, schema);

        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
    }

    // Update the course
    course.name = req.body.name;
    res.send(course);

});

// Environment variables
const port = process.env.PORT || 3000;
// app.listen(3000, () => console.log("Listening on port 3000"))
app.listen(port, () => console.log(`Listening on port ${port}`));