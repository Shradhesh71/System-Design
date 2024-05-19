const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 9000;
const responseTime = require("response-time");
const { connect } = require("./db/connect");
const cookiePaser = require("cookie-parser");
const logger = require("./grafana/loki");
const client = require("prom-client"); // metrix collection

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });

const reqResTime = new client.Histogram({  
  name: "http_express_req_res_time",
  help: "This tells how much time is taken by req and res",
  labelNames: ["method", "route", "status_code"],
  buckets: [1, 50, 100, 200, 500, 800, 1000, 1500],
});

const totalReqCounter = new client.Counter({
  name: "total_req",
  help: "Tells total request",
});

app.use(
  responseTime((req, res, time) => {
    reqResTime
      .labels({
        method: req.method,
        route: req.url,
        status_code: res.status_code,
      })
      .observe(time);
  })
);

const login = require("./routes/login");
const register = require("./routes/register");
const enqueue = require("./routes/enqueue");
const metrics = require("./routes/metrics");

connect();

app.get("/", (req, res) => {
  try {
    logger.info("Request come from live server / router");
    res.send("Wohoo, backend is live now!!!");
  } catch (error) {
    logger.error(error.message);
    console.log(error);
    return res.status(404).json({
      error: error.message,
      success: false,
    });
  }
});

app.use("/register", register);
app.use("/login", login);
app.use("/enqueue", enqueue);
app.use("/metrics", metrics);

app.use(cookiePaser());

app.listen(port, () => {
  console.log(`The Website started successfully on port ${port}`);
});
