const express = require("express");
const router = express.Router();

const Task = require("../models/Task");

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// ========================================
// GET ALL TASKS
// ========================================
router.get("/", getTasks);

// ========================================
// GET SINGLE TASK
// ========================================
router.get("/:id", async (req, res) => {
  try {

    console.log(
      "GET TASK:",
      req.params.id
    );

    const task =
      await Task.findById(
        req.params.id
      );

    // ========================================
    // TASK NOT FOUND
    // ========================================
    if (!task) {

      return res.status(404).json({
        message:
          "TASK NOT FOUND",
      });
    }

    // ========================================
    // SUCCESS
    // ========================================
    res.status(200).json(task);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "SERVER ERROR",
    });
  }
});

// ========================================
// CREATE TASK
// ========================================
router.post("/", createTask);

// ========================================
// UPDATE TASK
// ========================================
router.put("/:id", updateTask);

// ========================================
// DELETE TASK
// ========================================
router.delete("/:id", deleteTask);

// ========================================
// GET PLAYER TABLE
// ========================================
router.get("/:id/players", async (req, res) => {
  try {

    console.log(
      "GET PLAYERS TASK ID:",
      req.params.id
    );

    const task =
      await Task.findById(
        req.params.id
      );

    // ========================================
    // TASK NOT FOUND
    // ========================================
    if (!task) {

      return res.status(404).json({
        message:
          "TASK NOT FOUND",
      });
    }

    // ========================================
    // SUCCESS
    // ========================================
    res.status(200).json({
      players:
        task.players || [],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "SERVER ERROR",
    });
  }
});

// ========================================
// SAVE PLAYER TABLE
// ========================================
router.post("/:id/players", async (req, res) => {
  try {

    console.log(
      "POST PLAYERS TASK ID:",
      req.params.id
    );

    console.log(
      "BODY:",
      req.body
    );

    const { players } =
      req.body;

    // ========================================
    // UPDATE PLAYERS
    // ========================================
    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        {
          players,
        },
        {
          new: true,
        }
      );

    // ========================================
    // TASK NOT FOUND
    // ========================================
    if (!updatedTask) {

      return res.status(404).json({
        message:
          "TASK NOT FOUND",
      });
    }

    // ========================================
    // SUCCESS
    // ========================================
    res.status(200).json({
      message:
        "PLAYER DATA SAVED",
      task: updatedTask,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "SERVER ERROR",
    });
  }
});

module.exports = router;