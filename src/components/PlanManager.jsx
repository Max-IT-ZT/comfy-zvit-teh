// src/components/PlanManager.jsx
import React, { useState } from 'react';

const PlanManager = ({ onSave }) => {
  const [itPlans, setItPlans] = useState(Array(31).fill(0));
  const [hsPlans, setHsPlans] = useState(Array(31).fill(0));

  const handleSave = () => {
    onSave({
      it: { days: 31, plans: itPlans },
      hs: { days: 31, plans: hsPlans },
    });
  };

  const handleItPlanChange = (day, value) => {
    const newItPlans = [...itPlans];
    newItPlans[day - 1] = value;
    setItPlans(newItPlans);
  };

  const handleHsPlanChange = (day, value) => {
    const newHsPlans = [...hsPlans];
    newHsPlans[day - 1] = value;
    setHsPlans(newHsPlans);
  };

  return (
    <div>
      <h2>Плани на місяць</h2>
      <div>
        <h3>ІТ</h3>
        {itPlans.map((plan, index) => (
          <div key={index}>
            <span>{`День ${index + 1}: `}</span>
            <input
              type="number"
              value={plan}
              onChange={e =>
                handleItPlanChange(index + 1, parseInt(e.target.value, 10))
              }
            />
          </div>
        ))}
      </div>
      <div>
        <h3>ХС</h3>
        {hsPlans.map((plan, index) => (
          <div key={index}>
            <span>{`День ${index + 1}: `}</span>
            <input
              type="number"
              value={plan}
              onChange={e =>
                handleHsPlanChange(index + 1, parseInt(e.target.value, 10))
              }
            />
          </div>
        ))}
      </div>
      <button onClick={handleSave}>Зберегти плани</button>
    </div>
  );
};

export default PlanManager;
