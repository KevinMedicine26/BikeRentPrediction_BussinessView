# usage
run the application, you'll need to:

Start the backend Flask server first:
CopyInsert
cd api
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
Then start the React frontend in a separate terminal:
CopyInsert
cd frontend
npm install
npm start
The application will automatically open in your default browser at http://localhost:3000, and you can begin using all of its features as described in the usage guide.

Is there anything specific you'd like me to explain or demonstrate about the implementation?






# BikeRentPrediction

Prediction UI + backend + demo

## Project Overview

The Bike Rental Prediction System is a comprehensive application that predicts bicycle rental demand based on weather conditions, leveraging a pre-trained Random Forest model. The system provides resource management capabilities to optimize worker allocation and bike distribution based on predicted demand.

## Architecture

The application follows a classic client-server architecture:

- User Interface (Browser)
- React Frontend (localhost:3000)
- Python Flask API (localhost:5000)
- Pre-trained Random Forest Model (.pkl)

## Setup Instructions

### Prerequisites

- Node.js and npm (for frontend)
- Python 3.8+ (for backend)
- Web browser

### Backend Setup

1. Navigate to the api directory:

   ```bash
   cd api
   ```

2. Create a Python virtual environment (optional but recommended):

   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the Flask server:

   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open your browser and visit: [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Dashboard

The Dashboard is the central hub of the application, providing a comprehensive overview of the system's status:

1. **Summary Cards**: View key metrics at a glance, including current rental counts, worker status, and bike availability.
2. **Prediction Display**: After making a prediction, the Dashboard shows the expected rental demand and resource recommendations.
3. **Data Visualizations**: Multiple charts display historical trends, hourly patterns, and resource distributions.
4. **Real-time Updates**: The Dashboard automatically updates when new predictions are made.

### Making Predictions

The Prediction form allows you to forecast bike rental demand based on weather conditions:

1. Navigate to the "Make Prediction" tab.
2. Fill in the weather parameters:
   - Select season, month, and hour
   - Indicate if it's a holiday or working day
   - Choose the day of the week
   - Set weather conditions (clear, misty, rainy, etc.)
   - Input temperature, humidity, and wind speed
3. Click "Make Prediction" to generate a forecast.
4. The system will automatically calculate:
   - Expected number of rentals
   - Required worker allocation
   - Optimal bike distribution across stations

### Worker Management

The Worker Management interface helps you organize staff resources:

1. Navigate to the "Worker Management" tab.

2. **View Workers**: See a list of all workers with their assigned stations, shifts, and statuses.

3. **Add Workers**: Click "Add Worker" and fill in the required information.

4. **Edit Workers**: Click "Edit" next to any worker to update their information.

5. **Delete Workers**: Remove workers from the system as needed.

6. **Worker Distribution**: View worker allocation across different stations.

Best practices:

- Assign workers based on predicted demand
- Balance shifts to ensure adequate coverage
- Maintain at least one worker per station during operating hours

### Bike Management

The Bike Management interface helps track and distribute bikes across stations:

1. Navigate to the "Bike Management" tab.

2. **View Inventory**: See all bikes in the system with their locations and statuses.

3. **Add Bikes**: Click "Add Bike" to register new bikes in the system.

4. **Edit Bikes**: Update bike information including type, location, and maintenance status.

5. **Delete Bikes**: Remove bikes from the inventory as needed.

6. **Bike Distribution**: View bike allocation and availability across stations.

Best practices:

- Distribute bikes according to predicted demand
- Schedule regular maintenance for each bike
- Keep at least 20% of the fleet in reserve for unexpected demand

### Data Persistence

The application uses two types of storage:

1. **API Data**: Prediction model and historical data are accessed via the Flask API.

2. **Local Storage**: Worker and bike information is stored in the browser's localStorage, persisting between sessions.

Note: As this is a demonstration application, data is not synchronized between different browsers or devices. In a production environment, this would be replaced with a database backend.

## Troubleshooting

### API Connection Issues

If the frontend cannot connect to the backend API:

1. Ensure the Flask server is running at [http://localhost:5000](http://localhost:5000)

2. Check that CORS is properly enabled

3. Verify there are no network issues or firewall restrictions

The system will use mock data as a fallback if the API is unavailable.

### Model Loading Errors

If the model file cannot be loaded:

1. Ensure the model file exists at the specified path (api/model/random_forest_model.pkl)

2. Check that the model format is compatible with the current scikit-learn version

The system includes a fallback dummy model for demonstration purposes.

### Resource Management

If you encounter issues with worker or bike management:

1. Clear browser localStorage if data becomes corrupted

2. Restart both frontend and backend services

3. Ensure you have proper permissions for localStorage in your browser

## Project Structure

```plaintext
bike-rental-system/
├── frontend/                  # React frontend application
│   ├── public/                # Static files
│   ├── src/                   # Source code
│   │   ├── components/        # UI components
│   │   ├── services/          # API communication
│   │   ├── hooks/             # Custom React hooks
│   │   └── ...
│   └── ...
├── api/                       # Python Flask backend
│   ├── model/                 # ML model files
│   ├── app.py                 # Flask application
│   └── ...
└── ...
