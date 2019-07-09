const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  //   res.send("Hello world");
  res.render("index", { title: "Hello", message: "Hello" });
});

module.exports = router;
