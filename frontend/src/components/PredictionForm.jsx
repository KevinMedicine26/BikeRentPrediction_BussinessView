import React, { useState } from 'react';
import { getPrediction } from '../services/api';
import { weatherOptions } from '../services/mockData';

const PredictionForm = ({ onPredictionResult }) => {
  const [formData, setFormData] = useState({
    season: 2, // Default to summer
    month: new Date().getMonth() + 1, // Current month (1-12)
    hour: new Date().getHours(), // Current hour (0-23)
    holiday: 0, // Not a holiday
    weekday: new Date().getDay(), // Current day of week (0-6, 0 is Sunday)
    workingday: new Date().getDay() === 0 || new Date().getDay() === 6 ? 0 : 1, // Not a working day if weekend
    weather: 1, // Clear
    temp: 25, // Celsius
    humidity: 60, // Percentage
    windspeed: 10 // km/h
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    
    // Convert numeric inputs to numbers
    if (['season', 'month', 'hour', 'holiday', 'weekday', 'workingday', 'weather', 'temp', 'humidity', 'windspeed'].includes(name)) {
      parsedValue = parseFloat(value);
    }
    
    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await getPrediction(formData);
      onPredictionResult(result);
    } catch (error) {
      console.error('Error making prediction:', error);
      setError('An error occurred while making the prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-form">
      <h2 className="text-xl font-bold mb-4">Make a Bike Rental Prediction</h2>
      
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Season */}
          <div className="form-group">
            <label className="form-label" htmlFor="season">Season</label>
            <select 
              id="season"
              name="season"
              className="form-control"
              value={formData.season}
              onChange={handleInputChange}
            >
              {weatherOptions.season.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div className="form-group">
            <label className="form-label" htmlFor="month">Month (1-12)</label>
            <input 
              type="number" 
              id="month"
              name="month"
              className="form-control"
              min="1"
              max="12"
              value={formData.month}
              onChange={handleInputChange}
            />
          </div>

          {/* Hour */}
          <div className="form-group">
            <label className="form-label" htmlFor="hour">Hour (0-23)</label>
            <input 
              type="number" 
              id="hour"
              name="hour"
              className="form-control"
              min="0"
              max="23"
              value={formData.hour}
              onChange={handleInputChange}
            />
          </div>

          {/* Holiday */}
          <div className="form-group">
            <label className="form-label" htmlFor="holiday">Holiday</label>
            <select 
              id="holiday"
              name="holiday"
              className="form-control"
              value={formData.holiday}
              onChange={handleInputChange}
            >
              {weatherOptions.holiday.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Weekday */}
          <div className="form-group">
            <label className="form-label" htmlFor="weekday">Day of Week</label>
            <select 
              id="weekday"
              name="weekday"
              className="form-control"
              value={formData.weekday}
              onChange={handleInputChange}
            >
              {weatherOptions.weekday.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Working Day */}
          <div className="form-group">
            <label className="form-label" htmlFor="workingday">Working Day</label>
            <select 
              id="workingday"
              name="workingday"
              className="form-control"
              value={formData.workingday}
              onChange={handleInputChange}
            >
              {weatherOptions.workingday.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Weather */}
          <div className="form-group">
            <label className="form-label" htmlFor="weather">Weather Condition</label>
            <select 
              id="weather"
              name="weather"
              className="form-control"
              value={formData.weather}
              onChange={handleInputChange}
            >
              {weatherOptions.weather.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Temperature */}
          <div className="form-group">
            <label className="form-label" htmlFor="temp">Temperature (°C)</label>
            <input 
              type="number" 
              id="temp"
              name="temp"
              className="form-control"
              min="-10"
              max="45"
              step="0.5"
              value={formData.temp}
              onChange={handleInputChange}
            />
          </div>

          {/* Humidity */}
          <div className="form-group">
            <label className="form-label" htmlFor="humidity">Humidity (%)</label>
            <input 
              type="number" 
              id="humidity"
              name="humidity"
              className="form-control"
              min="0"
              max="100"
              value={formData.humidity}
              onChange={handleInputChange}
            />
          </div>

          {/* Wind Speed */}
          <div className="form-group">
            <label className="form-label" htmlFor="windspeed">Wind Speed (km/h)</label>
            <input 
              type="number" 
              id="windspeed"
              name="windspeed"
              className="form-control"
              min="0"
              max="50"
              step="0.5"
              value={formData.windspeed}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="mt-6">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Making Prediction...' : 'Make Prediction'}
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">How Predictions Work</h3>
        <p className="mb-2">
          The prediction system uses a Random Forest model trained on historical bike rental data.
          The model considers various factors including:
        </p>
        <ul className="list-disc pl-6 mb-2">
          <li>Season and time of year</li>
          <li>Day of week and whether it's a holiday</li>
          <li>Weather conditions (temperature, humidity, wind, etc.)</li>
          <li>Time of day</li>
        </ul>
        <p>
          Based on these inputs, the system predicts the number of bike rentals expected and 
          recommends resource allocation to optimize operations.
        </p>
      </div>
    </div>
  );
};

export default PredictionForm;
