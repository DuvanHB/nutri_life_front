import { useState } from "react";
import Swal from "sweetalert2";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) {
      return Swal.fire("Error", "Please enter a message", "error");
    }

    try {
      const response = await fetch("http://localhost:5000/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (data.error) {
        Swal.fire("Error", data.error, "error");
      } else {
        Swal.fire("AI Reply 🤖", data.reply, "success");
      }
    } catch (error) {
      Swal.fire("Error", "Could not connect to backend", "error");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Ask AI 💬</h1>

      <input
        type="text"
        placeholder="Type your question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ padding: "0.5rem", width: "250px", marginRight: "10px" }}
      />
      <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
        Send
      </button>
    </div>
  );
}

export default App;
