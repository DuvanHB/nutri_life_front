import { useState, useRef } from "react";
import Swal from "sweetalert2";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // 📌 Call backend for image analysis
  const processImage = async (file) => {
    setLoading(true);
    setNutrition(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:5000/check-food", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.result === "Imagen no contiene comida") {
        Swal.fire("Info 🍽️", "Imagen no contiene comida", "info");
      } else {
        try {
          const parsed = JSON.parse(data.result);
          setNutrition(parsed);
        } catch {
          Swal.fire("Error 😢", "Invalid AI response", "error");
        }
      }
    } catch (error) {
      Swal.fire("Error 😢", "Something went wrong", "error");
    } finally {
      setLoading(false);
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
    <div className="app-container">
      <h1 className="title">🍽️ Food Analyzer AI</h1>

      {/* Upload input */}
      <div className="upload-box">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="file-input"
        />
      </div>

      {/* Loader */}
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Analyzing image...</p>
        </div>
      )}

      {/* Two-column layout */}
      {!loading && (image || nutrition) && (
        <div className="results-container">
          {/* Left: Image */}
          {image && (
            <div className="image-card">
              <h3>Preview</h3>
              <img src={image} alt="Preview" className="preview-img" />
            </div>
          )}

          {/* Right: Table */}
          {nutrition && (
            <div className="table-card">
              <h2>Nutrition Facts 🍏</h2>
              <table className="nutrition-table">
                <thead>
                  <tr>
                    <th>Nutrient</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Calories</td>
                    <td>{nutrition.Calories}</td>
                  </tr>
                  <tr>
                    <td>Protein</td>
                    <td>{nutrition.Protein}</td>
                  </tr>
                  <tr>
                    <td>Fat</td>
                    <td>{nutrition.Fat}</td>
                  </tr>
                  <tr>
                    <td>Carbohydrates</td>
                    <td>{nutrition.Carbohydrates}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Healthiness</td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color:
                          nutrition.Healthiness === "Healthy"
                            ? "green"
                            : "red",
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
      )}

      {/* Spinner Animation CSS */}
      <style>
        {`
          .app-container {
            text-align: center;
            padding: 2rem;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f9f9f9;
            min-height: 100vh;
          }

          .title {
            color: #333;
            margin-bottom: 1rem;
          }

          .upload-box {
            margin-bottom: 2rem;
          }

          .file-input {
            padding: 10px;
            border: 2px dashed #4CAF50;
            border-radius: 8px;
            cursor: pointer;
            background: white;
          }

          .loader-container {
            margin-top: 2rem;
          }

          .loader {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #4CAF50;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            margin: auto;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .results-container {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 2rem;
            flex-wrap: wrap;
          }

          .image-card, .table-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 6px 16px rgba(0,0,0,0.1);
            flex: 1;
            min-width: 300px;
          }

          .preview-img {
            max-width: 100%;
            border-radius: 10px;
            margin-top: 1rem;
          }

          .nutrition-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }

          .nutrition-table th {
            background: #4CAF50;
            color: white;
            padding: 12px;
          }

          .nutrition-table td {
            border-bottom: 1px solid #ddd;
            padding: 12px;
          }

          .nutrition-table tr:hover {
            background: #f1f1f1;
          }
        `}
      </style>
    </div>
  );
}

export default App;
