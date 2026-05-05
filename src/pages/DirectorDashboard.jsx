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
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div style={{ padding: '2rem', background: 'rgba(100, 108, 255, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ margin: 0, color: '#aaa' }}>Total Students</h3>
                <h1 style={{ fontSize: '3rem', margin: '0.5rem 0', color: '#646cff' }}>{stats.totalStudents}</h1>
              </div>
              <div style={{ padding: '2rem', background: 'rgba(255, 152, 0, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ margin: 0, color: '#aaa' }}>Active Courses</h3>
                <h1 style={{ fontSize: '3rem', margin: '0.5rem 0', color: '#ff9800' }}>{stats.activeCourses}</h1>
              </div>
              <div style={{ padding: '2rem', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ margin: 0, color: '#aaa' }}>Avg Institute CGPA</h3>
                <h1 style={{ fontSize: '3rem', margin: '0.5rem 0', color: '#4caf50' }}>{stats.averageCgpa}</h1>
              </div>
              <div style={{ padding: '2rem', background: 'rgba(156, 39, 176, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ margin: 0, color: '#aaa' }}>Placement Rate</h3>
                <h1 style={{ fontSize: '3rem', margin: '0.5rem 0', color: '#9c27b0' }}>{stats.placementRate}%</h1>
              </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <h2>Department Wise Report</h2>
              <table>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Students</th>
                    <th>Average CGPA</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.departmentStats && stats.departmentStats.map((dept, index) => (
                    <tr key={index}>
                      <td><span className="grade-badge">{dept.department}</span></td>
                      <td>{dept.student_count}</td>
                      <td>{parseFloat(dept.avg_cgpa).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DirectorDashboard;