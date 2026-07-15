// react-router-v6 skill: one central route table. You'll add routes here as
// you build — e.g. /appointments, /appointments/new, /doctors.
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Add feature routes here (see the new-page skill). */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
