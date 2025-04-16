import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Prediction API functions
export const getPrediction = async (weatherParams) => {
  try {
    const response = await apiClient.post('/api/predict', weatherParams);
    return response.data;
  } catch (error) {
    console.error('Error getting prediction:', error);
    throw error;
  }
};

// Historical data API functions
export const getHistoricalData = async () => {
  try {
    const response = await apiClient.get('/api/historical');
    return response.data;
  } catch (error) {
    console.error('Error getting historical data:', error);
    throw error;
  }
};

// Worker management API functions
export const getWorkers = async () => {
  try {
    const response = await apiClient.get('/api/workers');
    return response.data;
  } catch (error) {
    console.error('Error getting workers:', error);
    throw error;
  }
};

// Bike management API functions
export const getBikes = async () => {
  try {
    const response = await apiClient.get('/api/bikes');
    return response.data;
  } catch (error) {
    console.error('Error getting bikes:', error);
    throw error;
  }
};

export default {
  getPrediction,
  getHistoricalData,
  getWorkers,
  getBikes
};
