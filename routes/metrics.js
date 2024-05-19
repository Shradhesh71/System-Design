const { Router } = require("express");
const client = require("prom-client");

const router = Router();

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

module.exports = router;
