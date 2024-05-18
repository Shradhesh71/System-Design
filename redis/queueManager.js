const client = require("./client");

const enqueueRequest = (queueName, request) => {
  client.rpush(queueName, JSON.stringify(request), (err, reply) => {
    if (err) {
      console.error("Error enqueueing request:", err);
    } else {
      console.log(`Enqueued request in ${queueName}: ${reply}`);
    }
  });
};

const dequeueRequest = (queueName, callback) => {
  client.lpop(queueName, (err, reply) => {
    if (err) {
      console.error("Error dequeuing request:", err);
      callback(err);
    } else if (reply) {
      callback(null, JSON.parse(reply));
    } else {
      callback(null, null); // No request in the queue
    }
  });
};

module.exports = { enqueueRequest, dequeueRequest };
