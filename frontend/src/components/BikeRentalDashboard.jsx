import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getPrediction, getHistoricalData } from '../services/api';

// Mock data with English labels
const usageData = [
  { month: 'Jan', rentals: 4000, repairs: 240 },
  { month: 'Feb', rentals: 3000, repairs: 210 },
  { month: 'Mar', rentals: 5000, repairs: 290 },
  { month: 'Apr', rentals: 7000, repairs: 350 },
  { month: 'May', rentals: 9000, repairs: 410 },
  { month: 'Jun', rentals: 8000, repairs: 390 },
];

const stationData = [
  { name: 'Central Station', value: 400 },
  { name: 'Downtown', value: 300 },
  { name: 'University', value: 500 },
  { name: 'Westside', value: 200 },
  { name: 'Riverside', value: 280 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const BikeRentalDashboard = () => {
  const [bikeCount, setBikeCount] = useState(500);
  const [usageIntensity, setUsageIntensity] = useState(70);
  const [weatherFactor, setWeatherFactor] = useState(50);
  
  // Weather prediction related states
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(60);
  const [precipitation, setPrecipitation] = useState(0);
  const [windSpeed, setWindSpeed] = useState(10);
  const [isHoliday, setIsHoliday] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [season, setSeason] = useState(2); // Default to summer (1: spring, 2: summer, 3: fall, 4: winter)
  const [hour, setHour] = useState(new Date().getHours());
  const [workingday, setWorkingday] = useState(new Date().getDay() === 0 || new Date().getDay() === 6 ? 0 : 1);
  const [weather, setWeather] = useState(1); // Default to Clear weather (1: Clear, 2: Cloudy, 3: Light Rain, 4: Heavy Rain)
  
  // Prediction results
  const [predictedRentals, setPredictedRentals] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionError, setPredictionError] = useState(null);
  
  // Prediction data for future days (will be updated after prediction)
  const [futurePredictions, setFuturePredictions] = useState([]);
  
  // Calculate maintenance workload
  const calculateMaintenanceLoad = () => {
    // Simple formula: bike count * usage intensity * weather factor / 10000
    const baseLoad = (bikeCount * usageIntensity * weatherFactor) / 10000;
    return {
      dailyInspections: Math.round(baseLoad * 20),
      weeklyMaintenance: Math.round(baseLoad * 5),
      monthlyOverhaul: Math.round(baseLoad * 1.2),
      staffNeeded: Math.ceil(baseLoad * 3)
    };
  };
  
  // Call model API
  const predictRentals = async () => {
    setIsLoading(true);
    setPredictionError(null);
    
    try {
      // Calculate working day based on day of week (0,6 are weekend)
      const isWorkingDay = (dayOfWeek !== 0 && dayOfWeek !== 6) ? 1 : 0;
      
      // Prepare parameters exactly as expected by the API
      const apiParams = {
        season: parseInt(season),
        month: parseInt(new Date().getMonth() + 1), // Current month (1-12)
        hour: parseInt(hour),
        holiday: isHoliday ? 1 : 0,
        weekday: parseInt(dayOfWeek),
        workingday: isWorkingDay,
        weather: parseInt(weather),
        temp: parseFloat(temperature),
        humidity: parseFloat(humidity),
        windspeed: parseFloat(windSpeed),
        // Add year parameter which is expected by the API
        year: 1
      };
      
      console.log('Sending API request with params:', apiParams);
      
      // Make the API call
      const response = await getPrediction(apiParams);
      console.log('API response:', response);
      
      // Handle the API response
      if (response && typeof response.prediction === 'number') {
        setPredictedRentals(response.prediction);
        
        // Generate future 7 days predictions data based on the current prediction
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const predictions = [];
        
        for (let i = 0; i < 7; i++) {
          const futureDay = (dayOfWeek + i) % 7;
          const dayName = weekdays[futureDay];
          const isWeekend = futureDay === 0 || futureDay === 6;
          const tempVariation = Math.random() * 5 - 2.5; // -2.5 to 2.5 random variation
          const rainChance = Math.random() > 0.7;
          const rainAmount = rainChance ? Math.random() * 20 : 0;
          
          const dailyBasePrediction = response.prediction * 0.9; // Base from the actual prediction
          const dailyTempFactor = (temperature + tempVariation) > 20 ? 
                                ((temperature + tempVariation) - 20) * 0.05 : 
                                ((temperature + tempVariation) - 20) * 0.03;
          const dailyRainFactor = rainAmount > 0 ? -rainAmount * 0.1 : 0;
          const dailyWeekendBonus = isWeekend ? 0.2 : 0;
          
          const variation = 1 + dailyTempFactor + dailyRainFactor + dailyWeekendBonus;
          const dailyPrediction = Math.max(0, Math.round(dailyBasePrediction * variation));
          
          predictions.push({
            day: dayName,
            date: `4/${3 + i}`,
            prediction: dailyPrediction,
            temperature: Math.round(temperature + tempVariation),
            precipitation: Math.round(rainAmount),
          });
        }
        
        setFuturePredictions(predictions);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Prediction failed:', error);
      setPredictionError('Failed to get prediction data, please try again later. Error: ' + (error.message || JSON.stringify(error)));
    } finally {
      setIsLoading(false);
    }
  };
  
  const maintenanceLoad = calculateMaintenanceLoad();
  
  // Calculate maintenance workload based on predicted rentals
  const calculatePredictedMaintenance = () => {
    if (predictedRentals === null) return null;
    
    const maintenanceFactor = predictedRentals / 1000;
    return {
      dailyInspections: Math.round(maintenanceFactor * 15),
      repairs: Math.round(maintenanceFactor * 3)
    };
  };
  
  const predictedMaintenance = calculatePredictedMaintenance();
  
  // Chart container style for consistent sizing
  const chartContainerStyle = {
    width: '100%',
    height: 300,
    marginTop: 15,
    marginBottom: 15
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 md:p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Bike Rental Prediction System - Maintenance Dashboard</h1>
        </div>
      </header>
      
      <div className="flex-1 container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Bikes</h3>
            <p className="text-3xl font-bold">{bikeCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Daily Rentals</h3>
            <p className="text-3xl font-bold">2,543</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Bikes in Repair</h3>
            <p className="text-3xl font-bold">23</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Maintenance Staff</h3>
            <p className="text-3xl font-bold">{maintenanceLoad.staffNeeded}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Rentals & Repairs</h3>
            <div style={chartContainerStyle}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={usageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend wrapperStyle={{ marginTop: "10px" }} />
                  <Bar yAxisId="left" dataKey="rentals" name="Rentals" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="repairs" name="Repairs" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
              {usageData.length === 0 && <p>No data available.</p>}
            </div>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Popular Stations</h3>
            <div style={chartContainerStyle}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stationData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {stationData.length === 0 && <p>No data available.</p>}
            </div>
          </div>
        </div>
        
        {/* Weather-rental prediction module */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Weather-Based Rental Prediction Model</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Temperature (°C)</label>
              <input
                type="range"
                min="-10"
                max="40"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between">
                <span>-10°C</span>
                <span className="font-semibold">{temperature}°C</span>
                <span>40°C</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Humidity (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={humidity}
                onChange={(e) => setHumidity(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between">
                <span>0%</span>
                <span className="font-semibold">{humidity}%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Precipitation (mm)</label>
              <input
                type="range"
                min="0"
                max="50"
                value={precipitation}
                onChange={(e) => setPrecipitation(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between">
                <span>0mm</span>
                <span className="font-semibold">{precipitation}mm</span>
                <span>50mm</span>
              </div>
            </div>
          
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Wind Speed (m/s)</label>
              <input
                type="range"
                min="0"
                max="30"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between">
                <span>0 m/s</span>
                <span className="font-semibold">{windSpeed} m/s</span>
                <span>30 m/s</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Day of Week</label>
              <select 
                className="w-full p-2 border rounded" 
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Holiday</label>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  checked={isHoliday}
                  onChange={(e) => setIsHoliday(e.target.checked)}
                  className="h-5 w-5"
                />
                <span className="ml-2 text-gray-700">Is a holiday</span>
              </div>
            </div>
          
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Season</label>
              <select 
                className="w-full p-2 border rounded" 
                value={season}
                onChange={(e) => setSeason(parseInt(e.target.value))}
              >
                <option value={1}>Spring</option>
                <option value={2}>Summer</option>
                <option value={3}>Fall</option>
                <option value={4}>Winter</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Hour (0-23)</label>
              <input
                type="number"
                min="0"
                max="23"
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Weather Condition</label>
              <select 
                className="w-full p-2 border rounded" 
                value={weather}
                onChange={(e) => setWeather(parseInt(e.target.value))}
              >
                <option value={1}>Clear</option>
                <option value={2}>Cloudy</option>
                <option value={3}>Light Rain</option>
                <option value={4}>Heavy Rain</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-center mt-6 mb-6">
            <button 
              className="px-6 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              onClick={predictRentals}
              disabled={isLoading}
            >
              {isLoading ? 'Predicting...' : 'Predict Rental Volume'}
            </button>
          </div>
          
          {predictedRentals !== null && !predictionError && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-blue-800 mb-3">Prediction Result</h4>
                <div className="text-4xl font-bold text-blue-700">{predictedRentals} <span className="text-xl">rentals</span></div>
                <p className="mt-2 text-blue-600">Based on current weather conditions</p>
                
                {predictedMaintenance && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h5 className="font-semibold text-gray-700">Daily Inspections</h5>
                      <p className="text-2xl font-bold">{predictedMaintenance.dailyInspections}</p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h5 className="font-semibold text-gray-700">Expected Repairs</h5>
                      <p className="text-2xl font-bold">{predictedMaintenance.repairs}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Prediction Factor Analysis</h4>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span>Temperature Impact</span>
                    <span className={temperature > 15 && temperature < 30 ? "text-green-600 font-bold" : "text-yellow-600 font-bold"}>
                      {temperature > 15 && temperature < 30 ? "Ideal for Cycling" : "Reduces Cycling Intent"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Precipitation Impact</span>
                    <span className={precipitation > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                      {precipitation > 0 ? `Reduces by ~${Math.round(precipitation * 3)}%` : "No Negative Impact"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Time Impact</span>
                    <span className={(dayOfWeek === 0 || dayOfWeek === 6) ? "text-green-600 font-bold" : "text-blue-600 font-bold"}>
                      {(dayOfWeek === 0 || dayOfWeek === 6) ? "Weekend +15%" : "Standard Weekday"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Holiday Impact</span>
                    <span className={isHoliday ? "text-green-600 font-bold" : "text-gray-600"}>
                      {isHoliday ? "Increases by ~25%" : "No Additional Impact"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {predictionError && (
            <div className="bg-red-50 p-4 rounded-lg text-red-700">
              <p className="font-semibold">{predictionError}</p>
            </div>
          )}
          
          {futurePredictions.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">7-Day Forecast</h4>
              <div style={chartContainerStyle}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={futurePredictions}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value, index) => `${value} ${futurePredictions[index].day}`} />
                    <YAxis />
                    <Tooltip content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-sm">
                            <p className="font-semibold">{data.date} {data.day}</p>
                            <p>Predicted Rentals: <span className="font-bold">{data.prediction}</span></p>
                            <p>Temperature: {data.temperature}°C</p>
                            <p>Precipitation: {data.precipitation}mm</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend wrapperStyle={{ marginTop: "10px" }} />
                    <Line type="monotone" dataKey="prediction" name="Predicted Rentals" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
                {futurePredictions.length === 0 && <p>No data available.</p>}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Maintenance Workload Calculator</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Total Bike Count</label>
              <input
                type="range"
                min="100"
                max="2000"
                value={bikeCount}
                onChange={(e) => setBikeCount(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between">
                <span>100</span>
                <span className="font-semibold">{bikeCount}</span>
                <span>2000</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Usage Intensity (%)</label>
              <input
                type="range"
                min="10"
                max="100"
                value={usageIntensity}
                onChange={(e) => setUsageIntensity(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between">
                <span>Low (10%)</span>
                <span className="font-semibold">{usageIntensity}%</span>
                <span>High (100%)</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Weather Factor</label>
              <input
                type="range"
                min="10"
                max="100"
                value={weatherFactor}
                onChange={(e) => setWeatherFactor(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between">
                <span>Good (10)</span>
                <span className="font-semibold">{weatherFactor}</span>
                <span>Severe (100)</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700">Daily Inspections</h4>
              <p className="text-2xl font-bold">{maintenanceLoad.dailyInspections}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-700">Weekly Maintenance</h4>
              <p className="text-2xl font-bold">{maintenanceLoad.weeklyMaintenance}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-700">Monthly Overhauls</h4>
              <p className="text-2xl font-bold">{maintenanceLoad.monthlyOverhaul}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-700">Recommended Staff</h4>
              <p className="text-2xl font-bold">{maintenanceLoad.staffNeeded}</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white p-4 text-center">
        Bike Rental Prediction Management System 2025
      </footer>
    </div>
  );
};

export default BikeRentalDashboard;
