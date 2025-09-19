import { useState } from "react";

function Settings({ settings, handleSettingsChange }) {
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(false);

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

      <button onClick={handleSave} disabled={loading}>
        {loading ? "Calculando..." : "Guardar"}
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
