const mongoose = require("mongoose");

// ========================================
// PLAYER SCHEMA
// ========================================
const playerSchema =
  new mongoose.Schema({
    surname: {
      type: String,
      default: "",
    },

    number: {
      type: String,
      default: "",
    },

    jersey: {
      type: String,
      default: "None",
    },

    shorts: {
      type: String,
      default: "None",
    },

    warmer: {
      type: String,
      default: "None",
    },

    tshirt: {
      type: String,
      default: "None",
    },

    jerseyPrint: {
      type: Boolean,
      default: false,
    },

    jerseyCheck: {
      type: Boolean,
      default: false,
    },

    shortsPrint: {
      type: Boolean,
      default: false,
    },

    shortsCheck: {
      type: Boolean,
      default: false,
    },

    warmerPrint: {
      type: Boolean,
      default: false,
    },

    warmerCheck: {
      type: Boolean,
      default: false,
    },

    tshirtPrint: {
      type: Boolean,
      default: false,
    },

    tshirtCheck: {
      type: Boolean,
      default: false,
    },

    finalCheck: {
      type: Boolean,
      default: false,
    },
  });

// ========================================
// TASK SCHEMA
// ========================================
const taskSchema =
  new mongoose.Schema(
    {
      customer: {
        type: String,
        required: true,
      },

      messenger: {
        type: String,
        default: "",
      },

      deadline: {
        type: String,
        required: true,
      },

      image: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        default: "LAYOUT",
      },

      // ========================================
      // PLAYER TABLE
      // ========================================
      players: {
        type: [playerSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Task",
  taskSchema
);