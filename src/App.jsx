import { useState } from "react";
import Swal from "sweetalert2";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dailyLog"); // 👈 default tab
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registeredFoods, setRegisteredFoods] = useState([]);
  const [canRegister, setCanRegister] = useState(false); // 👈 controls Register button

  // ✅ Settings state
  const [settings, setSettings] = useState({
    age: "",
    height: "",
    weight: "",
    trainsPerWeek: "",
    activity: "Normal",
    goal: "Maintain",
  });

  // Upload image to backend
  const handleUpload = async (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setCanRegister(false);

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
      setCanRegister(true); // show register button
    } catch (err) {
      setLoading(false);
      Swal.fire("Error", "No se pudo procesar la imagen", "error");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterFood = () => {
    if (result) {
      setRegisteredFoods((prev) => [...prev, result]);
      setCanRegister(false); // hide button after registering
      Swal.fire("Registrado ✅", "La comida fue registrada", "success");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Food Analyzer 🍽️</h1>

      {/* Tabs Navigation */}
      <div className="tabs">
        <button
          className={activeTab === "dailyLog" ? "active" : ""}
          onClick={() => setActiveTab("dailyLog")}
        >
          Daily Log 📋
        </button>
        <button
          className={activeTab === "analyzer" ? "active" : ""}
          onClick={() => setActiveTab("analyzer")}
        >
          Food Analyzer 🍔
        </button>
        <button
          className={activeTab === "settings" ? "active" : ""}
          onClick={() => setActiveTab("settings")}
        >
          Settings ⚙️
        </button>
      </div>

      {/* Daily Log Tab */}
      {activeTab === "dailyLog" && (
        <div className="registered">
          <h2>Comidas Registradas 📋</h2>
          {registeredFoods.length > 0 ? (
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
          ) : (
            <p>No hay comidas registradas aún.</p>
          )}
        </div>
      )}

      {/* Food Analyzer Tab */}
      {activeTab === "analyzer" && (
        <>
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
          />
          <label htmlFor="fileUpload">📷 Subir o tomar foto</label>

          {loading && <p className="loading">Analizando imagen...</p>}

          <div className="content">
            {preview && (
              <div className="preview">
                <h3>Imagen</h3>
                <img src={preview} alt="preview" />
              </div>
            )}

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

                {/* Register Button */}
                {canRegister && (
                  <button onClick={handleRegisterFood}>Registrar ✅</button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="settings">
          <h2>Configuración ⚙️</h2>
          <form>
            <label>
              Edad:
              <input
                type="number"
                name="age"
                value={settings.age}
                onChange={handleSettingsChange}
              />
            </label>
            <label>
              Altura (cm):
              <input
                type="number"
                name="height"
                value={settings.height}
                onChange={handleSettingsChange}
              />
            </label>
            <label>
              Peso (kg):
              <input
                type="number"
                name="weight"
                value={settings.weight}
                onChange={handleSettingsChange}
              />
            </label>
            <label>
              Entrenamientos por semana:
              <input
                type="number"
                name="trainsPerWeek"
                value={settings.trainsPerWeek}
                onChange={handleSettingsChange}
              />
            </label>
            <label>
              Actividad diaria:
              <select
                name="activity"
                value={settings.activity}
                onChange={handleSettingsChange}
              >
                <option value="Muy activo">Muy activo</option>
                <option value="Activo">Activo</option>
                <option value="Normal">Normal</option>
                <option value="Poco activo">Poco activo</option>
              </select>
            </label>
            <label>
              Objetivo:
              <select
                name="goal"
                value={settings.goal}
                onChange={handleSettingsChange}
              >
                <option value="Gain">Ganar peso</option>
                <option value="Lose">Perder peso</option>
                <option value="Maintain">Mantener</option>
              </select>
            </label>
          </form>
          <pre>{JSON.stringify(settings, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
