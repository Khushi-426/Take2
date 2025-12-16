export const fetchAICommentary = async (context, userQuery, history = []) => {
  try {
    // 1. Determine the correct backend URL dynamically
    // If the app is running on the same machine, use the current hostname
    const hostname = window.location.hostname;

    // FIX: Changed port from 5000 to 5001 to correctly target the Flask (Python) backend
    // which handles the AI Coach logic.
    const backendUrl = `http://${hostname}:5001/api/ai_coach`;

    console.log(`📡 Connecting to: ${backendUrl}`);

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        context: context,
        query: userQuery,
        history: history,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server Error:", errorText);
      return `Server Error (${res.status}): Please check backend logs.`;
    }

    const data = await res.json();
    return data.response || "I heard you, but I have no answer.";
  } catch (error) {
    console.error("Network Error:", error);
    return `Connection Failed: Is the backend running on port 5001?`;
  }
};
