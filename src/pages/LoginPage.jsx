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
       setError(''); // clear previous error

       //validate fields
       if(!rollNo || !password) {
        setError('Please fill in all fields.');
        return;
       }

       setLoading(true);

       try {
        // calling real backend
        const response = await axios.post(
            'https://localhost:5000/api/login',
            { rollNo, password }
        );

        //save token and name in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('rollNo', rollNo);

        // go to dashboard
        navigate('/dashboard');
       } catch(err) {
        //axios puts server error in err.response.data
        if(err.response) {
            setError(err.response.data.error);
        } else {
            setError('Cannot connect to server.');
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