const { dequeueRequest } = require("../redis/queueManager");
const Task = require("../models/task");

const processQueue = (queueName) => {
  const processRequest = async (request) => {
    try {
      console.log(`Processing ${request.type} request`);
      switch (request.type) {
        case "create":
          await handleCreate(request.data);
          break;
        case "update":
          await handleUpdate(request.data);
          break;
        case "delete":
          await handleDelete(request.data);
          break;
        default:
          console.log(`Unknown request type: ${request.type}`);
      }
    } catch (error) {
      console.error(`Error processing request: ${error.message}`);
    }
  };

  const handleCreate = async (data) => {
    const task = new Task(data);
    await task.save();
    console.log(`Created task: ${task._id}`);
  };

  const handleUpdate = async (data) => {
    const { id, ...updateData } = data;
    const task = await Task.findByIdAndUpdate(id, updateData, { new: true });
    if (task) {
      console.log(`Updated task: ${task._id}`);
    } else {
      console.log(`Task not found: ${id}`);
    }
  };

  const handleDelete = async (data) => {
    const { id } = data;
    const task = await Task.findByIdAndDelete(id);
    if (task) {
      console.log(`Deleted task: ${task._id}`);
    } else {
      console.log(`Task not found: ${id}`);
    }
  };

  const pollQueue = () => {
    dequeueRequest(queueName, (err, request) => {
      if (request) {
        processRequest(request);
      }
      setTimeout(pollQueue, 1000); // Poll every second
    });
  };

  pollQueue();
};

processQueue("clientQueue1"); // Example queue for a client
