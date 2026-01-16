const express = require("express");
const Habit = require("../models/Habit");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// GET all habits
router.get("/", auth, async (req, res) => {
  const habits = await Habit.find({ user: req.userId });
  res.json(habits);
});

// ADD habit
router.post("/", auth, async (req, res) => {
  const habit = await Habit.create({
    name: req.body.name,
    user: req.userId,
  });
  res.json(habit);
});

// TOGGLE habit day
router.patch("/:id", auth, async (req, res) => {
  const { date, status } = req.body;

  const habit = await Habit.findOne({
    _id: req.params.id,
    user: req.userId,
  });

  if (!habit) {
    return res.status(404).json({ message: "Habit not found" });
  }

  habit.records.set(date, status);
  await habit.save();

  res.json(habit);
});

// DELETE habit
router.delete("/:id", auth, async (req, res) => {
  await Habit.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  res.json({ message: "Habit deleted" });
});

module.exports = router;
