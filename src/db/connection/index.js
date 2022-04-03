const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve("local.env") });

mongoose
  .connect(process.env.DATABASE, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successFull"))
  .catch(() => console.log("not connected"));
