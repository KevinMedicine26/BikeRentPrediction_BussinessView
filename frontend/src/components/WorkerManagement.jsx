import React, { useState } from 'react';

const WorkerManagement = ({ workers, onAddWorker, onUpdateWorker, onDeleteWorker }) => {
  const [formData, setFormData] = useState({
    name: '',
    station: 'Central Park',
    shift: 'Morning',
    status: 'Active'
  });
  
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const stations = ['Central Park', 'Downtown', 'Riverside', 'City Center', 'University'];
  const shifts = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const statuses = ['Active', 'On Leave', 'Training', 'Terminated'];

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
      onUpdateWorker({ ...formData, id: editId });
      setEditMode(false);
      setEditId(null);
    } else {
      onAddWorker(formData);
    }
    
    // Reset form
    setFormData({
      name: '',
      station: 'Central Park',
      shift: 'Morning',
      status: 'Active'
    });
    setShowForm(false);
  };

  const handleEdit = (worker) => {
    setFormData({
      name: worker.name,
      station: worker.station,
      shift: worker.shift,
      status: worker.status
    });
    setEditMode(true);
    setEditId(worker.id);
    setShowForm(true);
  };

  const handleDelete = (workerId) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      onDeleteWorker(workerId);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      station: 'Central Park',
      shift: 'Morning',
      status: 'Active'
    });
    setEditMode(false);
    setEditId(null);
    setShowForm(false);
  };

  // Worker counts by station
  const stationCounts = workers.reduce((acc, worker) => {
    if (worker.status === 'Active') {
      acc[worker.station] = (acc[worker.station] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="worker-management">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Worker Management</h2>
        {!showForm && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add Worker
          </button>
        )}
      </div>

      {/* Worker Form */}
      {showForm && (
        <div className="card bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editMode ? 'Edit Worker' : 'Add New Worker'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Worker Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
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
                <label className="form-label" htmlFor="shift">Shift</label>
                <select 
                  id="shift"
                  name="shift"
                  className="form-control"
                  value={formData.shift}
                  onChange={handleInputChange}
                  required
                >
                  {shifts.map(shift => (
                    <option key={shift} value={shift}>
                      {shift}
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
            </div>

            <div className="mt-4 flex space-x-2">
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                {editMode ? 'Update Worker' : 'Add Worker'}
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

      {/* Workers Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {stations.map(station => (
          <div key={station} className="card bg-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-semibold">{station}</h3>
            <p className="text-3xl font-bold mt-2">
              {stationCounts[station] || 0}
            </p>
            <p className="text-sm text-gray-500">Active Workers</p>
          </div>
        ))}
      </div>

      {/* Workers Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Station</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.length > 0 ? (
              workers.map(worker => (
                <tr key={worker.id}>
                  <td>{worker.name}</td>
                  <td>{worker.station}</td>
                  <td>{worker.shift}</td>
                  <td>
                    <span className={`badge ${
                      worker.status === 'Active' ? 'badge-success' : 
                      worker.status === 'On Leave' ? 'badge-warning' :
                      worker.status === 'Training' ? 'badge-info' : 'badge-danger'
                    }`}>
                      {worker.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(worker)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(worker.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No workers found. Add some workers to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Guidance */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Worker Management Tips</h3>
        <ul className="list-disc pl-6">
          <li>Assign workers based on predicted demand for each station</li>
          <li>Balance shifts to ensure coverage during peak rental hours</li>
          <li>Maintain at least one worker per station during operating hours</li>
          <li>Consider having more workers during weekends and holidays</li>
        </ul>
      </div>
    </div>
  );
};

export default WorkerManagement;
