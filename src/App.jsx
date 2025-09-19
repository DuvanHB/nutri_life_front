import { useState } from "react";
import Swal from "sweetalert2";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registeredFoods, setRegisteredFoods] = useState([]);

  // Upload image to backend
  const handleUpload = async (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/check-food", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (data.result === "Imagen no contiene comida") {
        Swal.fire("Ups!", "La imagen no contiene comida", "warning");
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(data.result); // Ensure JSON
      } catch {
        Swal.fire("Error", "Respuesta inválida del servidor", "error");
        return;
      }

      setResult(parsed);

      // Confirm popup
      Swal.fire({
        title: "Registrar comida",
        text: "¿Quieres registrar esta comida?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
      }).then((res) => {
        if (res.isConfirmed) {
          setRegisteredFoods((prev) => [...prev, parsed]);
          Swal.fire("Registrado ✅", "La comida fue registrada", "success");
        }
      });
    } catch (err) {
      setLoading(false);
      Swal.fire("Error", "No se pudo procesar la imagen", "error");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="container">
      <h1 className="title">Food Analyzer 🍽️</h1>

      {/* Upload button */}
      <input
        type="file"
        accept="image/*"
        capture="environment" // 📱 allows camera on mobile
        onChange={handleFileChange}
      />

      {loading && <p className="loading">Analizando imagen...</p>}

      <div className="content">
        {/* Left: Preview */}
        {preview && (
          <div className="preview">
            <h3>Imagen</h3>
            <img src={preview} alt="preview" />
          </div>
        )}

        {/* Right: Result Table */}
        {result && (
          <div className="result">
            <h3>Resultado</h3>
            <table>
              <tbody>
                <tr>
                  <td>Calorías</td>
                  <td>{result.Calories}</td>
                </tr>
                <tr>
                  <td>Proteína</td>
                  <td>{result.Protein}</td>
                </tr>
                <tr>
                  <td>Grasas</td>
                  <td>{result.Fat}</td>
                </tr>
                <tr>
                  <td>Carbohidratos</td>
                  <td>{result.Carbohydrates}</td>
                </tr>
                <tr>
                  <td>Saludable</td>
                  <td>{result.Healthiness}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Registered foods table */}
      {registeredFoods.length > 0 && (
        <div className="registered">
          <h2>Comidas Registradas 📋</h2>
          <table>
            <thead>
              <tr>
                <th>Calorías</th>
                <th>Proteína</th>
                <th>Grasas</th>
                <th>Carbohidratos</th>
                <th>Saludable</th>
              </tr>
            </thead>
            <tbody>
              {registeredFoods.map((food, i) => (
                <tr key={i}>
                  <td>{food.Calories}</td>
                  <td>{food.Protein}</td>
                  <td>{food.Fat}</td>
                  <td>{food.Carbohydrates}</td>
                  <td>{food.Healthiness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
