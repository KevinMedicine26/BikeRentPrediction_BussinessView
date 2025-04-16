import React, { useState } from 'react';
import BikeRentalSystem from './components/BikeRentalSystem';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="text-3xl font-bold mb-6">Bike Rental Prediction System</h1>
      </header>
      <main>
        <BikeRentalSystem />
      </main>
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>© 2025 Bike Rental Prediction System</p>
      </footer>
    </div>
  );
}

export default App;
