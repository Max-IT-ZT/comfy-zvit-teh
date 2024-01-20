import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [salesData, setSalesData] = useState(() => {
    const storedData = localStorage.getItem('salesData');
    return storedData ? JSON.parse(storedData) : getDefaultSalesData();
  });

  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);

    const timeUntilMidnight = midnight - now;

    const updateDataAtMidnight = () => {
      setSalesData(getDefaultSalesData());
    };

    const timeoutId = setTimeout(updateDataAtMidnight, timeUntilMidnight);

    localStorage.setItem('midnightUpdateTimeoutId', timeoutId.toString());

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    localStorage.setItem('salesData', JSON.stringify(salesData));
  }, [salesData]);

  const getDefaultSalesData = () => ({
    smartphone: { withService: 0, withoutService: 0 },
    laptop: { withService: 0, withoutService: 0 },
    tv: { withService: 0, withoutService: 0 },
    service: { smartphone: 0, laptop: 0, tv: 0 },
  });

  const handleSellButtonClick = (type, service) => {
    setSalesData(prevData => {
      const updatedData = { ...prevData };
      updatedData[type][service]++;
      if (service === 'withService') {
        updatedData.service[type]++;
      }
      return updatedData;
    });
  };

  const calculatePercentage = (withService, total) => {
    return total !== 0 ? ((withService / total) * 100).toFixed(2) : 0;
  };

  const handleGenerateReport = () => {
    const totalSmartphones =
      salesData.smartphone.withService + salesData.smartphone.withoutService;
    const totalLaptops =
      salesData.laptop.withService + salesData.laptop.withoutService;
    const totalTvs = salesData.tv.withService + salesData.tv.withoutService;

    const reportMessage = `
      Смартфони: ${
        salesData.smartphone.withService + salesData.smartphone.withoutService
      } продано, 
      ${salesData.service.smartphone} з сервісом (${calculatePercentage(
      salesData.service.smartphone,
      totalSmartphones
    )}%)
      Ноутбуки: ${
        salesData.laptop.withService + salesData.laptop.withoutService
      } продано, 
      ${salesData.service.laptop} з сервісом (${calculatePercentage(
      salesData.service.laptop,
      totalLaptops
    )}%)
      Телевізори: ${
        salesData.tv.withService + salesData.tv.withoutService
      } продано, 
      ${salesData.service.tv} з сервісом (${calculatePercentage(
      salesData.service.tv,
      totalTvs
    )}%)
    `;
    alert(`Звіт сформовано!\n${reportMessage}`);
  };

  return (
    <div className="app-container">
      <div className="sell-buttons">
        <div>
          <button
            type="button-tech-with-service"
            onClick={() => handleSellButtonClick('smartphone', 'withService')}
          >
            Смартфон з послугою
          </button>
          <button
            type="button-tech-without-service"
            onClick={() =>
              handleSellButtonClick('smartphone', 'withoutService')
            }
          >
            Смартфон без послуги
          </button>
        </div>
        <div>
          <button
            type="button-tech-with-service"
            onClick={() => handleSellButtonClick('laptop', 'withService')}
          >
            Ноутбук з послугою
          </button>
          <button
            type="button-tech-without-service"
            onClick={() => handleSellButtonClick('laptop', 'withoutService')}
          >
            Ноутбук без послуги
          </button>
        </div>
        <div>
          <button
            type="button-tech-with-service"
            onClick={() => handleSellButtonClick('tv', 'withService')}
          >
            Телевізор з послугою
          </button>
          <button
            type="button-tech-without-service"
            onClick={() => handleSellButtonClick('tv', 'withoutService')}
          >
            Телевізор без послуги
          </button>
        </div>
        <div>
          <button
            type="button-service"
            onClick={() => handleSellButtonClick('service', 'smartphone')}
          >
            Сервіс для смартфона
          </button>
          <button
            type="button-service"
            onClick={() => handleSellButtonClick('service', 'laptop')}
          >
            Сервіс для ноутбука
          </button>
          <button
            type="button-service"
            onClick={() => handleSellButtonClick('service', 'tv')}
          >
            Сервіс для телевізора
          </button>
        </div>
      </div>
      <div className="generate-report-button">
        <button onClick={handleGenerateReport}>Сформувати звіт</button>
      </div>
      <div className="sales-summary">
        <h2>Кількість продажів:</h2>
        <p>
          Смартфони:{' '}
          {salesData.smartphone.withService +
            salesData.smartphone.withoutService}
        </p>
        <p>
          Ноутбуки:{' '}
          {salesData.laptop.withService + salesData.laptop.withoutService}
        </p>
        <p>
          Телевізори: {salesData.tv.withService + salesData.tv.withoutService}
        </p>
        <p>
          Сервіси:{' '}
          {salesData.service.smartphone +
            salesData.service.laptop +
            salesData.service.tv}
        </p>
      </div>
    </div>
  );
};

export default App;
