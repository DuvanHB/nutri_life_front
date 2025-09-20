import { useEffect, useState } from "react";
import FoodTable from "../components/FoodTable";

function DailyLog({ registeredFoods }) {
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [foods, setFoods] = useState(registeredFoods || []);

  // Sync foods if parent prop changes
  useEffect(() => {
    setFoods(registeredFoods || []);
  }, [registeredFoods]);

  // Fetch latest nutrition plan
  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const res = await fetch("http://localhost:5000/get-nutrition");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const latest = data[data.length - 1];
          setNutritionPlan({
            calories: latest.calories,
            protein: latest.protein,
            fat: latest.fat,
            carbs: latest.carbs,
          });
        }
      } catch (err) {
        console.error("❌ Error fetching nutrition plan:", err);
      }
    };

    fetchNutrition();
  }, []);

  return (
    <div className="registered">
      <h2>Comidas Registradas 📋</h2>
      <FoodTable foods={foods} nutritionPlan={nutritionPlan} />
    </div>
  );
}

export default DailyLog;
