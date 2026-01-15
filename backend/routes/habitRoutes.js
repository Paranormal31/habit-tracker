const express = require("express");
const Habit = require("../models/Habit");

const router = express.Router();

/**
 * @route   POST /api/habits
 * @desc    Create a new habit
 */
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Habit name is required" });
    }

    const habit = new Habit({ name });
    await habit.save();

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/habits
 * @desc    Get all habits
 */
router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PATCH /api/habits/:id
 * @desc    Mark/unmark habit for a specific date
 */
router.patch("/:id", async (req, res) => {
  try {
    const { date, status } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    habit.records.set(date, status);
    await habit.save();

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/habits/:id
 * @desc    Delete a habit
 */
router.delete("/:id", async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
