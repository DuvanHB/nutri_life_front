import { useState } from "react";
import Swal from "sweetalert2";
import "./App.css";

import DailyLog from "./pages/DailyLog";
import FoodAnalyzer from "./pages/FoodAnalyzer";
import Settings from "./pages/Settings";

function App() {
  const [activeTab, setActiveTab] = useState("dailyLog");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registeredFoods, setRegisteredFoods] = useState([]);
  const [canRegister, setCanRegister] = useState(false);

  const [settings, setSettings] = useState({
    gender: "Male",
    age: "",
    height: "",
    weight: "",
    trainsPerWeek: "",
    activity: "Normal",
    goal: "Maintain",
  });

  // Upload image
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
        parsed = JSON.parse(data.result);
      } catch {
        Swal.fire("Error", "Respuesta inválida del servidor", "error");
        return;
      }

      setResult(parsed);
      setCanRegister(true);
    } catch (err) {
      setLoading(false);
      Swal.fire("Error", "No se pudo procesar la imagen", "error");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  const handleRegisterFood = () => {
    if (result) {
      setRegisteredFoods((prev) => [...prev, result]);
      setCanRegister(false);
      Swal.fire("Registrado ✅", "La comida fue registrada", "success");
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <h1 className="title">Food Analyzer 🍽️</h1>

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

      {activeTab === "dailyLog" && (
        <DailyLog registeredFoods={registeredFoods} />
      )}

      {activeTab === "analyzer" && (
        <FoodAnalyzer
          preview={preview}
          result={result}
          loading={loading}
          handleFileChange={handleFileChange}
          canRegister={canRegister}
          handleRegisterFood={handleRegisterFood}
        />
      )}

      {activeTab === "settings" && (
        <Settings settings={settings} setSettings={setSettings} handleSettingsChange={handleSettingsChange} />
      )}
    </div>
  );
}

export default App;
