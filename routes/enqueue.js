const { Router } = require("express");
const { enqueueRequest } = require('../redis/queueManager');
const secret = process.env.SECERT_JWT_TOKEN;

const router = Router();

// Enqueue request route
router.post('/enqueue', (req, res) => {
    const { token, request } = req.body;
    try {
      const decoded = jwt.verify(token, secret);
      const queueName = `queue_${decoded.username}`;
      enqueueRequest(queueName, request);
      res.status(200).send('Request enqueued');
    } catch (err) {
      res.status(401).send('Unauthorized');
    }
  });

module.exports = router;
