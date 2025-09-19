import { useState, useRef } from "react";
import Swal from "sweetalert2";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  // 📌 Send text to backend
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
        Swal.fire("Error 😢", data.error, "error");
      } else {
        Swal.fire("AI Reply 🤖", data.reply, "success");
      }
    } catch (error) {
      Swal.fire("Error 😢", "Could not connect to backend", "error");
    }
  };

  // 📌 Send image to backend
  const processImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:5000/check-food", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        Swal.fire("Error 😢", data.error, "error");
      } else {
        Swal.fire("Food Check 🍔", data.result, "info");
      }
    } catch (error) {
      Swal.fire("Error 😢", "Something went wrong", "error");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      processImage(file);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Ask AI 💬 + Food Detector 🍔</h1>

      {/* Step 1: Text input */}
      <div style={{ marginBottom: "2rem" }}>
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

      {/* Step 2: Image upload */}
      <div>
        <h3>Upload an Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
        />

        {image && (
          <div style={{ marginTop: "1rem" }}>
            <h4>Preview:</h4>
            <img
              src={image}
              alt="Uploaded Preview"
              style={{ maxWidth: "300px", borderRadius: "8px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
