import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import logo from './logo.png';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const apiKey = 'f02e5b53cc3645598af60008232108';
  const currentWeatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
  const forecastApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no`;

  const fetchWeatherData = async () => {
    try {
      setError(null); // Clear previous errors
      if (!city) {
        setError('Enter a city name to Fetch Weather.');
        setWeather(null);
        setForecast([]);
        return;
      }

      const response = await fetch(currentWeatherApiUrl);
      const data = await response.json();

      if (data.error) {
        setError('City not found. Please enter a valid city name.');
        setWeather(null);
        setForecast([]);
      } else if (data.current) {
        setWeather({
          temperature: data.current.temp_c,
          condition: data.current.condition.text,
          icon: data.current.condition.icon,
        });
      } else {
        setError('Unable to fetch weather data.');
        setWeather(null);
        setForecast([]);
      }
    } catch (error) {
      setError('Error fetching weather data.');
      setWeather(null);
      setForecast([]);
    }
  };

  const fetchForecastData = async () => {
    try {
      const response = await fetch(forecastApiUrl);
      const data = await response.json();

      if (data.forecast) {
        setForecast(data.forecast.forecastday);
      } else {
        console.log('Unable to fetch forecast data.');
      }
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    fetchForecastData();
  }, []);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearchClick = () => {
    fetchWeatherData();
    fetchForecastData();
  };

  return (
    <div className="App">
      <img src={logo} alt="Logo" className="logo" />
      <div id="input-container">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleCityChange}
        />
        <button className="search-button" onClick={handleSearchClick}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      <div id="weather-container">
        {error ? (
          <p className="error-message">{error}</p>
        ) : weather ? (
          <>
            <p>Temperature: {weather.temperature}°C</p>
            <p>Condition: {weather.condition}</p>
            <img src={weather.icon} alt="Weather Icon" />
          </>
        ) : (
          <p>Enter a city name and click "Fetch Weather" to see weather data.</p>
        )}
      </div>
      <div className="forecast-container">
        {forecast.length > 0 && (
          <>
            <h2>3-Day Forecast</h2>
            <div className="forecast-list">
              {forecast.map((day) => (
                <div className="forecast-item" key={day.date}>
                  <p>{day.date}</p>
                  <p>High: {day.day.maxtemp_c}°C</p>
                  <p>Low: {day.day.mintemp_c}°C</p>
                  <img src={day.day.condition.icon} alt="Forecast Icon" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="footer">By Nishant Parmar, 20BIT026</div>
    </div>
  );
}

export default App;
