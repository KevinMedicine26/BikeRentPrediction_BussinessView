// Mock data for the Bike Rental Prediction System

// Mock prediction result
export const mockPredictionResult = {
  prediction: 285,
  resources: {
    workers_needed: 6,
    maintenance_staff: 2,
    distribution: {
      'Central Park': 86,
      'Downtown': 71,
      'Riverside': 43,
      'City Center': 57,
      'University': 28
    }
  },
  input_parameters: {
    season: 2,
    month: 5,
    hour: 14,
    holiday: 0,
    weekday: 1,
    workingday: 1,
    weather: 1,
    temp: 25,
    humidity: 55,
    windspeed: 12
  },
  event_message: null
};

// Mock historical data
export const mockHistoricalData = Array.from({ length: 24 * 7 }, (_, i) => {
  const hour = i % 24;
  const dayOfWeek = Math.floor(i / 24);
  const isWeekend = dayOfWeek >= 5;
  const isBusinessHour = hour >= 8 && hour <= 18;
  const isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18);
  
  let baseRentals = 100;
  if (isWeekend) {
    baseRentals = isBusinessHour ? 200 : 80;
  } else {
    baseRentals = isPeakHour ? 350 : (isBusinessHour ? 180 : 50);
  }
  
  // Add some randomness
  const randomFactor = 0.8 + Math.random() * 0.4; // Random between 0.8 and 1.2
  const rentals = Math.floor(baseRentals * randomFactor);
  
  const date = new Date();
  date.setDate(date.getDate() - 7 + dayOfWeek);
  date.setHours(hour, 0, 0, 0);
  
  return {
    date: date.toISOString().split('T')[0],
    hour,
    rentals,
    timestamp: date.toISOString()
  };
});

// Mock worker data
export const mockWorkers = [
  { id: '1', name: 'John Doe', station: 'Central Park', shift: 'Morning', status: 'Active' },
  { id: '2', name: 'Jane Smith', station: 'Downtown', shift: 'Afternoon', status: 'Active' },
  { id: '3', name: 'Mike Johnson', station: 'Riverside', shift: 'Evening', status: 'On Leave' },
  { id: '4', name: 'Sarah Williams', station: 'City Center', shift: 'Morning', status: 'Active' },
  { id: '5', name: 'Robert Brown', station: 'University', shift: 'Afternoon', status: 'Active' }
];

// Mock bike data
export const mockBikes = [
  { id: '101', type: 'Electric', station: 'Central Park', status: 'Available', lastMaintenance: '2025-03-15' },
  { id: '102', type: 'Regular', station: 'Downtown', status: 'In Use', lastMaintenance: '2025-03-10' },
  { id: '103', type: 'Electric', station: 'Riverside', status: 'Maintenance', lastMaintenance: '2025-04-01' },
  { id: '104', type: 'Regular', station: 'Central Park', status: 'Available', lastMaintenance: '2025-03-20' },
  { id: '105', type: 'Electric', station: 'City Center', status: 'Available', lastMaintenance: '2025-03-25' },
  { id: '106', type: 'Regular', station: 'University', status: 'In Use', lastMaintenance: '2025-03-18' },
  { id: '107', type: 'Electric', station: 'Downtown', status: 'Available', lastMaintenance: '2025-03-22' },
  { id: '108', type: 'Regular', station: 'Riverside', status: 'Maintenance', lastMaintenance: '2025-04-05' }
];

// Weather parameter options for the prediction form
export const weatherOptions = {
  season: [
    { value: 1, label: 'Spring' },
    { value: 2, label: 'Summer' },
    { value: 3, label: 'Fall' },
    { value: 4, label: 'Winter' }
  ],
  holiday: [
    { value: 0, label: 'No' },
    { value: 1, label: 'Yes' }
  ],
  weekday: [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ],
  workingday: [
    { value: 0, label: 'No' },
    { value: 1, label: 'Yes' }
  ],
  weather: [
    { value: 1, label: 'Clear' },
    { value: 2, label: 'Mist/Cloudy' },
    { value: 3, label: 'Light Rain/Snow' },
    { value: 4, label: 'Heavy Rain/Snow/Fog' }
  ]
};
