const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./src/config/dbConnection");
const cors = require("cors");

connectDb();
const app = express();
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
  origin: ["http://localhost:3000"],
};
console.log();
app.use("*", cors(corsOptions));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const port = process.env.PORT || 8000;

app.use(express.json());

// Logger middleware
app.all("*", (req, res, next) => {
  console.log("Request:", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  next();
});

app.use("/api", require("./src/api/routes/router"));

app.listen(port, () => {
  console.log("Server is running on port ", port);
});
