import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const Dashboard = ({ historicalData, predictionResult, workers, bikes }) => {
  const [rentalsToday, setRentalsToday] = useState(0);
  const [rentalsTrend, setRentalsTrend] = useState('stable');
  const [dailyData, setDailyData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [bikeStatus, setBikeStatus] = useState([]);
  const [workerStatus, setWorkerStatus] = useState([]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Process historical data for charts when it changes
  useEffect(() => {
    if (!historicalData || historicalData.length === 0) return;

    // Group data by date for daily chart
    const groupedByDay = historicalData.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = { date: item.date, rentals: 0 };
      }
      acc[item.date].rentals += item.rentals;
      return acc;
    }, {});

    const dailyDataArray = Object.values(groupedByDay).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    // Process hourly data for today or the most recent day
    const mostRecentDay = dailyDataArray[dailyDataArray.length - 1]?.date;
    const todayData = historicalData
      .filter(item => item.date === mostRecentDay)
      .sort((a, b) => a.hour - b.hour);

    // Calculate rentals for today
    const todayRentals = todayData.reduce((sum, item) => sum + item.rentals, 0);
    setRentalsToday(todayRentals);

    // Calculate trend comparing to yesterday
    if (dailyDataArray.length >= 2) {
      const yesterdayRentals = dailyDataArray[dailyDataArray.length - 2].rentals;
      if (todayRentals > yesterdayRentals) {
        setRentalsTrend('increasing');
      } else if (todayRentals < yesterdayRentals) {
        setRentalsTrend('decreasing');
      } else {
        setRentalsTrend('stable');
      }
    }

    setDailyData(dailyDataArray);
    setHourlyData(todayData);

  }, [historicalData]);

  // Process bike status data
  useEffect(() => {
    if (!bikes || bikes.length === 0) return;

    const statusCount = bikes.reduce((acc, bike) => {
      if (!acc[bike.status]) {
        acc[bike.status] = 0;
      }
      acc[bike.status]++;
      return acc;
    }, {});

    const bikeStatusData = Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count
    }));

    setBikeStatus(bikeStatusData);
  }, [bikes]);

  // Process worker status data
  useEffect(() => {
    if (!workers || workers.length === 0) return;

    const statusCount = workers.reduce((acc, worker) => {
      if (!acc[worker.status]) {
        acc[worker.status] = 0;
      }
      acc[worker.status]++;
      return acc;
    }, {});

    const workerStatusData = Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count
    }));

    setWorkerStatus(workerStatusData);
  }, [workers]);

  // Format time for hourly chart
  const formatHour = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  return (
    <div className="dashboard">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-1">Rentals Today</h3>
          <p className="text-3xl font-bold">{rentalsToday}</p>
          <div className={`mt-2 text-sm ${
            rentalsTrend === 'increasing' ? 'text-green-500' : 
            rentalsTrend === 'decreasing' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {rentalsTrend === 'increasing' ? '↑ Higher than yesterday' : 
             rentalsTrend === 'decreasing' ? '↓ Lower than yesterday' : '→ Same as yesterday'}
          </div>
        </div>

        <div className="card bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-1">Total Workers</h3>
          <p className="text-3xl font-bold">{workers.length}</p>
          <div className="mt-2 text-sm">
            <span className="text-green-500">{workers.filter(w => w.status === 'Active').length} Active</span> / 
            <span className="text-yellow-500"> {workers.filter(w => w.status !== 'Active').length} Inactive</span>
          </div>
        </div>

        <div className="card bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-1">Total Bikes</h3>
          <p className="text-3xl font-bold">{bikes.length}</p>
          <div className="mt-2 text-sm">
            <span className="text-green-500">{bikes.filter(b => b.status === 'Available').length} Available</span> / 
            <span className="text-blue-500"> {bikes.filter(b => b.status === 'In Use').length} In Use</span> / 
            <span className="text-red-500"> {bikes.filter(b => b.status === 'Maintenance').length} Maintenance</span>
          </div>
        </div>
      </div>

      {/* Prediction Card (only shown if there's a prediction result) */}
      {predictionResult && (
        <div className="card bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-2">Latest Prediction</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Expected Rentals</h3>
              <p className="text-3xl font-bold text-blue-600">{predictionResult.prediction}</p>
              {predictionResult.event_message && (
                <div className="mt-2 text-sm text-yellow-600">
                  <span className="font-bold">Note:</span> {predictionResult.event_message}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1">Resources Needed</h3>
              <p className="text-md">
                <span className="font-semibold">Workers:</span> {predictionResult.resources.workers_needed}
              </p>
              <p className="text-md">
                <span className="font-semibold">Maintenance:</span> {predictionResult.resources.maintenance_staff}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1">Distribution</h3>
              <div className="text-sm">
                {Object.entries(predictionResult.resources.distribution).map(([station, count]) => (
                  <p key={station}>
                    <span className="font-semibold">{station}:</span> {count} bikes
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Rentals Chart */}
        <div className="card bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Daily Rentals Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rentals" 
                  stroke="#4361ee" 
                  activeDot={{ r: 8 }} 
                  name="Rentals"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Rentals Chart */}
        <div className="card bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Hourly Rentals Today</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourlyData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  tickFormatter={formatHour}
                  interval={3} // Show fewer ticks to avoid crowding
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(hour) => `Time: ${formatHour(hour)}`}
                  formatter={(value) => [`${value} Rentals`, 'Count']}
                />
                <Legend />
                <Bar dataKey="rentals" fill="#3f83f8" name="Hourly Rentals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bike Status Pie Chart */}
        <div className="card bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Bikes by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bikeStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {bikeStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Bikes`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Worker Status Pie Chart */}
        <div className="card bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Workers by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workerStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {workerStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Workers`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
