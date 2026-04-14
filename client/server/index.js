require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("MongoDB error:", err));
  

// Habit Schema
const habitSchema = new mongoose.Schema({
  name: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Habit = mongoose.model("Habit", habitSchema);

app.get("/api/habits", async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (err) {
    console.log("GET error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/habits", async (req, res) => {
  try {
    const habit = new Habit({ name: req.body.name });
    await habit.save();
    res.json(habit);
  } catch (err) {
    console.log("POST error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/habits/:id", async (req, res) => {
  try {
    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(habit);
  } catch (err) {
    console.log("PUT error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/habits/:id", async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.log("DELETE error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));