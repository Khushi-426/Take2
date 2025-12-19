// backend/routes/auth.js

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

// helper to create JWT
const createToken = (user) => {
  const payload = {
    user: {
      id: user.id,
      role: user.role,
    },
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });
};

// GET LOGGED IN USER
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// THERAPIST REGISTER
router.post("/therapist/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Please enter all fields." });

  try {
    let existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists." });

    const user = new User({ email, password, role: "THERAPIST" });
    await user.save();
    return res
      .status(201)
      .json({ message: "Therapist registered successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// PATIENT REGISTER
router.post("/patient/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Please enter all fields." });

  try {
    let existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists." });

    const user = new User({ email, password, role: "PATIENT" });
    await user.save();
    return res
      .status(201)
      .json({ message: "Patient registered successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// LOGIN (Universal for now, or keep separate if preferred)
router.post("/therapist/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Please enter all fields." });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });
    if (user.role !== "THERAPIST")
      return res.status(403).json({ message: "Not a therapist account." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = createToken(user);
    // UPDATED: Return user details along with token
    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// PATIENT LOGIN (Add this if you are logging in as a patient)
router.post("/patient/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Please enter all fields." });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    // Allow patients only
    if (user.role !== "PATIENT")
      return res.status(403).json({ message: "Not a patient account." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = createToken(user);
    // UPDATED: Return user details along with token
    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
