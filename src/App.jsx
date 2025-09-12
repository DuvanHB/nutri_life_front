import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);

  // Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // creates a preview link
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Upload a Picture 📸</h1>

      {/* File input */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {/* Preview image */}
      {image && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Preview:</h3>
          <img
            src={image}
            alt="Uploaded Preview"
            style={{ maxWidth: "300px", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
