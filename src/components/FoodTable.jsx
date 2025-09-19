function FoodTable({ foods = [], nutritionPlan }) {
  // Calculate totals eaten today
  const totals = foods.reduce(
    (acc, food) => {
      acc.calories += Number(food.Calories) || 0;
      acc.protein += Number(food.Protein) || 0;
      acc.fat += Number(food.Fat) || 0;
      acc.carbs += Number(food.Carbohydrates) || 0;
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  return (
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
        {/* Show foods if exist, otherwise one row with message */}
        {foods.length > 0 ? (
          foods.map((food, i) => (
            <tr key={i}>
              <td>{food.Calories}</td>
              <td>{food.Protein}</td>
              <td>{food.Fat}</td>
              <td>{food.Carbohydrates}</td>
              <td>{food.Healthiness}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" style={{ textAlign: "center" }}>
              No hay comidas registradas aún
            </td>
          </tr>
        )}

        {/* Totals consumed */}
        <tr style={{ fontWeight: "bold" }}>
          <td>{totals.calories}</td>
          <td>{totals.protein}</td>
          <td>{totals.fat}</td>
          <td>{totals.carbs}</td>
          <td>Total consumido</td>
        </tr>

        {/* Daily goals (always show if nutritionPlan exists) */}
        {nutritionPlan && (
          <>
            <tr style={{ fontWeight: "bold", color: "green" }}>
              <td>{nutritionPlan.calories}</td>
              <td>{nutritionPlan.protein}</td>
              <td>{nutritionPlan.fat}</td>
              <td>{nutritionPlan.carbs}</td>
              <td>Meta diaria</td>
            </tr>
            <tr style={{ fontWeight: "bold", color: "blue" }}>
              <td>{Math.max(nutritionPlan.calories - totals.calories, 0)}</td>
              <td>{Math.max(nutritionPlan.protein - totals.protein, 0)}</td>
              <td>{Math.max(nutritionPlan.fat - totals.fat, 0)}</td>
              <td>{Math.max(nutritionPlan.carbs - totals.carbs, 0)}</td>
              <td>Restante</td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
}

export default FoodTable;
