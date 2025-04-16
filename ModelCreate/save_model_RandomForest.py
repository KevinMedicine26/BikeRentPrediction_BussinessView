# save_model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
import pickle

# 1. Load your data
df = pd.read_csv('data/SeoulBikeData.csv', encoding='cp1252')

# 2. Perform the same preprocessing as in your notebook
df['Date'] = pd.to_datetime(df['Date'])
df['Year'] = df['Date'].dt.year
df['Month'] = df['Date'].dt.month
df['Day'] = df['Date'].dt.day
df['WeekDay'] = df['Date'].dt.day_name()
df['WeekDayEncoding'] = df['WeekDay'].map({'Monday':1,'Tuesday':2,'Wednesday':3,'Thursday':4,'Friday':5,'Saturday':6,'Sunday':7})
df['Functioning Day'] = df['Functioning Day'].map({'Yes':1,'No':0})
df['IsHoliday'] = df['Holiday'].map({'No Holiday':0,'Holiday':1})

# Drop Date column and filter functioning days
df.drop(['Date'], axis=1, inplace=True)
df = df[df['Functioning Day'] != 0]

# One-hot encode categorical features
df = pd.get_dummies(df, drop_first=True)

# 3. Define features and target
X = df.drop(['Rented Bike Count'], axis=1)
y = df['Rented Bike Count']

# 4. Use the same selected features from your analysis
selected_features = ['Hour', 'Temperature(°C)', 'Humidity(%)', 'Wind speed (m/s)', 
                     'Dew point temperature(°C)', 'Solar Radiation (MJ/m2)', 
                     'Rainfall(mm)', 'Snowfall (cm)', 'Functioning Day', 'Year', 
                     'WeekDayEncoding', 'IsHoliday', 'Seasons_Spring', 'Seasons_Summer', 
                     'Seasons_Winter', 'Holiday_No Holiday', 'WeekDay_Monday', 
                     'WeekDay_Saturday', 'WeekDay_Sunday', 'WeekDay_Thursday', 
                     'WeekDay_Tuesday', 'WeekDay_Wednesday']

X = X[selected_features]

# 5. Split and scale the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
scaler = MinMaxScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 6. Train the model with your best parameters
rf_model = RandomForestRegressor(
    n_jobs=-1,
    n_estimators=500,
    min_samples_leaf=2,
    random_state=0
)
rf_model.fit(X_train_scaled, y_train)

# 7. Save the model and the scaler
with open('bike_model.pkl', 'wb') as f:
    pickle.dump(rf_model, f)

with open('bike_scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
    
with open('feature_names.pkl', 'wb') as f:
    pickle.dump(selected_features, f)

print("Model and preprocessing components saved!")