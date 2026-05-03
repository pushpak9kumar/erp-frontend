import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<LoginPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;