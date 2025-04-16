import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const Dashboard = ({ historicalData, predictionResult, workers, bikes }) => {
  const [rentalsToday, setRentalsToday] = useState(0);
  const [rentalsTrend, setRentalsTrend] = useState('stable');
  const [dailyData, setDailyData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [bikeStatus, setBikeStatus] = useState([]);
  const [workerStatus, setWorkerStatus] = useState([]);
  const [weekdayData, setWeekdayData] = useState([]);
  const [weatherImpact, setWeatherImpact] = useState([]);
  const [topStations, setTopStations] = useState([]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

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

    // Generate weekday data
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekdayRentals = weekdays.map(day => ({ name: day, value: 0, count: 0 }));
    
    dailyDataArray.forEach(item => {
      const date = new Date(item.date);
      const dayOfWeek = date.getDay();
      weekdayRentals[dayOfWeek].value += item.rentals;
      weekdayRentals[dayOfWeek].count += 1;
    });
    
    // Calculate averages
    const weekdayAverages = weekdayRentals.map(day => ({
      name: day.name,
      average: day.count > 0 ? Math.round(day.value / day.count) : 0
    }));
    
    setWeekdayData(weekdayAverages);

    // Generate weather impact data (simulated)
    setWeatherImpact([
      { name: '☀️ Sunny', value: 120 },
      { name: '☁️ Cloudy', value: 85 },
      { name: '🌧️ Rainy', value: 40 },
      { name: '❄️ Snowy', value: 20 }
    ]);

    // Generate top stations data (simulated)
    setTopStations([
      { name: 'Central Park', rentals: 342, returns: 315 },
      { name: 'Downtown', rentals: 289, returns: 305 },
      { name: 'University', rentals: 252, returns: 241 },
      { name: 'Harbor View', rentals: 204, returns: 197 },
      { name: 'Tech District', rentals: 187, returns: 201 }
    ]);

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

  // Get emoji for trend
  const getTrendEmoji = () => {
    switch(rentalsTrend) {
      case 'increasing': return '🚀';
      case 'decreasing': return '📉';
      default: return '⟷';
    }
  };

  // Get emoji for bike status
  const getBikeEmoji = (status) => {
    switch(status) {
      case 'Available': return '🟢';
      case 'In Use': return '🔵';
      case 'Maintenance': return '🔧';
      default: return '❓';
    }
  };

  // Get emoji for worker status
  const getWorkerEmoji = (status) => {
    switch(status) {
      case 'Active': return '👨‍💼';
      case 'On Leave': return '🏖️';
      case 'Training': return '📚';
      default: return '❓';
    }
  };

  return (
    <div className="dashboard">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-1">🚲 Rentals Today</h3>
          <p className="text-3xl font-bold">{rentalsToday}</p>
          <div className={`mt-2 text-sm ${
            rentalsTrend === 'increasing' ? 'text-green-500' : 
            rentalsTrend === 'decreasing' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {getTrendEmoji()} {rentalsTrend === 'increasing' ? 'Higher than yesterday' : 
             rentalsTrend === 'decreasing' ? 'Lower than yesterday' : 'Same as yesterday'}
          </div>
        </div>

        <div className="card bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-1">👷 Total Workers</h3>
          <p className="text-3xl font-bold">{workers.length}</p>
          <div className="mt-2 text-sm">
            <span className="text-green-500">👨‍💼 {workers.filter(w => w.status === 'Active').length} Active</span> / 
            <span className="text-yellow-500"> 🏖️ {workers.filter(w => w.status !== 'Active').length} Inactive</span>
          </div>
        </div>

        <div className="card bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-1">🚴 Total Bikes</h3>
          <p className="text-3xl font-bold">{bikes.length}</p>
          <div className="mt-2 text-sm">
            <span className="text-green-500">🟢 {bikes.filter(b => b.status === 'Available').length} Available</span> / 
            <span className="text-blue-500"> 🔵 {bikes.filter(b => b.status === 'In Use').length} In Use</span> / 
            <span className="text-red-500"> 🔧 {bikes.filter(b => b.status === 'Maintenance').length} Maintenance</span>
          </div>
        </div>

        <div className="card bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-1">📊 Utilization Rate</h3>
          <p className="text-3xl font-bold">
            {bikes.length > 0 ? 
              Math.round((bikes.filter(b => b.status === 'In Use').length / bikes.length) * 100) : 0}%
          </p>
          <div className="mt-2 text-sm">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${bikes.length > 0 ? (bikes.filter(b => b.status === 'In Use').length / bikes.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Card (only shown if there's a prediction result) */}
      {predictionResult && (
        <div className="card bg-white p-4 rounded shadow mb-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">🔮 Latest Prediction</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Expected Rentals</h3>
              <p className="text-3xl font-bold text-blue-600">{predictionResult.prediction}</p>
              {predictionResult.event_message && (
                <div className="mt-2 text-sm text-yellow-600">
                  <span className="font-bold">📝 Note:</span> {predictionResult.event_message}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1">Resources Needed</h3>
              <p className="text-md">
                <span className="font-semibold">👷 Workers:</span> {predictionResult.resources.workers_needed}
              </p>
              <p className="text-md">
                <span className="font-semibold">🔧 Maintenance:</span> {predictionResult.resources.maintenance_staff}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1">Distribution</h3>
              <div className="text-sm">
                {Object.entries(predictionResult.resources.distribution).map(([station, count]) => (
                  <p key={station}>
                    <span className="font-semibold">📍 {station}:</span> {count} bikes
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Rentals Chart */}
        <div className="card bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">📈 Daily Rentals Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailyData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="rentals" 
                  stroke="#4361ee" 
                  fill="#4361ee" 
                  fillOpacity={0.3}
                  activeDot={{ r: 8 }} 
                  name="Rentals"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Rentals Chart */}
        <div className="card bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">🕒 Hourly Rentals Today</h3>
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
                  interval={2} // Show fewer ticks to avoid crowding
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
        <div className="card bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">🚲 Bikes by Status</h3>
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
                  label={({ name, percent }) => `${getBikeEmoji(name)} ${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {bikeStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Bikes`, 'Count']} />
                <Legend formatter={(value) => `${getBikeEmoji(value)} ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Worker Status Pie Chart */}
        <div className="card bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">👷 Workers by Status</h3>
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
                  label={({ name, percent }) => `${getWorkerEmoji(name)} ${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {workerStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Workers`, 'Count']} />
                <Legend formatter={(value) => `${getWorkerEmoji(value)} ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekday Rentals Radar Chart */}
        <div className="card bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">📆 Weekday Rental Pattern</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={weekdayData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                <Radar
                  name="Average Rentals"
                  dataKey="average"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip formatter={(value) => [`${value} Rentals`, 'Average']} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weather Impact Chart */}
        <div className="card bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">🌦️ Weather Impact</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weatherImpact}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Avg. Daily Rentals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Top Stations Table */}
        <div className="card bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">🏆 Top Performing Stations</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">📍 Station</th>
                  <th className="py-2 px-4 border-b text-left">🚲 Rentals</th>
                  <th className="py-2 px-4 border-b text-left">🔄 Returns</th>
                  <th className="py-2 px-4 border-b text-left">⚖️ Balance</th>
                  <th className="py-2 px-4 border-b text-left">📊 Status</th>
                </tr>
              </thead>
              <tbody>
                {topStations.map((station, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-4 border-b">{station.name}</td>
                    <td className="py-2 px-4 border-b">{station.rentals}</td>
                    <td className="py-2 px-4 border-b">{station.returns}</td>
                    <td className="py-2 px-4 border-b">
                      {station.returns - station.rentals}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {station.returns > station.rentals ? 
                        <span className="text-green-500">🔼 Accumulating</span> : 
                        station.returns < station.rentals ? 
                        <span className="text-red-500">🔽 Depleting</span> : 
                        <span className="text-blue-500">⚖️ Balanced</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hourly Data Table */}
        <div className="card bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">⏱️ Detailed Hourly Data</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">🕒 Hour</th>
                  <th className="py-2 px-4 border-b text-left">🚲 Rentals</th>
                  <th className="py-2 px-4 border-b text-left">📊 % of Daily</th>
                  <th className="py-2 px-4 border-b text-left">📈 Trend</th>
                </tr>
              </thead>
              <tbody>
                {hourlyData.map((hour, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-4 border-b">{formatHour(hour.hour)}</td>
                    <td className="py-2 px-4 border-b">{hour.rentals}</td>
                    <td className="py-2 px-4 border-b">
                      {rentalsToday > 0 ? ((hour.rentals / rentalsToday) * 100).toFixed(1) : 0}%
                    </td>
                    <td className="py-2 px-4 border-b">
                      {index > 0 ? 
                        hour.rentals > hourlyData[index-1].rentals ? 
                        <span className="text-green-500">🔼</span> : 
                        hour.rentals < hourlyData[index-1].rentals ? 
                        <span className="text-red-500">🔽</span> : 
                        <span className="text-blue-500">⟷</span>
                        : '—'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card bg-white p-4 rounded shadow hover:shadow-lg transition-shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">🎯 Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium text-gray-500">⏱️ Average Rental Duration</h4>
            <p className="text-2xl font-bold mt-1">42 min</p>
            <div className="text-sm text-green-500 mt-1">↑ +7% from last week</div>
          </div>
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium text-gray-500">💰 Revenue per Bike</h4>
            <p className="text-2xl font-bold mt-1">$24.50</p>
            <div className="text-sm text-green-500 mt-1">↑ +12% from last week</div>
          </div>
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium text-gray-500">🔄 Turnover Rate</h4>
            <p className="text-2xl font-bold mt-1">5.3×</p>
            <div className="text-sm text-red-500 mt-1">↓ -3% from last week</div>
          </div>
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium text-gray-500">⭐ Customer Rating</h4>
            <p className="text-2xl font-bold mt-1">4.7/5</p>
            <div className="text-sm text-green-500 mt-1">↑ +0.2 from last week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
