# use_model.py
import pickle
import pandas as pd
import numpy as np

# 1. Load the saved model and components
with open('bike_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('bike_scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)
    
with open('feature_names.pkl', 'rb') as f:
    feature_names = pickle.load(f)

# 2. Function to make predictions
def predict_bike_rentals(input_data):
    """
    Make predictions for bike rentals
    
    Args:
        input_data: DataFrame with the same features used to train the model
    
    Returns:
        Predicted bike rental counts
    """
    # Ensure input has all required features
    input_features = input_data[feature_names]
    
    # Scale the features
    scaled_features = scaler.transform(input_features)
    
    # Make predictions
    predictions = model.predict(scaled_features)
    
    return predictions

# 3. Example: Create a sample input
# This should match your feature format exactly
sample_input = pd.DataFrame({
    'Hour': [8, 12, 18],  # Morning, Noon, Evening
    'Temperature(°C)': [15.2, 22.4, 18.7],
    'Humidity(%)': [65, 48, 72],
    'Wind speed (m/s)': [1.2, 2.1, 0.8],
    'Dew point temperature(°C)': [10.1, 12.3, 14.5],
    'Solar Radiation (MJ/m2)': [0.85, 1.2, 0.3],
    'Rainfall(mm)': [0, 0, 0.2],
    'Snowfall (cm)': [0, 0, 0],
    'Functioning Day': [1, 1, 1],
    'Year': [2018, 2018, 2018],
    'WeekDayEncoding': [2, 3, 5],  # Tuesday, Wednesday, Friday
    'IsHoliday': [0, 0, 0],
    'Seasons_Spring': [1, 1, 0],
    'Seasons_Summer': [0, 0, 1],
    'Seasons_Winter': [0, 0, 0],
    'Holiday_No Holiday': [1, 1, 1],
    'WeekDay_Monday': [0, 0, 0],
    'WeekDay_Saturday': [0, 0, 0],
    'WeekDay_Sunday': [0, 0, 0],
    'WeekDay_Thursday': [0, 0, 0], 
    'WeekDay_Tuesday': [1, 0, 0],
    'WeekDay_Wednesday': [0, 1, 0]
})

# 4. Make predictions
predictions = predict_bike_rentals(sample_input)

# 5. Display the results
for i, pred in enumerate(predictions):
    time_of_day = ["Morning (8 AM)", "Noon (12 PM)", "Evening (6 PM)"][i]
    print(f"{time_of_day}: Expected {pred:.0f} bike rentals")