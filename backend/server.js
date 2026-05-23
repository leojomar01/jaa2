const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db.js");

const taskRoutes = require(
  "./routes/taskRoutes.js"
);

const app = express();

// =========================
// DATABASE
// =========================
connectDB();

// =========================
// MIDDLEWARE
// =========================
 app.use(
  cors({
    origin: [
      "https://jaa2-8rr6.vercel.app",
      "https://jaa2-8rr6-g864u4v2t-leojomar01s-projects.vercel.app",
    ],
  })
);

app.use(express.json());

// =========================
// ROUTES
// =========================
app.use(
  "/api/tasks",
  taskRoutes
);


// =========================
// PORT
// =========================
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});
