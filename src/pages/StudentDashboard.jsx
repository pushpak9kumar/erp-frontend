import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function StudentDashboard() {
  const [grades, setGrades] = useState([]);
  const [cgpa, setCgpa] = useState('N/A');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('academic');

  const navigate = useNavigate();

  // Get stored values
  const name = localStorage.getItem('name');
  const rollNo = localStorage.getItem('rollNo');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if(!token || localStorage.getItem('role') !== 'student') {
        navigate('/');
        return;
    }

    async function fetchAcademicData() {
        try {
            const gradeResponse = await axios.get(
                `http://localhost:5000/api/grades/${rollNo}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setGrades(gradeResponse.data.grades);
            setCgpa(gradeResponse.data.cgpa);

            const noticeResponse = await axios.get(
                'http://localhost:5000/api/notices',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotices(noticeResponse.data.notices);
        } catch (err) {
            if(err.response && err.response.status === 401) {
                localStorage.clear();
                navigate('/');
            } else {
                setError('Failed to load academic data.');
            }
        } finally {
            setLoading(false);
        }
    }

    fetchAcademicData();
  }, []);

  function handleLogout() {
      localStorage.clear();
      navigate('/');
  }

  function downloadReport() {
    window.print();
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header no-print">
        <div>
          <h1>Welcome, {name}!</h1>
          <p>Student Portal | Roll No: {rollNo}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* NOTICES BANNER */}
      {notices.length > 0 && (
        <div className="no-print" style={{ background: '#fff9c4', padding: '1rem 2rem', borderRadius: '12px', color: '#827717', marginBottom: '2rem', borderLeft: '8px solid #ffeb3b' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>📢 Recent Announcements</h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {notices.map(n => (
              <li key={n.id} style={{ marginBottom: '0.5rem' }}>
                {n.message} <small style={{ color: '#aaa', marginLeft: '0.5rem' }}>({new Date(n.date).toLocaleDateString()})</small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="tabs no-print" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={`tab-btn ${activeTab === 'academic' ? 'active' : ''}`} onClick={() => setActiveTab('academic')}>Academics & Grades</button>
        <button className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>Attendance</button>
        <button className={`tab-btn ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => setActiveTab('fees')}>Fee Payment</button>
        <button className={`tab-btn ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => setActiveTab('timetable')}>Timetable</button>
      </div>

      {/* CONTENT SECTIONS */}
      
      {/* 1. ACADEMIC TAB (Live Data) */}
      {activeTab === 'academic' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ color: 'white' }}>Academic Performance</h2>
            <button className="login-btn green no-print" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={downloadReport}>
              Download Grade Report (PDF)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
            {/* CGPA Summary Card */}
            <div className="grades-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
              <h3 style={{ margin: 0, color: '#aaa', fontSize: '1.2rem' }}>Cumulative CGPA</h3>
              <h1 style={{ fontSize: '4rem', margin: '1rem 0', color: '#646cff' }}>{cgpa}</h1>
              <p style={{ margin: 0, color: '#aaa' }}>Out of 10.0</p>
            </div>

            {/* Grades Table */}
            <div className="grades-card">
              <h2>Course Grades (Semester 3)</h2>
              {loading && <div className="loading">Loading grades...</div>}
              {error && <div className="error-msg">{error}</div>}

              {!loading && !error && (
                <table>
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Credits</th>
                      <th>Marks</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g, index) => (
                      <tr key={index}>
                        <td>{g.course_code}</td>
                        <td>{g.course_name}</td>
                        <td>{g.credits}</td>
                        <td>{g.marks}</td>
                        <td><span className="grade-badge">{g.grade}</span></td>
                      </tr>
                    ))}
                    {grades.length === 0 && <tr><td colSpan="5" style={{textAlign:'center'}}>No grades found.</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. ATTENDANCE TAB (Mock Data Scaffold) */}
      {activeTab === 'attendance' && (
        <div className="grades-card">
          <h2>Attendance Overview</h2>
          <p style={{ color: '#aaa', marginBottom: '1rem' }}>Backend API integration pending (Lesson 9).</p>
          <table>
            <thead><tr><th>Course</th><th>Total Classes</th><th>Attended</th><th>Percentage</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Data Structures</td><td>40</td><td>38</td><td>95%</td><td><span className="grade-badge" style={{background: 'rgba(0,255,0,0.1)', color: '#4caf50'}}>Good</span></td></tr>
              <tr><td>Algorithms</td><td>42</td><td>30</td><td>71%</td><td><span className="grade-badge" style={{background: 'rgba(255,0,0,0.1)', color: '#f44336'}}>Warning</span></td></tr>
              <tr><td>Operating Systems</td><td>38</td><td>36</td><td>94%</td><td><span className="grade-badge" style={{background: 'rgba(0,255,0,0.1)', color: '#4caf50'}}>Good</span></td></tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 3. FEES TAB (Mock Data Scaffold) */}
      {activeTab === 'fees' && (
        <div className="grades-card">
          <h2>Fee Payment Status</h2>
          <p style={{ color: '#aaa', marginBottom: '1rem' }}>Financial module backend pending.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', border: '1px solid #333', borderRadius: '12px' }}>
              <h3>Current Semester Fees</h3>
              <h1 style={{ color: '#4caf50' }}>$2,450.00</h1>
              <span className="grade-badge" style={{background: 'rgba(0,255,0,0.1)', color: '#4caf50', marginTop: '1rem'}}>Status: PAID ✓</span>
            </div>
            <div style={{ padding: '1.5rem', border: '1px solid #333', borderRadius: '12px' }}>
              <h3>Next Payment Due</h3>
              <h1 style={{ color: '#f44336' }}>$2,450.00</h1>
              <p style={{ color: '#aaa' }}>Due on: January 15, 2025</p>
              <button className="login-btn" style={{ marginTop: '1rem' }}>Pay Now</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TIMETABLE TAB (Mock Data Scaffold) */}
      {activeTab === 'timetable' && (
        <div className="grades-card">
          <h2>Weekly Timetable</h2>
          <p style={{ color: '#aaa', marginBottom: '1rem' }}>Scheduling module backend pending.</p>
          <table>
            <thead><tr><th>Time</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th></tr></thead>
            <tbody>
              <tr><td>09:00 AM</td><td>Algorithms</td><td>-</td><td>Data Struct.</td><td>Operating Sys.</td><td>-</td></tr>
              <tr><td>11:00 AM</td><td>Data Struct.</td><td>Algorithms</td><td>-</td><td>Algorithms</td><td>Data Struct.</td></tr>
              <tr><td>02:00 PM</td><td>-</td><td>Operating Sys.</td><td>Algorithms Lab</td><td>-</td><td>Operating Sys.</td></tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default StudentDashboard;