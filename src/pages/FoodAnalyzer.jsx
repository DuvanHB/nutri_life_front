function FoodAnalyzer({
  preview,
  result,
  loading,
  handleFileChange,
  canRegister,
  handleRegisterFood,
}) {
  return (
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

            {canRegister && (
              <button onClick={handleRegisterFood}>Registrar ✅</button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default FoodAnalyzer;
