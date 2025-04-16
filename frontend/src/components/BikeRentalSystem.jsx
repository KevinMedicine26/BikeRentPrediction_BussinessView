import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import PredictionForm from './PredictionForm';
import WorkerManagement from './WorkerManagement';
import BikeManagement from './BikeManagement';
import { getHistoricalData, getWorkers, getBikes } from '../services/api';
import { mockHistoricalData, mockWorkers, mockBikes } from '../services/mockData';

const BikeRentalSystem = () => {
  // State for the active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State for the data
  const [historicalData, setHistoricalData] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState({
    historicalData: true,
    workers: true,
    bikes: true
  });
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch historical data
        try {
          const historicalData = await getHistoricalData();
          setHistoricalData(historicalData);
        } catch (error) {
          console.warn('Using mock historical data due to API error:', error);
          setHistoricalData(mockHistoricalData);
        } finally {
          setLoading(prev => ({ ...prev, historicalData: false }));
        }

        // Fetch workers data
        try {
          const workers = await getWorkers();
          setWorkers(workers);
        } catch (error) {
          console.warn('Using mock workers data due to API error:', error);
          setWorkers(mockWorkers);
        } finally {
          setLoading(prev => ({ ...prev, workers: false }));
        }

        // Fetch bikes data
        try {
          const bikes = await getBikes();
          setBikes(bikes);
        } catch (error) {
          console.warn('Using mock bikes data due to API error:', error);
          setBikes(mockBikes);
        } finally {
          setLoading(prev => ({ ...prev, bikes: false }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  // Save workers and bikes to localStorage when they change
  useEffect(() => {
    if (workers.length > 0) {
      localStorage.setItem('bikeRentalWorkers', JSON.stringify(workers));
    }
  }, [workers]);

  useEffect(() => {
    if (bikes.length > 0) {
      localStorage.setItem('bikeRentalBikes', JSON.stringify(bikes));
    }
  }, [bikes]);

  // Handler for updating prediction result
  const handlePredictionResult = (result) => {
    setPredictionResult(result);
    setActiveTab('dashboard'); // Switch to dashboard to show results
  };

  // Handler for adding a worker
  const handleAddWorker = (worker) => {
    const newWorker = { ...worker, id: Date.now().toString() };
    setWorkers([...workers, newWorker]);
  };

  // Handler for updating a worker
  const handleUpdateWorker = (updatedWorker) => {
    setWorkers(workers.map(worker => 
      worker.id === updatedWorker.id ? updatedWorker : worker
    ));
  };

  // Handler for deleting a worker
  const handleDeleteWorker = (workerId) => {
    setWorkers(workers.filter(worker => worker.id !== workerId));
  };

  // Handler for adding a bike
  const handleAddBike = (bike) => {
    const newBike = { ...bike, id: Date.now().toString() };
    setBikes([...bikes, newBike]);
  };

  // Handler for updating a bike
  const handleUpdateBike = (updatedBike) => {
    setBikes(bikes.map(bike => 
      bike.id === updatedBike.id ? updatedBike : bike
    ));
  };

  // Handler for deleting a bike
  const handleDeleteBike = (bikeId) => {
    setBikes(bikes.filter(bike => bike.id !== bikeId));
  };

  // Render loading state if data is still loading
  if (loading.historicalData || loading.workers || loading.bikes) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p className="mt-4">Loading application data...</p>
      </div>
    );
  }

  // Render error state if there was an error
  if (error) {
    return (
      <div className="alert alert-danger">
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          className="btn btn-primary mt-4" 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bike-rental-system">
      {/* Navigation Tabs */}
      <div className="card">
        <div className="flex border-b mb-4 overflow-x-auto">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'prediction' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('prediction')}
          >
            Make Prediction
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'workers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('workers')}
          >
            Worker Management
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'bikes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('bikes')}
          >
            Bike Management
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            historicalData={historicalData} 
            predictionResult={predictionResult}
            workers={workers}
            bikes={bikes}
          />
        )}

        {activeTab === 'prediction' && (
          <PredictionForm 
            onPredictionResult={handlePredictionResult} 
          />
        )}

        {activeTab === 'workers' && (
          <WorkerManagement 
            workers={workers}
            onAddWorker={handleAddWorker}
            onUpdateWorker={handleUpdateWorker}
            onDeleteWorker={handleDeleteWorker}
          />
        )}

        {activeTab === 'bikes' && (
          <BikeManagement 
            bikes={bikes}
            onAddBike={handleAddBike}
            onUpdateBike={handleUpdateBike}
            onDeleteBike={handleDeleteBike}
          />
        )}
      </div>
    </div>
  );
};

export default BikeRentalSystem;
