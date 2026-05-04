import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the "Add Student" form
  const [newStudent, setNewStudent] = useState({
    rollNo: '', name: '', email: '', batch: '', department: '', cgpa: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addMessage, setAddMessage] = useState('');

  // State for the "Upload Grade" form
  const [newGrade, setNewGrade] = useState({
    studentId: '', courseId: '', marks: '', grade: '', semester: ''
  });
  const [gradeLoading, setGradeLoading] = useState(false);
  const [gradeMessage, setGradeMessage] = useState('');

  const navigate = useNavigate();
  const name   = localStorage.getItem('name');
  const token  = localStorage.getItem('token');
  const role   = localStorage.getItem('role');

  async function fetchData() {
    try {
      const studentResponse = await axios.get(
        'http://localhost:5000/api/admin/students',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(studentResponse.data.students);

      const courseResponse = await axios.get(
        'http://localhost:5000/api/admin/courses',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(courseResponse.data.courses);

    } catch (err) {
      if(err.response && err.response.status === 401) {
        localStorage.clear();
        navigate('/');
      } else if (err.response && err.response.status === 403) {
        setError('Access Denied. You do not have Admin privileges.');
      } else {
        setError('Failed to load dashboard data.');
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
    fetchData();
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
      fetchData(); // Refresh list
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

  async function handleUploadGrade(e) {
    e.preventDefault();
    setGradeLoading(true);
    setGradeMessage('');

    try {
      await axios.post(
        'http://localhost:5000/api/admin/grades',
        newGrade,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setGradeMessage('Grade uploaded successfully!');
      setNewGrade({ studentId: '', courseId: '', marks: '', grade: '', semester: '' });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setGradeMessage(`Error: ${err.response.data.error}`);
      } else {
        setGradeMessage('An unknown error occurred while uploading.');
      }
    } finally {
      setGradeLoading(false);
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
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* ADD STUDENT FORM */}
        <div className="grades-card">
          <h2>Add New Student</h2>
          <form className="form" onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div><label>Roll Number</label><input type="text" value={newStudent.rollNo} onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})} required /></div>
            <div><label>Full Name</label><input type="text" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} required /></div>
            <div><label>Email Address</label><input type="email" value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div><label>Batch</label><input type="number" value={newStudent.batch} onChange={(e) => setNewStudent({...newStudent, batch: e.target.value})} required /></div>
              <div><label>Dept</label><input type="text" value={newStudent.department} onChange={(e) => setNewStudent({...newStudent, department: e.target.value})} required /></div>
            </div>
            <div>
              <button type="submit" className="login-btn green" disabled={addLoading}>
                {addLoading ? 'Adding...' : 'Add Student'}
              </button>
              {addMessage && <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{addMessage}</p>}
            </div>
          </form>
        </div>

        {/* UPLOAD GRADE FORM */}
        <div className="grades-card">
          <h2>Upload Course Grade</h2>
          <form className="form" onSubmit={handleUploadGrade} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label>Select Student</label>
              <select value={newGrade.studentId} onChange={(e) => setNewGrade({...newGrade, studentId: e.target.value})} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', width: '100%', fontSize: '1rem'}}>
                <option value="">-- Choose a Student --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.roll_no} - {s.name}</option>)}
              </select>
            </div>
            <div>
              <label>Select Course</label>
              <select value={newGrade.courseId} onChange={(e) => setNewGrade({...newGrade, courseId: e.target.value})} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', width: '100%', fontSize: '1rem'}}>
                <option value="">-- Choose a Course --</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.course_code} - {c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem'}}>
              <div><label>Marks</label><input type="number" value={newGrade.marks} onChange={(e) => setNewGrade({...newGrade, marks: e.target.value})} required /></div>
              <div><label>Grade</label><input type="text" placeholder="e.g. A+" value={newGrade.grade} onChange={(e) => setNewGrade({...newGrade, grade: e.target.value})} required /></div>
              <div><label>Semester</label><input type="number" value={newGrade.semester} onChange={(e) => setNewGrade({...newGrade, semester: e.target.value})} required /></div>
            </div>
            <div>
              <button type="submit" className="login-btn purple" disabled={gradeLoading}>
                {gradeLoading ? 'Uploading...' : 'Upload Grade'}
              </button>
              {gradeMessage && <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{gradeMessage}</p>}
            </div>
          </form>
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className="grades-card">
        <h2>Registered Students</h2>
        {loading && <div className="loading">Loading dashboard...</div>}
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