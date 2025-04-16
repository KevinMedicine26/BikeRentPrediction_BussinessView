import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area } from 'recharts';
import { getPrediction } from '../services/api';
// 新增 Material-UI 组件
import { Box, Grid, Card, CardContent, Typography, Button, Switch, Select, MenuItem, FormControl, InputLabel, TextField, CircularProgress, Slider, Tabs, Tab, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// Mock data with English labels
const usageData = [
  { month: 'Jan', rentals: 4000, repairs: 240 },
  { month: 'Feb', rentals: 3000, repairs: 210 },
  { month: 'Mar', rentals: 5000, repairs: 290 },
  { month: 'Apr', rentals: 7000, repairs: 350 },
  { month: 'May', rentals: 9000, repairs: 410 },
  { month: 'Jun', rentals: 8000, repairs: 390 },
  { month: 'Jul', rentals: 9500, repairs: 430 },
  { month: 'Aug', rentals: 9200, repairs: 420 },
  { month: 'Sep', rentals: 7500, repairs: 380 },
  { month: 'Oct', rentals: 6000, repairs: 320 },
  { month: 'Nov', rentals: 4500, repairs: 270 },
  { month: 'Dec', rentals: 3500, repairs: 230 },
];

const stationData = [
  { name: 'Central Station', value: 400 },
  { name: 'Downtown', value: 300 },
  { name: 'University', value: 500 },
  { name: 'Westside', value: 200 },
  { name: 'Riverside', value: 280 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// 自定义卡片样式
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
  marginBottom: theme.spacing(2),
}));

