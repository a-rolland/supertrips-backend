const mongoose = require("mongoose");
const DB_URI = process.env.DB_URI || "mongodb://localhost/supertrips";

mongoose
.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
  .then((x) => {
    console.log(
      `Successfully connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
    process.exit(1);
  });