// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import { isAuthenticated } from './utils/auth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Hanya bisa diakses jika sudah login */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated() ? <DashboardPage /> : <Navigate to="/login" replace />
        }
      />

      {/* Fallback jika route tidak ditemukan */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
