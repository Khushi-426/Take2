import React, { useRef, useEffect, useMemo } from "react";

// Enhanced color palette with gradients
const GHOST_COLORS = {
  RED: {
    primary: "rgba(255, 82, 82, 0.9)",
    secondary: "rgba(255, 120, 120, 0.6)",
    glow: "rgba(255, 82, 82, 0.7)",
  },
  GREEN: {
    primary: "rgba(52, 211, 153, 0.9)",
    secondary: "rgba(110, 231, 183, 0.6)",
    glow: "rgba(52, 211, 153, 0.7)",
  },
  YELLOW: {
    primary: "rgba(251, 191, 36, 0.9)",
    secondary: "rgba(252, 211, 77, 0.6)",
    glow: "rgba(251, 191, 36, 0.7)",
  },
  GRAY: {
    primary: "rgba(156, 163, 175, 0.8)",
    secondary: "rgba(209, 213, 219, 0.5)",
    glow: "rgba(156, 163, 175, 0.6)",
  },
};

const GhostModelOverlay = ({ ghostPoseData }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const pulsePhaseRef = useRef(0);

  // Memoize color scheme for drawing
  const colorScheme = useMemo(
    () =>
      GHOST_COLORS[ghostPoseData?.color?.toUpperCase()] || GUEST_COLORS.GRAY,
    [ghostPoseData?.color]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;

    // Use requestAnimationFrame for optimal timing and smoothness.
    // We remove manual throttling to achieve max FPS (usually 60+)

    let containerWidth = container.clientWidth;
    let containerHeight = container.clientHeight;

    // Set dimensions based on current container size
    const setCanvasDimensions = () => {
      containerWidth = container.clientWidth;
      containerHeight = container.clientHeight;
      canvas.width = containerWidth;
      canvas.height = containerHeight;
    };

    setCanvasDimensions();

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true, // Low-latency rendering
    });

    // IMPROVEMENT: Draw all skeleton segments with a gradient for a volumetric look
    const drawSkeletonWithGradient = (connections, primaryColor, glowColor) => {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 10;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 0; // Handled by outer glow layer

      connections.forEach(([startIdx, endIdx]) => {
        const start = ghostPoseData.landmarks[String(startIdx)];
        const end = ghostPoseData.landmarks[String(endIdx)];

        if (start && end) {
          // Calculate screen coordinates
          const startX = start[0] * containerWidth;
          const startY = start[1] * containerHeight;
          const endX = end[0] * containerWidth;
          const endY = end[1] * containerHeight;

          // Create a subtle gradient for volumetric effect
          const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
          gradient.addColorStop(0, primaryColor);
          gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.3)"); // Subtle highlight in the middle
          gradient.addColorStop(1, primaryColor);

          ctx.strokeStyle = gradient;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      });
      ctx.restore();
    };

    const drawJoints = (landmarks, pulseIntensity) => {
      ctx.save();
      const jointRadius = 13;
      const landmarkEntries = Object.entries(landmarks);

      // 1. Draw Outer Glow (Single Pass)
      ctx.fillStyle = colorScheme.glow;
      ctx.globalAlpha = 0.35 * pulseIntensity;
      landmarkEntries.forEach(([idx, coords]) => {
        ctx.beginPath();
        ctx.arc(
          coords[0] * containerWidth,
          coords[1] * containerHeight,
          jointRadius * 1.8,
          0,
          2 * Math.PI
        );
        ctx.fill();
      });

      // 2. Draw Main Joints and Highlights (Single Pass)
      ctx.globalAlpha = 1;
      landmarkEntries.forEach(([idx, coords]) => {
        const x = coords[0] * containerWidth;
        const y = coords[1] * containerHeight;

        // Main joint body
        ctx.fillStyle = colorScheme.primary;
        ctx.beginPath();
        ctx.arc(x, y, jointRadius, 0, 2 * Math.PI);
        ctx.fill();

        // Highlight/Reflection (White)
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(
          x - jointRadius * 0.3,
          y - jointRadius * 0.3,
          jointRadius * 0.3,
          0,
          2 * Math.PI
        );
        ctx.fill();
      });
      ctx.restore();
    };

    const drawGhost = () => {
      ctx.clearRect(0, 0, containerWidth, containerHeight);

      const { landmarks, connections } = ghostPoseData;

      if (
        !landmarks ||
        Object.keys(landmarks).length < 2 ||
        !connections ||
        connections.length === 0
      ) {
        return;
      }

      pulsePhaseRef.current += 0.08;
      const pulseIntensity = Math.sin(pulsePhaseRef.current) * 0.2 + 0.8;
      const glowBlur = 15 * pulseIntensity;

      // 1. Draw Skeleton Glow Layer
      ctx.save();
      ctx.strokeStyle = colorScheme.glow;
      ctx.lineWidth = 14;
      ctx.globalAlpha = 0.3 * pulseIntensity;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      connections.forEach(([startIdx, endIdx]) => {
        const start = landmarks[String(startIdx)];
        const end = landmarks[String(endIdx)];

        if (start && end) {
          ctx.moveTo(start[0] * containerWidth, start[1] * containerHeight);
          ctx.lineTo(end[0] * containerWidth, end[1] * containerHeight);
        }
      });
      ctx.stroke();
      ctx.restore();

      // 2. Draw Main Skeleton with Gradient (Volumetric look)
      drawSkeletonWithGradient(
        connections,
        colorScheme.primary,
        colorScheme.glow
      );

      // 3. Draw Joints and Highlights
      drawJoints(landmarks, pulseIntensity);
    };

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      drawGhost();
    };

    animate(); // Start animation loop

    // Handle resize efficiently
    const handleResize = () => {
      setCanvasDimensions();
      drawGhost(); // Redraw immediately after resize
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [ghostPoseData, colorScheme]); // Dependency array is clean

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 15,
          pointerEvents: "none",
        }}
      />

      {/* Compact legend */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background:
            "linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))",
          padding: "16px 20px",
          borderRadius: "14px",
          zIndex: 20,
          color: "white",
          fontSize: "0.85rem",
          fontWeight: "600",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            marginBottom: "10px",
            fontSize: "0.65rem",
            opacity: 0.6,
            letterSpacing: "1.2px",
            fontWeight: "800",
          }}
        >
          FORM GUIDE
        </div>

        {[
          { color: "GREEN", label: "Perfect", icon: "✓" },
          { color: "YELLOW", label: "Moving", icon: "→" },
          { color: "RED", label: "Adjust", icon: "!" },
        ].map(({ color, label, icon }) => (
          <div
            key={color}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: color !== "RED" ? "8px" : "0",
            }}
          >
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: GHOST_COLORS[color].primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "900",
                fontSize: "0.8rem",
                color: "white",
                boxShadow: `0 2px 8px ${GHOST_COLORS[color].glow}`,
              }}
            >
              {icon}
            </div>
            <span style={{ flex: 1, fontSize: "0.85rem" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Instruction banner */}
      {ghostPoseData?.instruction && (
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            background: colorScheme.primary,
            padding: "14px 32px",
            borderRadius: "40px",
            fontSize: "1.05rem",
            fontWeight: "800",
            color: "white",
            whiteSpace: "nowrap",
            boxShadow: `0 6px 24px ${colorScheme.glow}, 0 0 0 1px rgba(255, 255, 255, 0.2) inset`,
            backdropFilter: "blur(8px)",
            zIndex: 25,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            animation: "floatSmooth 2.5s ease-in-out infinite",
          }}
        >
          {ghostPoseData.instruction}
        </div>
      )}

      <style>{`
        @keyframes floatSmooth {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
      `}</style>
    </>
  );
};

export default GhostModelOverlay;
