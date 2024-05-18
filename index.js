const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 9000;
const { connect } = require("./db/connect");
const cookiePaser = require("cookie-parser");
// const { enqueueRequest } = require('./redis/queueManager');

const login = require("./routes/login");
const register = require("./routes/register");
const enqueue = require("./routes/enqueue");

connect();

//testing live connecting connection
app.get("/", (req, res) => {
  res.send("Wohoo, backend is live now!!!");
});

app.use("/register", register);
app.use("/login", login);
app.use("/enqueue", enqueue);

app.use(cookiePaser());

app.listen(port, () => {
  console.log(`The Website started successfully on port ${port}`);
});
