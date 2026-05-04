import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage          from './pages/LoginPage';
import StudentDashboard   from './pages/StudentDashboard';
import AdminDashboard     from './pages/AdminDashboard';
import DirectorDashboard  from './pages/DirectorDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                   element={<LoginPage />} />
        <Route path="/student/dashboard"  element={<StudentDashboard />} />
        <Route path="/admin/dashboard"    element={<AdminDashboard />} />
        <Route path="/director/dashboard" element={<DirectorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;