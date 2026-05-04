import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the "Add Student" form
  const [newStudent, setNewStudent] = useState({
    rollNo: '', name: '', email: '', batch: '', department: '', cgpa: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addMessage, setAddMessage] = useState('');

  const navigate = useNavigate();
  const name   = localStorage.getItem('name');
  const token  = localStorage.getItem('token');
  const role   = localStorage.getItem('role');

  async function fetchStudents() {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/admin/students',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(response.data.students);
    } catch (err) {
      if(err.response && err.response.status === 401) {
        localStorage.clear();
        navigate('/');
      } else if (err.response && err.response.status === 403) {
        setError('Access Denied. You do not have Admin privileges.');
      } else {
        setError('Failed to load students.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStudents();
  }, []);

  async function handleAddStudent(e) {
    e.preventDefault();
    setAddLoading(true);
    setAddMessage('');

    try {
      await axios.post(
        'http://localhost:5000/api/admin/students',
        newStudent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAddMessage('Student added successfully!');
      setNewStudent({ rollNo: '', name: '', email: '', batch: '', department: '', cgpa: '' });
      
      // Refresh the table!
      fetchStudents();
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setAddMessage(`Error: ${err.response.data.error}`);
      } else {
        setAddMessage('An unknown error occurred while adding.');
      }
    } finally {
      setAddLoading(false);
    }
  }

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

      <div className="grades-card" style={{ marginBottom: '2rem' }}>
        <h2>Add New Student</h2>
        <form className="form" onSubmit={handleAddStudent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <label>Roll Number</label>
            <input type="text" value={newStudent.rollNo} onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})} required />
          </div>
          <div>
            <label>Full Name</label>
            <input type="text" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} required />
          </div>
          <div>
            <label>Email Address</label>
            <input type="email" value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} required />
          </div>
          <div>
            <label>Batch Year</label>
            <input type="number" value={newStudent.batch} onChange={(e) => setNewStudent({...newStudent, batch: e.target.value})} required />
          </div>
          <div>
            <label>Department</label>
            <input type="text" placeholder="e.g. CS" value={newStudent.department} onChange={(e) => setNewStudent({...newStudent, department: e.target.value})} required />
          </div>
          <div>
            <label>Current CGPA</label>
            <input type="number" step="0.01" value={newStudent.cgpa} onChange={(e) => setNewStudent({...newStudent, cgpa: e.target.value})} />
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" className="login-btn green" disabled={addLoading}>
              {addLoading ? 'Adding...' : 'Add Student'}
            </button>
            {addMessage && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{addMessage}</p>}
          </div>
        </form>
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
                  <td><span className="grade-badge">{student.cgpa}</span></td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>No students found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;