import './App.css';
import React, { useState, useEffect } from 'react';

const sendTelegramMessage = text => {
  const botToken = '6892704120:AAFGsWOgtcMFv1F3TZcO2YeRNK0nfGbKCTQ';
  const chatId = '786875435';

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const data = {
    chat_id: chatId,
    text: text,
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => console.log('Telegram API response:', data))
    .catch(error => console.error('Error sending Telegram message:', error));
};

const getDefaultSalesData = () => ({
  smartphone: { withService: 0, withoutService: 0 },
  laptop: { withService: 0, withoutService: 0 },
  tv: { withService: 0, withoutService: 0 },
  service: { smartphone: 0, laptop: 0, tv: 0 },
});

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

  const handleSellButtonClick = (type, service, buttonText) => {
    const message = buttonText;
    sendTelegramMessage(message);

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

  const generateReportMessage = () => {
    const totalSmartphones =
      salesData.smartphone.withService + salesData.smartphone.withoutService;
    const totalLaptops =
      salesData.laptop.withService + salesData.laptop.withoutService;
    const totalTvs = salesData.tv.withService + salesData.tv.withoutService;

    const totalServicesSmartphone = salesData.service.smartphone;
    const totalServicesLaptop = salesData.service.laptop;
    const totalServicesTv = salesData.service.tv;

    return `
      Проникнення сервісів:
      Смартфони: ${calculatePercentage(
        totalServicesSmartphone,
        totalSmartphones
      )}% 
      Ноутбуки: ${calculatePercentage(totalServicesLaptop, totalLaptops)}%
      Телевізори: ${calculatePercentage(totalServicesTv, totalTvs)}% 
    `;
  };

  const handleGenerateReport = () => {
    const reportMessage = generateReportMessage();
    alert(`Звіт сформовано!\n${reportMessage}`);
  };

  const handleClearData = () => {
    const confirmation = window.confirm(
      'Ви впевнені, що хочете очистити всі дані?'
    );
    if (confirmation) {
      localStorage.clear();
      setSalesData(getDefaultSalesData());
    }
  };

  return (
    <div className="app-container">
      <div className="btn-sms">
        <button>
          <a href="https://max-it-zt.github.io/comfy-zvit/">Відправити смс</a>
        </button>
      </div>
      <div className="sell-buttons">
        <div>
          <button
            type="button-tech-with-service"
            onClick={() =>
              handleSellButtonClick(
                'smartphone',
                'withService',
                'Смартфон з послугою'
              )
            }
          >
            Смартфон з послугою
          </button>
          <button
            type="button-tech-without-service"
            onClick={() =>
              handleSellButtonClick(
                'smartphone',
                'withoutService',
                'Смартфон без послуги'
              )
            }
          >
            Смартфон без послуги
          </button>
        </div>
        <div>
          <button
            type="button-tech-with-service"
            onClick={() =>
              handleSellButtonClick(
                'laptop',
                'withService',
                'Ноутбук з послугою'
              )
            }
          >
            Ноутбук з послугою
          </button>
          <button
            type="button-tech-without-service"
            onClick={() =>
              handleSellButtonClick(
                'laptop',
                'withoutService',
                'Ноутбук без послуги'
              )
            }
          >
            Ноутбук без послуги
          </button>
        </div>
        <div>
          <button
            type="button-tech-with-service"
            onClick={() =>
              handleSellButtonClick('tv', 'withService', 'Телевізор з послугою')
            }
          >
            Телевізор з послугою
          </button>
          <button
            type="button-tech-without-service"
            onClick={() =>
              handleSellButtonClick(
                'tv',
                'withoutService',
                'Телевізор без послуги'
              )
            }
          >
            Телевізор без послуги
          </button>
        </div>
        <div>
          <button
            type="button-service"
            onClick={() =>
              handleSellButtonClick(
                'service',
                'smartphone',
                'Сервіс для смартфона'
              )
            }
          >
            Сервіс для смартфона
          </button>
          <button
            type="button-service"
            onClick={() =>
              handleSellButtonClick('service', 'laptop', 'Сервіс для ноутбука')
            }
          >
            Сервіс для ноутбука
          </button>
          <button
            type="button-service"
            onClick={() =>
              handleSellButtonClick('service', 'tv', 'Сервіс для телевізора')
            }
          >
            Сервіс для телевізора
          </button>
        </div>
      </div>
      <div className="generate-report-button">
        <button onClick={handleGenerateReport}>Сформувати звіт</button>
      </div>
      <div className="clear-data-button">
        <button type="button-clear" onClick={handleClearData}>
          Очистити дані !
        </button>
      </div>
      <div className="sales-colum">
        <div className="sales-column">
          <h3>Техніка</h3>
          <p>
            Смартф:{' '}
            {salesData.smartphone.withService +
              salesData.smartphone.withoutService}
          </p>
          <p>
            Ноут:{' '}
            {salesData.laptop.withService + salesData.laptop.withoutService}
          </p>
          <p>Тв: {salesData.tv.withService + salesData.tv.withoutService}</p>
        </div>
        <div className="services-column">
          <h3>Сервіс</h3>
          <p>Смартф: {salesData.service.smartphone}</p>
          <p>Ноут: {salesData.service.laptop}</p>
          <p>Тв: {salesData.service.tv}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
