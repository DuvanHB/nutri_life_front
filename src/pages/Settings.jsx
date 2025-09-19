import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function Settings({ settings, handleSettingsChange, setSettings }) {
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedPlan, setSavedPlan] = useState(null); // store last saved plan
  const [calculated, setCalculated] = useState(false);
  const [saved, setSaved] = useState(false);

  // 📌 Load saved nutrition from backend on mount
  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const res = await fetch("http://localhost:5000/get-nutrition");
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const latest = data[data.length - 1]; // get last saved record

          setSettings({
            gender: latest.gender,
            age: latest.age,
            height: latest.height,
            weight: latest.weight,
            trainsPerWeek: latest.trainsPerWeek,
            activity: latest.activity,
            goal: latest.goal,
          });

          setNutritionPlan({
            calories: latest.calories,
            protein: latest.protein,
            fat: latest.fat,
            carbs: latest.carbs,
          });

          setSavedPlan(latest); // store original saved
          setSaved(true); // nothing to do after fetching
        }
      } catch (err) {
        Swal.fire("❌ Error fetching nutrition:" + err, "error");
      }
    };

    fetchNutrition();
  }, [setSettings]);

  // Detect changes between form and saved values
  const hasChanges =
    savedPlan &&
    (
      savedPlan.gender !== settings.gender ||
      savedPlan.age !== Number(settings.age) ||
      savedPlan.height !== Number(settings.height) ||
      savedPlan.weight !== Number(settings.weight) ||
      savedPlan.trainsPerWeek !== Number(settings.trainsPerWeek) ||
      savedPlan.activity !== settings.activity ||
      savedPlan.goal !== settings.goal
    );

  // Call backend to calculate nutrition
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/calculate-nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      setNutritionPlan(data);
      setCalculated(true);
      setSaved(false); // not saved yet
    } catch (err) {
        Swal.fire("❌ Error al calcular nutrición:" + err, "error");
    }
    setLoading(false);
  };

  // Save the calculated plan into MongoDB
  const handleSaveToDB = async () => {
    if (!nutritionPlan) {
        Swal.fire("First calculate the plan, then click Save.", "error");
      return;
    }

    const payload = {
      gender: settings.gender,
      age: Number(settings.age),
      height: Number(settings.height),
      weight: Number(settings.weight),
      trainsPerWeek: Number(settings.trainsPerWeek || 0),
      activity: settings.activity,
      goal: settings.goal,
      calories: nutritionPlan.calories,
      protein: nutritionPlan.protein,
      fat: nutritionPlan.fat,
      carbs: nutritionPlan.carbs,
      note: "",
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/save-nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        Swal.fire("Error saving plan: " + (data.error || "unknown"), "error");
        return;
      }
      Swal.fire("Plan saved ✅", "success");

      setSavedPlan(payload); // update reference
      setSaved(true);
      setCalculated(false);
    } catch (err) {
      Swal.fire("Save failed", "error");
    }
  };

  return (
    <div className="settings">
      <h2>Configuración ⚙️</h2>
      <form>
        <label>
          Sexo:
          <select
            name="gender"
            value={settings.gender}
            onChange={handleSettingsChange}
          >
            <option value="Male">Hombre</option>
            <option value="Female">Mujer</option>
          </select>
        </label>
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

      {/* Show only one button at a time */}
      {!calculated && hasChanges && (
        <button className="calculate" onClick={handleSave} disabled={loading}>
          {loading ? "Calculando..." : "Calcular"}
        </button>
      )}

      {calculated && !saved && (
        <button className="save-db" onClick={handleSaveToDB}>
          Guardar
        </button>
      )}

      {nutritionPlan && (
        <div className="nutrition-result">
          <h3>Tu plan nutricional 🎯</h3>
          <ul>
            <li>Calorías: {nutritionPlan.calories}</li>
            <li>Proteína: {nutritionPlan.protein} g</li>
            <li>Grasas: {nutritionPlan.fat} g</li>
            <li>Carbohidratos: {nutritionPlan.carbs} g</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Settings;
