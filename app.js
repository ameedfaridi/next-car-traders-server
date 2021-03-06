const express = require("express");
const app = express();
const router = require("./src/route/index");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(">Server running on", PORT);
});
