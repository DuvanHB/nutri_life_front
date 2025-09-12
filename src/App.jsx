import { useState } from "react";
import Swal from "sweetalert2";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);

  // Call backend after upload
  const processImage = async (file) => {
    console.log("Sending to backend:", file.name);

    try {
      const response = await fetch("http://localhost:5000/process-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name }),
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      // Show SweetAlert2 popup
      Swal.fire({
        title: "Success 🎉",
        text: data.message,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error 😢",
        text: "Something went wrong",
        icon: "error",
      });
    }
  };

  // Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // show preview
      processImage(file); // call backend
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