const BikeRentalDashboard = () => {
  const [bikeCount, setBikeCount] = useState(500);
  const [usageIntensity, setUsageIntensity] = useState(70);
  const [weatherFactor, setWeatherFactor] = useState(50);
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(60);
  const [precipitation, setPrecipitation] = useState(0);
  const [windSpeed, setWindSpeed] = useState(10);
  const [isHoliday, setIsHoliday] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [season, setSeason] = useState(2);
  const [hour, setHour] = useState(new Date().getHours());
  const [workingday, setWorkingday] = useState(new Date().getDay() === 0 || new Date().getDay() === 6 ? 0 : 1);
  const [weather, setWeather] = useState(1);
  const [predictedRentals, setPredictedRentals] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionError, setPredictionError] = useState(null);
  const [futurePredictions, setFuturePredictions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const calculateMaintenanceLoad = () => {
    const baseLoad = (bikeCount * usageIntensity * weatherFactor) / 10000;
    return {
      dailyInspections: Math.round(baseLoad * 20),
      weeklyMaintenance: Math.round(baseLoad * 5),
      monthlyOverhaul: Math.round(baseLoad * 1.2),
      staffNeeded: Math.ceil(baseLoad * 3)
    };
  };

  const predictRentals = async () => {
    setIsLoading(true);
    setPredictionError(null);
    try {
      const isWorkingDay = (dayOfWeek !== 0 && dayOfWeek !== 6) ? 1 : 0;
      const apiParams = {
        season: parseInt(season),
        month: parseInt(new Date().getMonth() + 1),
        hour: parseInt(hour),
        holiday: isHoliday ? 1 : 0,
        weekday: parseInt(dayOfWeek),
        workingday: isWorkingDay,
        weather: parseInt(weather),
        temp: parseFloat(temperature),
        atemp: parseFloat(temperature) * 0.9, // Calculate apparent temperature based on actual temp
        humidity: parseFloat(humidity),
        windspeed: parseFloat(windSpeed),
        year: 1
      };
      console.log("Sending prediction params:", apiParams);
      const response = await getPrediction(apiParams);
      console.log("Prediction response:", response);
      if (response && typeof response.prediction === 'number') {
        setPredictedRentals(response.prediction);
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const predictions = [];
        for (let i = 0; i < 7; i++) {
          predictions.push({
            day: weekdays[(dayOfWeek + i) % 7],
            prediction: Math.round(response.prediction * (1 + 0.05 * Math.sin(i)))
          });
        }
        setFuturePredictions(predictions);
      } else {
        setPredictionError('Invalid API response');
      }
    } catch (err) {
      console.error("Prediction error:", err);
      setPredictionError('Prediction failed: ' + (err.message || 'Unknown error'));
    }
    setIsLoading(false);
  };

  const maintenance = calculateMaintenanceLoad();

  return (
    <Box 
      sx={{ 
        bgcolor: '#f5f6fa', 
        minHeight: '100vh',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}
    >
      <Typography variant="h4" fontWeight={700} gutterBottom align="center" sx={{ py: 2 }}>
        🚲 Bike Rental Dashboard
      </Typography>
      
      <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', px: { xs: 1, md: 3 } }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Parameters section - scrollable sidebar */}
          <Grid item xs={12} md={3} sx={{ height: '100%' }}>
            <Box sx={{ overflowY: 'auto', height: '100%', pr: 1 }}>
              <StyledCard sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Parameters
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Bike Count" type="number" value={bikeCount} onChange={e => setBikeCount(Number(e.target.value))} size="small" />
                    <Slider
                      value={bikeCount}
                      onChange={(e, newValue) => setBikeCount(newValue)}
                      min={100}
                      max={1000}
                      step={10}
                      valueLabelDisplay="auto"
                      aria-labelledby="bike-count-slider"
                    />
                    
                    <TextField label="Usage Intensity" type="number" value={usageIntensity} onChange={e => setUsageIntensity(Number(e.target.value))} size="small" />
                    <Slider
                      value={usageIntensity}
                      onChange={(e, newValue) => setUsageIntensity(newValue)}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                      aria-labelledby="usage-intensity-slider"
                    />
                    
                    <TextField label="Weather Factor" type="number" value={weatherFactor} onChange={e => setWeatherFactor(Number(e.target.value))} size="small" />
                    <Slider
                      value={weatherFactor}
                      onChange={(e, newValue) => setWeatherFactor(newValue)}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                      aria-labelledby="weather-factor-slider"
                    />
                    
                    <TextField label="Temperature (°C)" type="number" value={temperature} onChange={e => setTemperature(Number(e.target.value))} size="small" />
                    <Slider
                      value={temperature}
                      onChange={(e, newValue) => setTemperature(newValue)}
                      min={-10}
                      max={40}
                      valueLabelDisplay="auto"
                      aria-labelledby="temperature-slider"
                    />
                    
                    <TextField label="Humidity (%)" type="number" value={humidity} onChange={e => setHumidity(Number(e.target.value))} size="small" />
                    <Slider
                      value={humidity}
                      onChange={(e, newValue) => setHumidity(newValue)}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                      aria-labelledby="humidity-slider"
                    />
                    
                    <TextField label="Precipitation (mm)" type="number" value={precipitation} onChange={e => setPrecipitation(Number(e.target.value))} size="small" />
                    <Slider
                      value={precipitation}
                      onChange={(e, newValue) => setPrecipitation(newValue)}
                      min={0}
                      max={50}
                      valueLabelDisplay="auto"
                      aria-labelledby="precipitation-slider"
                    />
                    
                    <TextField label="Wind Speed (km/h)" type="number" value={windSpeed} onChange={e => setWindSpeed(Number(e.target.value))} size="small" />
                    <Slider
                      value={windSpeed}
                      onChange={(e, newValue) => setWindSpeed(newValue)}
                      min={0}
                      max={50}
                      valueLabelDisplay="auto"
                      aria-labelledby="wind-speed-slider"
                    />
                    
                    <FormControl size="small">
                      <InputLabel>Day of Week</InputLabel>
                      <Select value={dayOfWeek} label="Day of Week" onChange={e => setDayOfWeek(Number(e.target.value))}>
                        <MenuItem value={0}>Sunday</MenuItem>
                        <MenuItem value={1}>Monday</MenuItem>
                        <MenuItem value={2}>Tuesday</MenuItem>
                        <MenuItem value={3}>Wednesday</MenuItem>
                        <MenuItem value={4}>Thursday</MenuItem>
                        <MenuItem value={5}>Friday</MenuItem>
                        <MenuItem value={6}>Saturday</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <InputLabel>Season</InputLabel>
                      <Select value={season} label="Season" onChange={e => setSeason(Number(e.target.value))}>
                        <MenuItem value={1}>Spring</MenuItem>
                        <MenuItem value={2}>Summer</MenuItem>
                        <MenuItem value={3}>Fall</MenuItem>
                        <MenuItem value={4}>Winter</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <InputLabel>Hour</InputLabel>
                      <Select value={hour} label="Hour" onChange={e => setHour(Number(e.target.value))}>
                        {[...Array(24)].map((_, i) => (
                          <MenuItem key={i} value={i}>{i}:00</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <InputLabel>Weather</InputLabel>
                      <Select value={weather} label="Weather" onChange={e => setWeather(Number(e.target.value))}>
                        <MenuItem value={1}>Clear</MenuItem>
                        <MenuItem value={2}>Cloudy</MenuItem>
                        <MenuItem value={3}>Light Rain</MenuItem>
                        <MenuItem value={4}>Heavy Rain</MenuItem>
                      </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>Holiday</Typography>
                      <Switch checked={isHoliday} onChange={e => setIsHoliday(e.target.checked)} />
                    </Box>
                    <Button variant="contained" color="primary" onClick={predictRentals} disabled={isLoading} sx={{ mt: 1 }}>
                      {isLoading ? <CircularProgress size={24} /> : 'Predict Rentals'}
                    </Button>
                    {predictionError && <Typography color="error">{predictionError}</Typography>}
                  </Box>
                </CardContent>
              </StyledCard>
            </Box>
          </Grid>
          
          {/* Main content area - scrollable charts and data */}
          <Grid item xs={12} md={9} sx={{ height: '100%', overflow: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Tab Navigation */}
              <Paper sx={{ mb: 2 }}>
                <Tabs 
                  value={activeTab} 
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  variant="fullWidth"
                  indicatorColor="primary"
                  textColor="primary"
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab label="Prediction Result" />
                  <Tab label="Maintenance Metrics" />
                  <Tab label="Usage Trends" />
                  <Tab label="Station Distribution" />
                </Tabs>
              </Paper>
              
              {/* Tab Content Area - Scrollable */}
              <Box sx={{ overflowY: 'auto', height: '100%', pl: 1 }}>
                {/* Prediction Result Tab */}
                {activeTab === 0 && (
                  <Grid container spacing={2} sx={{ maxWidth: '100%', mx: 'auto', overflowX: 'auto' }}>
                    <Grid item xs={12}>
                      <StyledCard sx={{ minWidth: '1200px', width: '100%' }}>
                        <CardContent sx={{ px: { xs: 4, md: 6 } }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom>Prediction Result</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', py: 3, width: '100%', mx: 'auto' }}>
                            <Typography variant="h3" color="primary.main" fontWeight={700} sx={{ mb: 1 }}>
                              {predictedRentals !== null ? predictedRentals : '--'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Predicted Rentals</Typography>
                          </Box>
                          {futurePredictions.length > 0 && (
                            <Paper elevation={2} sx={{ p: 3, mt: 3, width: '100%', boxSizing: 'border-box' }}>
                              <Typography variant="subtitle1" fontWeight={500} gutterBottom>Next 7 Days Forecast</Typography>
                              <Box sx={{ height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={futurePredictions}>
                                    <defs>
                                      <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="prediction" stroke="#1976d2" fillOpacity={1} fill="url(#colorPrediction)" />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </Box>
                            </Paper>
                          )}
                          {/* Add radar chart for weather impact analysis */}
                          <Paper elevation={2} sx={{ p: 3, mt: 4, width: '100%', boxSizing: 'border-box' }}>
                            <Typography variant="subtitle1" fontWeight={500} gutterBottom>Weather Impact Analysis</Typography>
                            <Box sx={{ height: 350 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart outerRadius={90} data={[
                                  { factor: 'Temperature', value: temperature / 40 * 100 },
                                  { factor: 'Humidity', value: humidity },
                                  { factor: 'Wind Speed', value: windSpeed * 2 },
                                  { factor: 'Precipitation', value: precipitation * 2 },
                                  { factor: 'Season Impact', value: season * 25 }
                                ]}>
                                  <PolarGrid />
                                  <PolarAngleAxis dataKey="factor" />
                                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                  <Radar name="Weather Factors" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                </RadarChart>
                              </ResponsiveContainer>
                            </Box>
                          </Paper>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  </Grid>
                )}
                
                {/* Maintenance Metrics Tab */}
                {activeTab === 1 && (
                  <Grid container spacing={2} sx={{ maxWidth: '100%', mx: 'auto', overflowX: 'auto' }}>
                    <Grid item xs={12}>
                      <StyledCard sx={{ minWidth: '1200px', width: '100%' }}>
                        <CardContent sx={{ px: { xs: 4, md: 6 } }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom>Maintenance Metrics</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', my: 2 }}>
                            <Paper elevation={3} sx={{ p: 3, minWidth: 180, textAlign: 'center', bgcolor: '#e3f2fd', boxSizing: 'border-box' }}>
                              <Typography variant="h3" fontWeight={700} color="primary.main">{maintenance.dailyInspections}</Typography>
                              <Typography variant="subtitle1" color="text.secondary">Daily Inspections</Typography>
                            </Paper>
                            <Paper elevation={3} sx={{ p: 3, minWidth: 180, textAlign: 'center', bgcolor: '#e8f5e9', boxSizing: 'border-box' }}>
                              <Typography variant="h3" fontWeight={700} color="#2e7d32">{maintenance.weeklyMaintenance}</Typography>
                              <Typography variant="subtitle1" color="text.secondary">Weekly Maintenance</Typography>
                            </Paper>
                            <Paper elevation={3} sx={{ p: 3, minWidth: 180, textAlign: 'center', bgcolor: '#fff8e1', boxSizing: 'border-box' }}>
                              <Typography variant="h3" fontWeight={700} color="#ed6c02">{maintenance.monthlyOverhaul}</Typography>
                              <Typography variant="subtitle1" color="text.secondary">Monthly Overhaul</Typography>
                            </Paper>
                            <Paper elevation={3} sx={{ p: 3, minWidth: 180, textAlign: 'center', bgcolor: '#fce4ec', boxSizing: 'border-box' }}>
                              <Typography variant="h3" fontWeight={700} color="#d81b60">{maintenance.staffNeeded}</Typography>
                              <Typography variant="subtitle1" color="text.secondary">Staff Needed</Typography>
                            </Paper>
                          </Box>
                          <Box sx={{ mt: 4 }}>
                            <Typography variant="subtitle1" fontWeight={500} gutterBottom>Maintenance Resource Allocation</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: 'Daily Inspections', value: maintenance.dailyInspections },
                                    { name: 'Weekly Maintenance', value: maintenance.weeklyMaintenance },
                                    { name: 'Monthly Overhaul', value: maintenance.monthlyOverhaul },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={true}
                                  outerRadius={110}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  <Cell fill="#2196f3" />
                                  <Cell fill="#4caf50" />
                                  <Cell fill="#ff9800" />
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} tasks`, 'Quantity']} />
                              </PieChart>
                            </ResponsiveContainer>
                          </Box>
                          
                          {/* Worker and Vehicle Visualization */}
                          <Box sx={{ mt: 4 }}>
                            <Typography variant="subtitle1" fontWeight={500} gutterBottom>Workforce & Truck Visualization</Typography>
                            <Paper elevation={3} sx={{ p: 3, bgcolor: '#f5f5f5', boxSizing: 'border-box' }}>
                              <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" fontWeight={500} gutterBottom>
                                  Workers (👷 = 10 workers, max 1000)
                                </Typography>
                                <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, wordBreak: 'break-all', lineHeight: 1.5 }}>
                                  {maintenance.staffNeeded <= 1000 
                                    ? '👷'.repeat(Math.ceil(maintenance.staffNeeded / 10))
                                    : '👷'.repeat(100) + ` (Max display: 1000 workers, actual: ${maintenance.staffNeeded})`}
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  Total workers: {maintenance.staffNeeded}
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="body1" fontWeight={500} gutterBottom>
                                  Trucks (🚚 = 10 trucks, max 200)
                                </Typography>
                                {/* Calculate trucks: 1 truck per 5 workers */}
                                {(() => {
                                  const totalTrucks = Math.ceil(maintenance.staffNeeded / 5);
                                  return (
                                    <>
                                      <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, wordBreak: 'break-all', lineHeight: 1.5 }}>
                                        {totalTrucks <= 200 
                                          ? '🚚'.repeat(Math.ceil(totalTrucks / 10))
                                          : '🚚'.repeat(20) + ` (Max display: 200 trucks, actual: ${totalTrucks})`}
                                      </Box>
                                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Total trucks: {totalTrucks} (1 truck per 5 workers)
                                      </Typography>
                                    </>
                                  );
                                })()}
                              </Box>
                            </Paper>
                          </Box>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  </Grid>
                )}
                
                {/* Usage Trends Tab */}
                {activeTab === 2 && (
                  <Grid container spacing={2} sx={{ maxWidth: '100%', mx: 'auto', overflowX: 'auto' }}>
                    <Grid item xs={12}>
                      <StyledCard sx={{ minWidth: '1200px', width: '100%' }}>
                        <CardContent sx={{ px: { xs: 4, md: 6 } }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom>Usage Trends</Typography>
                          <Paper elevation={2} sx={{ p: 4, width: '100%', mb: 4, boxSizing: 'border-box' }}>
                            <Typography variant="subtitle1" fontWeight={500} gutterBottom>Usage Statistics</Typography>
                            <Box sx={{ height: 500 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={usageData} margin={{ left: 10, right: 30 }}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="month" />
                                  <YAxis />
                                  <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                                  <Legend layout="horizontal" verticalAlign="top" align="center" />
                                  <Bar dataKey="rentals" fill="#1976d2" name="Rentals" radius={[4, 4, 0, 0]} />
                                  <Bar dataKey="repairs" fill="#f44336" name="Repairs" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </Box>
                          </Paper>
                          
                          <Paper elevation={2} sx={{ p: 4, width: '100%', boxSizing: 'border-box' }}>
                            <Typography variant="subtitle1" fontWeight={500} gutterBottom>Monthly Trend Analysis</Typography>
                            <Box sx={{ height: 450 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={usageData} margin={{ left: 10, right: 30 }}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="month" />
                                  <YAxis yAxisId="left" orientation="left" stroke="#1976d2" />
                                  <YAxis yAxisId="right" orientation="right" stroke="#f44336" />
                                  <Tooltip />
                                  <Legend />
                                  <Line yAxisId="left" type="monotone" dataKey="rentals" stroke="#1976d2" activeDot={{ r: 8 }} strokeWidth={2} name="Rentals" />
                                  <Line yAxisId="right" type="monotone" dataKey="repairs" stroke="#f44336" strokeWidth={2} name="Repairs" />
                                </LineChart>
                              </ResponsiveContainer>
                            </Box>
                          </Paper>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  </Grid>
                )}
                
                {/* Station Distribution Tab */}
                {activeTab === 3 && (
                  <Grid container spacing={2} sx={{ mx: 'auto' }}>
                    {/* Small Left Card */}
                    <Grid item xs={12} md={3}>
                      <StyledCard>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={500} gutterBottom align="center">Station Status</Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            {stationData.map((station, index) => (
                              <Paper 
                                key={index} 
                                elevation={1} 
                                sx={{ 
                                  p: 2, 
                                  bgcolor: COLORS[index % COLORS.length] + '20',
                                  borderLeft: `4px solid ${COLORS[index % COLORS.length]}` 
                                }}
                              >
                                <Typography variant="body1" fontWeight={500}>{station.name}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                  <Typography variant="h6" fontWeight={700}>{station.value}</Typography>
                                  <Typography variant="body2" color="text.secondary">bikes</Typography>
                                </Box>
                              </Paper>
                            ))}
                          </Box>
                        </CardContent>
                      </StyledCard>
                    </Grid>

                    {/* Main Center Card */}
                    <Grid item xs={12} md={6}>
                      <StyledCard>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={500} gutterBottom align="center">Station Analysis</Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="subtitle2" fontWeight={500} gutterBottom align="center">Bike Distribution by Station</Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  flexDirection: 'column', 
                                  width: '100%',
                                  mt: 2
                                }}>
                                  {/* Table header */}
                                  <Box sx={{ 
                                    display: 'flex', 
                                    borderBottom: '2px solid #e0e0e0', 
                                    pb: 1, 
                                    mb: 1,
                                    fontWeight: 600
                                  }}>
                                    <Box sx={{ width: '30%' }}>Station</Box>
                                    <Box sx={{ width: '50%' }}>Bikes Available</Box>
                                    <Box sx={{ width: '20%', textAlign: 'right' }}>Count</Box>
                                  </Box>
                                  
                                  {/* Table rows */}
                                  {stationData.map((station, index) => (
                                    <Box 
                                      key={index} 
                                      sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        py: 1.5,
                                        borderBottom: '1px solid #f0f0f0'
                                      }}
                                    >
                                      <Box sx={{ width: '30%', fontWeight: 500 }}>
                                        <Box sx={{ 
                                          display: 'flex', 
                                          alignItems: 'center',
                                          gap: 1 
                                        }}>
                                          <Box 
                                            sx={{ 
                                              width: 12, 
                                              height: 12, 
                                              borderRadius: '50%', 
                                              bgcolor: COLORS[index % COLORS.length] 
                                            }} 
                                          />
                                          {station.name}
                                        </Box>
                                      </Box>
                                      <Box sx={{ width: '50%' }}>
                                        <Box sx={{ 
                                          bgcolor: '#f5f5f5', 
                                          height: 12, 
                                          borderRadius: 1,
                                          position: 'relative',
                                          overflow: 'hidden'
                                        }}>
                                          <Box sx={{ 
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            height: '100%',
                                            width: `${(station.value / Math.max(...stationData.map(s => s.value))) * 100}%`,
                                            bgcolor: COLORS[index % COLORS.length],
                                            borderRadius: 1
                                          }} />
                                        </Box>
                                      </Box>
                                      <Box sx={{ width: '20%', textAlign: 'right', fontWeight: 600 }}>
                                        {station.value}
                                      </Box>
                                    </Box>
                                  ))}
                                </Box>
                              </Paper>
                            </Grid>
                            <Grid item xs={12}>
                              <Paper elevation={2} sx={{ p: 3, mt: 1 }}>
                                <Typography variant="subtitle2" fontWeight={500} gutterBottom align="center">Percentage Distribution</Typography>
                                <Box sx={{ display: 'flex', height: 280 }}>
                                  <Box sx={{ width: '60%', height: '100%' }}>
                                    {/* Static chart rather than responsive container */}
                                    <PieChart width={400} height={280}>
                                      <Pie
                                        data={stationData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                      >
                                        {stationData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                      </Pie>
                                      <Tooltip formatter={(value) => [`${value} bikes`, 'Quantity']} />
                                    </PieChart>
                                  </Box>
                                  <Box sx={{ width: '40%' }}>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      flexDirection: 'column', 
                                      gap: 2,
                                      height: '100%',
                                      justifyContent: 'center' 
                                    }}>
                                      {stationData.map((station, index) => {
                                        const percentage = (station.value / stationData.reduce((sum, s) => sum + s.value, 0) * 100).toFixed(1);
                                        return (
                                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box 
                                              sx={{ 
                                                width: 16, 
                                                height: 16, 
                                                bgcolor: COLORS[index % COLORS.length],
                                                borderRadius: '4px'
                                              }} 
                                            />
                                            <Box sx={{ flex: 1 }}>
                                              <Typography variant="body2" fontWeight={500}>{station.name}</Typography>
                                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="caption" color="text.secondary">{station.value} bikes</Typography>
                                                <Typography variant="caption" fontWeight={600}>{percentage}%</Typography>
                                              </Box>
                                            </Box>
                                          </Box>
                                        );
                                      })}
                                    </Box>
                                  </Box>
                                </Box>
                              </Paper>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Grid>

                    {/* Small Right Card */}
                    <Grid item xs={12} md={3}>
                      <StyledCard>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={500} gutterBottom align="center">Capacity Utilization</Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                            {stationData.map((station, index) => {
                              // Calculate a random utilization percentage between 50% and 95%
                              const utilization = Math.floor(50 + Math.random() * 45);
                              return (
                                <Box key={index} sx={{ width: '100%' }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">{station.name}</Typography>
                                    <Typography variant="body2" fontWeight={500}>{utilization}%</Typography>
                                  </Box>
                                  <Box sx={{ 
                                    width: '100%', 
                                    height: 8, 
                                    bgcolor: '#e0e0e0', 
                                    borderRadius: 1,
                                    mt: 0.5,
                                    position: 'relative'
                                  }}>
                                    <Box sx={{ 
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      height: '100%',
                                      width: `${utilization}%`,
                                      bgcolor: COLORS[index % COLORS.length],
                                      borderRadius: 1
                                    }} />
                                  </Box>
                                </Box>
                              );
                            })}
                          </Box>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BikeRentalDashboard;
