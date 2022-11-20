require("dotenv").config();
const express = require("express");
const db = require("./Database/database");
db();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 5050;
app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});
app.use("/", require("./routes"));
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
