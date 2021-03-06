require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const passport = require("passport");
const cors = require("cors");

require("./configs/passport");
require("./configs/cloudinary");
require("./configs/db");

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));

// Express View engine setup
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "build")));
// app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use(favicon(path.join(__dirname, "build", "favicon.ico")));

const session = require("./configs/session");
session(app);

app.use(passport.initialize());
app.use(passport.session());

// Default value for title local
app.locals.title = "Supertrips";

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

const index = require("./routes/index");
const authRoutes = require("./routes/auth-routes");
const tripRoutes = require("./routes/trip-routes");
const stepRoutes = require("./routes/step-routes");
const experienceRoutes = require("./routes/experience-routes");
app.use("/", index);
app.use("/api", authRoutes);
app.use("/api", tripRoutes);
app.use("/api", stepRoutes);
app.use("/api", experienceRoutes);

app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  // res.sendFile(__dirname + "/public/index.html");
  res.sendFile(__dirname + "/build/index.html");
});

module.exports = app;
