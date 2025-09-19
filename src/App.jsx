import { useState, useRef } from "react";
import Swal from "sweetalert2";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [nutrition, setNutrition] = useState(null); // store AI results
  const fileInputRef = useRef(null);

  // 📌 Call backend for image analysis
  const processImage = async (file) => {
    console.log("Sending to backend:", file.name);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:5000/check-food", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.result === "Imagen no contiene comida") {
        setNutrition(null);
        Swal.fire("Info 🍽️", "Imagen no contiene comida", "info");
      } else {
        try {
          const parsed = JSON.parse(data.result); // parse JSON from backend
          setNutrition(parsed);
        } catch {
          Swal.fire("Error 😢", "Invalid AI response", "error");
        }
      }
    } catch (error) {
      Swal.fire("Error 😢", "Something went wrong", "error");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 📌 Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      processImage(file);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Upload a Picture 📸</h1>

      {/* File input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
      />

      {/* Preview */}
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

      {/* Nutrition Table */}
      {nutrition && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Nutrition Facts 🍏</h2>
          <table
            style={{
              margin: "0 auto",
              borderCollapse: "collapse",
              width: "60%",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Nutrient</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  Calories
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {nutrition.Calories}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  Protein
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {nutrition.Protein}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  Fat
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {nutrition.Fat}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  Carbohydrates
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {nutrition.Carbohydrates}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "12px",
                    fontWeight: "bold",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Healthiness
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "bold",
                    color:
                      nutrition.Healthiness === "Healthy" ? "green" : "red",
                  }}
                >
                  {nutrition.Healthiness}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
