function Settings({ settings, handleSettingsChange }) {
  return (
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
  );
}

export default Settings;
