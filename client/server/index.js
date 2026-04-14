require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("MongoDB error:", err));

  const jwt = require("jsonwebtoken");
const SECRET = "studyflow_secret";

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Update Habit Schema to link to a user
const habitSchema = new mongoose.Schema({
  name: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  userId: String, // 👈 add this
});
const Habit = mongoose.model("Habit", habitSchema);

// Middleware to check token
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already used" });
    const hashedPassword = await bcrypt.hash(password, 10); // ✅ hash it
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET);
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // ✅ find by email only
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password); // ✅ compare hash
    if (!match) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET);
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update habits routes to use auth + userId
app.get("/api/habits", auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/habits", auth, async (req, res) => {
  try {
    const habit = new Habit({ name: req.body.name, userId: req.user.id });
    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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