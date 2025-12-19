// backend/server.js

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const protocolRoutes = require("./routes/protocols");
const therapistRoutes = require("./routes/therapist");
const sessionRoutes = require("./routes/sessions");
const notificationRoutes = require("./routes/notifications");
const userRoutes = require("./routes/user"); // <--- IMPORT

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protocols", protocolRoutes);
app.use("/api/therapist", therapistRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user", userRoutes); // <--- REGISTER

app.get("/", (req, res) => {
  res.send("Rehabilitation Backend API is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
