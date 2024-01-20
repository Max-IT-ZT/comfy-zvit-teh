// src/components/PlanViewer.jsx
import React from 'react';

const PlanViewer = ({ itPlans, hsPlans }) => {
  return (
    <div>
      <h2>Виведення планів</h2>
      <div>
        <h3>Плани для ІТ:</h3>
        <p>Дні: {itPlans.days}</p>
        <p>Плани: {itPlans.plans.join(', ')}</p>
      </div>
      <div>
        <h3>Плани для ХС:</h3>
        <p>Дні: {hsPlans.days}</p>
        <p>Плани: {hsPlans.plans.join(', ')}</p>
      </div>
    </div>
  );
};

export default PlanViewer;
