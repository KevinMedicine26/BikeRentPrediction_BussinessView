import os
import json
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Constants
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model/random_forest_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'model/scaler.pkl')

# Load model and scaler
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("Model and scaler loaded successfully")
except FileNotFoundError:
    print("Warning: Model or scaler file not found. Using dummy model.")
    # Create a simple dummy model for testing
    class DummyModel:
        def predict(self, X):
            # Return a random value based on the input to simulate some responsiveness
            base = np.sum(X) % 100 + 100
            return [max(0, min(1000, base + np.random.randint(-20, 50)))]
    model = DummyModel()
    scaler = None

# Feature order for prediction input
FEATURE_ORDER = [
    'season', 'year', 'month', 'hour', 'holiday', 'weekday',
    'workingday', 'weather', 'temp', 'atemp', 'humidity', 'windspeed'
]

# Mock historical data for visualization
def generate_mock_historical_data(days=30):
    data = []
    start_date = pd.Timestamp.now() - pd.Timedelta(days=days)
    
    for i in range(days):
        current_date = start_date + pd.Timedelta(days=i)
        # Generate more realistic data with some patterns
        weekday_factor = 1.2 if current_date.dayofweek < 5 else 0.8  # Higher on weekdays
        hour_factors = []
        
        for hour in range(24):
            # Morning and evening peaks for weekdays
            if current_date.dayofweek < 5:  # Weekday
                if 7 <= hour <= 9:  # Morning peak
                    hour_factor = 1.5
                elif 16 <= hour <= 18:  # Evening peak
                    hour_factor = 1.7
                elif 22 <= hour <= 23 or 0 <= hour <= 5:  # Night low
                    hour_factor = 0.3
                else:
                    hour_factor = 1.0
            else:  # Weekend
                if 10 <= hour <= 17:  # Midday peak on weekends
                    hour_factor = 1.4
                elif 22 <= hour <= 23 or 0 <= hour <= 7:  # Night/morning low
                    hour_factor = 0.4
                else:
                    hour_factor = 0.9
            
            # Random factor for natural variation
            random_factor = np.random.uniform(0.8, 1.2)
            
            # Calculate rentals
            base_rentals = np.random.randint(100, 300)
            rentals = int(base_rentals * weekday_factor * hour_factor * random_factor)
            
            # Add weather influence
            temp = np.random.uniform(10, 30)  # Temperature in Celsius
            if temp < 15 or temp > 28:
                rentals = int(rentals * 0.7)  # Fewer rentals in extreme temperatures
            
            # Add hourly data point
            data.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'hour': hour,
                'rentals': rentals,
                'timestamp': (current_date + pd.Timedelta(hours=hour)).isoformat()
            })
    
    return data

# Mock historical data
HISTORICAL_DATA = generate_mock_historical_data()

# Mock data for workers and bikes
MOCK_WORKERS = [
    {'id': '1', 'name': 'John Doe', 'station': 'Central Park', 'shift': 'Morning', 'status': 'Active'},
    {'id': '2', 'name': 'Jane Smith', 'station': 'Downtown', 'shift': 'Afternoon', 'status': 'Active'},
    {'id': '3', 'name': 'Mike Johnson', 'station': 'Riverside', 'shift': 'Evening', 'status': 'On Leave'},
    {'id': '4', 'name': 'Sarah Williams', 'station': 'City Center', 'shift': 'Morning', 'status': 'Active'}
]

MOCK_BIKES = [
    {'id': '101', 'type': 'Electric', 'station': 'Central Park', 'status': 'Available', 'lastMaintenance': '2025-03-15'},
    {'id': '102', 'type': 'Regular', 'station': 'Downtown', 'status': 'In Use', 'lastMaintenance': '2025-03-10'},
    {'id': '103', 'type': 'Electric', 'station': 'Riverside', 'status': 'Maintenance', 'lastMaintenance': '2025-04-01'},
    {'id': '104', 'type': 'Regular', 'station': 'Central Park', 'status': 'Available', 'lastMaintenance': '2025-03-20'},
    {'id': '105', 'type': 'Electric', 'station': 'City Center', 'status': 'Available', 'lastMaintenance': '2025-03-25'}
]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'API is running'}), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    """Make a bike rental prediction based on weather parameters"""
    # Add a small delay to simulate network latency
    time.sleep(0.5)
    
    try:
        data = request.json
        
        # Validate input data
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['season', 'month', 'hour', 'holiday', 'weekday',
                          'workingday', 'weather', 'temp', 'humidity', 'windspeed']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create input features array
        input_features = []
        
        # Add current year
        data['year'] = 1  # Current year (could be dynamic)
        
        # Add apparent temperature if not provided (use actual temp as approximation)
        if 'atemp' not in data:
            data['atemp'] = data['temp'] * 0.9
        
        # Create input array with features in the correct order
        for feature in FEATURE_ORDER:
            if feature in data:
                input_features.append(data[feature])
            else:
                return jsonify({'error': f'Missing feature: {feature}'}), 400
        
        input_array = np.array([input_features])
        
        # Scale input if scaler is available
        if scaler is not None:
            input_array = scaler.transform(input_array)
        
        # Make prediction
        prediction = model.predict(input_array)[0]
        
        # Round to integer number of bikes
        prediction = max(0, int(prediction))
        
        # Calculate resource needs (example algorithm)
        workers_needed = max(1, int(prediction / 50))  # 1 worker per 50 bikes
        maintenance_staff = max(1, int(workers_needed / 3))  # 1 maintenance staff per 3 regular workers
        distribution = {
            'Central Park': int(prediction * 0.3),  # 30% to Central Park
            'Downtown': int(prediction * 0.25),    # 25% to Downtown
            'Riverside': int(prediction * 0.15),   # 15% to Riverside
            'City Center': int(prediction * 0.2),  # 20% to City Center
            'University': int(prediction * 0.1),   # 10% to University
        }
        
        # Small chance of unexpected event affecting prediction
        if np.random.random() < 0.1:  # 10% chance
            event_effect = np.random.uniform(0.8, 1.2)
            prediction = int(prediction * event_effect)
            event_message = "Weather forecast indicates possible changes that may affect demand."
        else:
            event_message = None
        
        # Create response object
        response = {
            'prediction': prediction,
            'resources': {
                'workers_needed': workers_needed,
                'maintenance_staff': maintenance_staff,
                'distribution': distribution,
            },
            'input_parameters': data,
            'event_message': event_message
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/historical', methods=['GET'])
def get_historical_data():
    """Return mock historical data for visualizations"""
    return jsonify(HISTORICAL_DATA), 200

@app.route('/api/workers', methods=['GET'])
def get_workers():
    """Return mock worker data"""
    return jsonify(MOCK_WORKERS), 200

@app.route('/api/bikes', methods=['GET'])
def get_bikes():
    """Return mock bike data"""
    return jsonify(MOCK_BIKES), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
