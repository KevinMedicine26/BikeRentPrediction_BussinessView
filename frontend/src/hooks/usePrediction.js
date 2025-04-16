import { useState } from 'react';
import { getPrediction } from '../services/api';
import { mockPredictionResult } from '../services/mockData';

/**
 * Custom hook to manage bike rental predictions
 * @returns {Object} Hook interface containing prediction state and methods
 */
const usePrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Make a prediction based on weather parameters
   * @param {Object} weatherParams - Weather parameters for prediction
   * @returns {Promise<Object>} Prediction result
   */
  const makePrediction = async (weatherParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getPrediction(weatherParams);
      setPrediction(result);
      return result;
    } catch (error) {
      console.error('Error making prediction:', error);
      console.warn('Using mock prediction result due to API error');
      
      // Use mock data as fallback
      const mockResult = { ...mockPredictionResult };
      setPrediction(mockResult);
      setError('Could not connect to prediction API. Using simulated prediction.');
      return mockResult;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear the current prediction
   */
  const clearPrediction = () => {
    setPrediction(null);
    setError(null);
  };

  return {
    prediction,
    loading,
    error,
    makePrediction,
    clearPrediction
  };
};

export default usePrediction;
