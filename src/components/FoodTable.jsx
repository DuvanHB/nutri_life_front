function FoodTable({ foods }) {
  if (!foods.length) return <p>No hay comidas registradas aún.</p>;

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
        {foods.map((food, i) => (
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
  );
}

export default FoodTable;
