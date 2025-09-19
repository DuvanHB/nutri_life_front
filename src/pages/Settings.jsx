import { useState, useEffect } from "react";

function Settings({ settings, handleSettingsChange, setSettings  }) {
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  // 📌 Load saved nutrition from backend on mount
  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const res = await fetch("http://localhost:5000/get-nutrition");
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const latest = data[data.length - 1]; // get last saved record

          // Fill form values
          setSettings({
            gender: latest.gender,
            age: latest.age,
            height: latest.height,
            weight: latest.weight,
            trainsPerWeek: latest.trainsPerWeek,
            activity: latest.activity,
            goal: latest.goal,
          });

          // Fill calculated nutrition
          setNutritionPlan({
            calories: latest.calories,
            protein: latest.protein,
            fat: latest.fat,
            carbs: latest.carbs,
          });
        }
      } catch (err) {
        console.error("❌ Error fetching nutrition:", err);
      }
    };

    fetchNutrition();
  }, [setSettings]);

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
    } catch (err) {
      console.error("Error al calcular nutrición:", err);
    }
    setLoading(false);
  };

  // Save the calculated plan into MongoDB
  const handleSaveToDB = async () => {
    if (!nutritionPlan) {
      alert("First calculate the plan, then click Save.");
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
      // results from calculate-nutrition
      calories: nutritionPlan.calories,
      protein: nutritionPlan.protein,
      fat: nutritionPlan.fat,
      carbs: nutritionPlan.carbs,
      // optional
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
        console.error("Save error:", data);
        alert("Error saving plan: " + (data.error || "unknown"));
        return;
      }

      console.log("Saved:", data.data);
      alert("Plan saved ✅");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed");
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

      {/* First calculate */}
      <button className="calculate" onClick={handleSave} disabled={loading}>
        {loading ? "Calculando..." : "Calcular"}
      </button>

      {/* Then save to DB */}
      <button className="save-db"  onClick={handleSaveToDB} disabled={!nutritionPlan}>
        Guardar
      </button>

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
