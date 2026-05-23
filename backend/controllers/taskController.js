const Task = require("../models/Task");

// =========================
// GET TASKS
// =========================
const getTasks = async (req, res) => {
  try {

    const tasks = await Task.find().sort({
      createdAt: -1,
    });

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// =========================
// CREATE TASK
// =========================
const createTask = async (req, res) => {
  try {

    const newTask = new Task({
      customer: req.body.customer,
      messenger: req.body.messenger,
      deadline: req.body.deadline,
      image: req.body.image,
      status: req.body.status,
    });

    const savedTask =
      await newTask.save();

    res.status(201).json(savedTask);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  createTask,
};



// =========================
// UPDATE TASK
// =========================
const updateTask = async (req, res) => {
  try {

    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(updatedTask);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// =========================
// DELETE TASK
// =========================
const deleteTask = async (req, res) => {
  try {

    await Task.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};