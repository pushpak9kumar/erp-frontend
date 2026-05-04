import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const name   = localStorage.getItem('name');
  const token  = localStorage.getItem('token');
  const role   = localStorage.getItem('role');

  useEffect(() => {
    // 1. Check if user is logged in and is an admin
    if (!token || role !== 'admin') {
      navigate('/');
      return;
    }

    // 2. Define a function to fetch all students from our new backend API
    async function fetchStudents() {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/admin/students',
          {
            headers: {
              Authorization: `Bearer ${token}` // This is how the backend knows who is asking!
            }
          }
        );
        // 3. Save the data into our component's state
        setStudents(response.data.students);
      } catch (err) {
        if(err.response && err.response.status === 401) {
          // Token expired or invalid
          localStorage.clear();
          navigate('/');
        } else if (err.response && err.response.status === 403) {
          setError('Access Denied. You do not have Admin privileges.');
        } else {
          setError('Failed to load students.');
        }
      } finally {
        // Stop the loading spinner regardless of success or failure
        setLoading(false);
      }
    }

    // 4. Actually call the function we just defined
    fetchStudents();
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
          <p>Admin Panel — Academic Affairs</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="grades-card">
        <h2>Registered Students</h2>

        {loading && <div className="loading">Loading students...</div>}

        {error && <div className="error-msg" style={{margin:'1rem'}}>{error}</div>}

        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Batch</th>
                <th>Department</th>
                <th>CGPA</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.roll_no}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.batch}</td>
                  <td>{student.department}</td>
                  <td>
                    <span className="grade-badge">{student.cgpa}</span>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center'}}>No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;