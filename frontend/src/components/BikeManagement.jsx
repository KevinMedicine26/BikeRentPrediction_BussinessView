import React, { useState } from 'react';

const BikeManagement = ({ bikes, onAddBike, onUpdateBike, onDeleteBike }) => {
  const [formData, setFormData] = useState({
    type: 'Regular',
    station: 'Central Park',
    status: 'Available',
    lastMaintenance: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  });
  
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const bikeTypes = ['Regular', 'Electric'];
  const stations = ['Central Park', 'Downtown', 'Riverside', 'City Center', 'University'];
  const statuses = ['Available', 'In Use', 'Maintenance'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editMode) {
      onUpdateBike({ ...formData, id: editId });
      setEditMode(false);
      setEditId(null);
    } else {
      onAddBike(formData);
    }
    
    // Reset form
    setFormData({
      type: 'Regular',
      station: 'Central Park',
      status: 'Available',
      lastMaintenance: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  const handleEdit = (bike) => {
    setFormData({
      type: bike.type,
      station: bike.station,
      status: bike.status,
      lastMaintenance: bike.lastMaintenance
    });
    setEditMode(true);
    setEditId(bike.id);
    setShowForm(true);
  };

  const handleDelete = (bikeId) => {
    if (window.confirm('Are you sure you want to delete this bike?')) {
      onDeleteBike(bikeId);
    }
  };

  const handleCancel = () => {
    setFormData({
      type: 'Regular',
      station: 'Central Park',
      status: 'Available',
      lastMaintenance: new Date().toISOString().split('T')[0]
    });
    setEditMode(false);
    setEditId(null);
    setShowForm(false);
  };

  // Bike counts by station
  const stationCounts = bikes.reduce((acc, bike) => {
    if (bike.status === 'Available') {
      acc[bike.station] = (acc[bike.station] || 0) + 1;
    }
    return acc;
  }, {});

  // Bike types counts
  const typeCounts = bikes.reduce((acc, bike) => {
    acc[bike.type] = (acc[bike.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bike-management">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Bike Management</h2>
        {!showForm && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add Bike
          </button>
        )}
      </div>

      {/* Bike Form */}
      {showForm && (
        <div className="card bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editMode ? 'Edit Bike' : 'Add New Bike'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="type">Bike Type</label>
                <select 
                  id="type"
                  name="type"
                  className="form-control"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  {bikeTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="station">Station</label>
                <select 
                  id="station"
                  name="station"
                  className="form-control"
                  value={formData.station}
                  onChange={handleInputChange}
                  required
                >
                  {stations.map(station => (
                    <option key={station} value={station}>
                      {station}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="status">Status</label>
                <select 
                  id="status"
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lastMaintenance">Last Maintenance Date</label>
                <input 
                  type="date" 
                  id="lastMaintenance"
                  name="lastMaintenance"
                  className="form-control"
                  value={formData.lastMaintenance}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                {editMode ? 'Update Bike' : 'Add Bike'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bike Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Bikes by Type</h3>
          <div className="flex flex-wrap">
            {bikeTypes.map(type => (
              <div key={type} className="w-1/2 p-2">
                <div className="text-center p-3 bg-gray-100 rounded">
                  <p className="font-semibold">{type}</p>
                  <p className="text-2xl font-bold">{typeCounts[type] || 0}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Available Bikes by Station</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {stations.map(station => (
              <div key={station} className="text-center p-2 bg-gray-100 rounded">
                <p className="font-semibold text-sm">{station}</p>
                <p className="text-xl font-bold">{stationCounts[station] || 0}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bikes Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Station</th>
              <th>Status</th>
              <th>Last Maintenance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bikes.length > 0 ? (
              bikes.map(bike => (
                <tr key={bike.id}>
                  <td>{bike.id}</td>
                  <td>{bike.type}</td>
                  <td>{bike.station}</td>
                  <td>
                    <span className={`badge ${
                      bike.status === 'Available' ? 'badge-success' : 
                      bike.status === 'In Use' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {bike.status}
                    </span>
                  </td>
                  <td>{bike.lastMaintenance}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(bike)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(bike.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No bikes found. Add some bikes to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Guidance */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Bike Management Tips</h3>
        <ul className="list-disc pl-6">
          <li>Distribute bikes according to predicted demand at each station</li>
          <li>Schedule regular maintenance every 3 months for each bike</li>
          <li>Electric bikes require more frequent maintenance than regular bikes</li>
          <li>Keep at least 20% of the fleet in reserve for unexpected demand increases</li>
          <li>Move bikes between stations based on real-time demand patterns</li>
        </ul>
      </div>
    </div>
  );
};

export default BikeManagement;
