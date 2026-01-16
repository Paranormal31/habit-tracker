const express = require("express");
const Habit = require("../models/Habit");

const router = express.Router();

// GET all habits
router.get("/", async (req, res) => {
  const habits = await Habit.find().sort({ createdAt: -1 });
  res.json(habits);
});

// ADD habit
router.post("/", async (req, res) => {
  const habit = await Habit.create({ name: req.body.name });
  res.json(habit);
});

// TOGGLE habit day
router.patch("/:id", async (req, res) => {
  const { date, status } = req.body;

  const habit = await Habit.findById(req.params.id);
  habit.records.set(date, status);
  await habit.save();

  res.json(habit);
});

// DELETE habit
router.delete("/:id", async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.json({ message: "Habit deleted" });
});

module.exports = router;
