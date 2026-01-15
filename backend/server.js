const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const habitRoutes = require("./routes/habitRoutes");

dotenv.config();

const app = express();

// middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(express.json());

// connect to database
connectDB();

app.use("/api/habits", habitRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Habit Tracker API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
