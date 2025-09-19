import FoodTable from "../components/FoodTable";

function DailyLog({ registeredFoods }) {
  return (
    <div className="registered">
      <h2>Comidas Registradas 📋</h2>
      <FoodTable foods={registeredFoods} />
    </div>
  );
}

export default DailyLog;
