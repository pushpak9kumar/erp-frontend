import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage          from './pages/LoginPage';
import StudentDashboard   from './pages/StudentDashboard';
import AdminDashboard     from './pages/AdminDashboard';
import DirectorDashboard  from './pages/DirectorDashboard';
import ProtectedRoute     from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
          path="/student/dashboard" 
          element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/dashboard" 
          element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/director/dashboard" 
          element={<ProtectedRoute allowedRole="director"><DirectorDashboard /></ProtectedRoute>} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;