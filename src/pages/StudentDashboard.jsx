import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function StudentDashboard() {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    //get stored values
    const name = localStorage.getItem('name');
    const rollNo = localStorage.getItem('rollNo');
    const token = localStorage.getItem('token');

    // useEffect runs when component first loads
    useEffect(() => {
      
        // if not logged in redirect to login
        if(!token) {
            navigate('/');
            return;
        }

        //fetch grades from backend
        async function fetchGrades() {
            try {
                const response = await axios.get(
                    'https://localhost:5000/api/grades/${rollNo}',
                    {
                        headers: {
                            Authorization: 'Bearer ${tokenn}'
                        }
                    }
                );
                setGrades(response.data.grades);
            } catch (err) {
                if(err.response && err.message.status === 401) {
                    //token expired - send back to login
                    localStorage.clear();
                    navigate('/');
                } else {
                    setError('Failed to load grades.');
                }
            } finally {
                setLoading(false);
          }
        }

        fetchGrades();
    }, []); // empty array means run once on load

    function handleLogout() {
        localStorage.clear();
        navigate('/');
    }

    return (
        <div className="dashboard">

      <div className="dashboard-header">
        <div>
          <h1>Welcome, {name}!</h1>
          <p>Roll No: {rollNo}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="grades-card">
        <h2>My Grades</h2>

        {loading && <div className="loading">Loading grades...</div>}

        {error && <div className="error-msg" style={{margin:'1rem'}}>{error}</div>}

        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Credits</th>
                <th>Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g, index) => (
                <tr key={index}>
                  <td>{g.course_name}</td>
                  <td>{g.credits}</td>
                  <td>{g.marks}</td>
                  <td>
                    <span className="grade-badge">{g.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
    );

}

export default StudentDashboard;