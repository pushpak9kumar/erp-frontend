import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function DirectorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const name  = localStorage.getItem('name');
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'director') {
      navigate('/');
      return;
    }

    async function fetchStats() {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/director/stats',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          navigate('/');
        } else {
          setError('Failed to load institute analytics.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  function handleLogout() {
    localStorage.clear();
    navigate('/');
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {name}!</h1>
          <p>Director — Institutional Overview</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="grades-card">
        <h2>Institute Analytics</h2>

        {loading && <div className="loading">Loading analytics...</div>}
        {error && <div className="error-msg" style={{margin:'1rem'}}>{error}</div>}

        {!loading && !error && stats && (
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Total Enrolled Students</td><td>{stats.totalStudents}</td></tr>
              <tr><td>Average Institute CGPA</td><td>{stats.averageCgpa}</td></tr>
              <tr><td>Placement Rate</td><td>{stats.placementRate}%</td></tr>
              <tr><td>Faculty Count</td><td>{stats.facultyCount}</td></tr>
              <tr><td>Active Courses</td><td>{stats.activeCourses}</td></tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DirectorDashboard;