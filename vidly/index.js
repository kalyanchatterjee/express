const express = require("express");
const app = express();
const Joi = require("@hapi/joi");

// enable JSON middleware
app.use(express.json());

const genres = [
  { id: 1, name: "Comedy" },
  { id: 2, name: "Action" },
  { id: 3, name: "Romance" },
  { id: 4, name: "Kids" }
];

// GET
app.get("/", (req, res) => {
  res.send("Welcome to Vidly!");
});
app.get("/api/genres", (req, res) => {
  res.send(genres);
});
// Get specifin genre
app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find(genre => genre.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send(`Genre with id ${req.params.id} was not found.`);
  } else {
    res.send(genre);
  }
});

function validateGenre(genre_name) {
  const schema = Joi.object().keys({
    name: Joi.string()
      .min(3)
      .max(30)
      .required()
  });

  return Joi.validate(genre_name, schema);
}

// POST - add a new genre
app.post("/api/genres", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);

  res.send(genre);
});

// PUT - update an existing genre
app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  // 404
  if (!genre) {
    return res
      .status(404)
      .send(`The genre with id ${req.params.id} was not found.`);
  }

  // result.error
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Update the course
  genre.name = req.body.name;
  res.send(genre);
});

// Delete
app.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  // 404
  if (!genre) {
    return res
      .status(404)
      .send(`The genre with id ${req.params.id} was not found.`);
  }

  // Delete
  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  // Response
  res.send(genre);
});

// Environment variables
const port = process.env.PORT || 3000;
// app.listen(3000, () => console.log("Listening on port 3000"))
app.listen(port, () => console.log(`Listening on port ${port}`));
