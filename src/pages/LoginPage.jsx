import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function LoginPage() {

    //which tab to be selected
    const [activeTab, setActiveTab] = useState('student');

    //form fields
    const [rollNo, setRollNo] =  useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    //useNavigate lets us change pages programmatically
    const navigate = useNavigate();

   async function handleLogin() {
  setError('');

  if (!rollNo || !password) {
    setError('Please fill in all fields.');
    return;
  }

  setLoading(true);

  console.log('Attempting login with:', rollNo);  // add this
  console.log('Sending to:', 'http://localhost:5000/api/login');  // add this

  try {
    const response = await axios.post(
      'http://localhost:5000/api/login',
       { userId: rollNo, password, role: activeTab }
    );

    console.log('Response received:', response.data);  // add this

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('name',  response.data.name);
    localStorage.setItem('role',   response.data.role);
    localStorage.setItem('rollNo', rollNo);

    // redirect based on role
if (response.data.role === 'student') {
  navigate('/student/dashboard');
} else if (response.data.role === 'admin') {
  navigate('/admin/dashboard');
} else if (response.data.role === 'director') {
  navigate('/director/dashboard');
}


  } catch (err) {
    console.log('Full error:', err);           // add this
    console.log('Error type:', err.code);      // add this
    console.log('Error response:', err.response);  // add this

    if (err.response) {
      setError(err.response.data.error);
    } else if (err.code === 'ERR_NETWORK') {
      setError('Cannot connect to server. Is backend running?');
    } else if (err.code === 'ERR_CONNECTION_REFUSED') {
      setError('Backend refused connection. Check port 5000.');
    } else {
      setError('Cannot connect to server. Error: ' + err.code);
    }
  } finally {
    setLoading(false);
  }
}

    return (
        <div className="page">
      <div className="card">

        <div className="card-header">
          <h1>IIT ERP Portal</h1>
          <p>Academic Year 2025-26</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => setActiveTab('student')}
          >
            Student
          </button>
          <button
            className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin
          </button>
          <button
            className={`tab ${activeTab === 'director' ? 'active' : ''}`}
            onClick={() => setActiveTab('director')}
          >
            Director
          </button>
        </div>

        <div className="form">
          <label>Roll Number</label>
          <input
            type="text"
            placeholder="e.g. 21EE20212023"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="error-msg">{error}</div>}

          <button
            className={`login-btn ${activeTab === 'student' ? 'blue' : activeTab === 'admin' ? 'green' : 'purple'}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in...' : `Sign in as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </button>
        </div>

      </div>
    </div>
    );
}

export default LoginPage;