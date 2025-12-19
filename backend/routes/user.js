// backend/routes/user.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Session = require("../models/Session");
const Protocol = require("../models/Protocol");

// GET /api/user/stats
// Protected route: requires valid token
router.get("/stats", auth, async (req, res) => {
  try {
    // req.user.id comes from the auth middleware (decoded token)
    const userId = req.user.id;

    // Fetch all completed sessions for this user
    const sessions = await Session.find({
      patient: userId,
      completed: true,
    })
      .populate("protocol")
      .sort({ performedAt: 1 });

    // Calculate Aggregates
    const total_workouts = sessions.length;
    let total_reps = 0;
    let total_quality_sum = 0;
    const activityMap = {};

    sessions.forEach((session) => {
      // Calculate Reps (Protocol sets * reps)
      let sessionReps = 0;
      if (session.protocol) {
        sessionReps =
          (session.protocol.sets || 0) * (session.protocol.reps || 0);
      }
      total_reps += sessionReps;

      // Sum Quality
      if (typeof session.qualityScore === "number") {
        total_quality_sum += session.qualityScore;
      }

      // Group by Date for Graph
      const dateStr = new Date(session.performedAt).toISOString().split("T")[0];
      if (!activityMap[dateStr]) activityMap[dateStr] = 0;
      activityMap[dateStr] += sessionReps;
    });

    const accuracy =
      total_workouts > 0 ? Math.round(total_quality_sum / total_workouts) : 0;

    // Estimate: 5 seconds per rep / 60 seconds = minutes
    const total_minutes = Math.round((total_reps * 5) / 60);

    // Format Graph Data
    const graph_data = Object.keys(activityMap).map((date) => ({
      date,
      reps: activityMap[date],
    }));

    res.json({
      total_workouts,
      total_reps,
      total_minutes,
      accuracy,
      graph_data,
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({ message: "Server error fetching stats." });
  }
});

module.exports = router;
