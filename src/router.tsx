import { Navigate, Route, Routes } from 'react-router-dom';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { DoctorsPage } from './pages/DoctorsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/appointments" replace />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/appointments/new" element={<BookAppointmentPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="*" element={<Navigate to="/appointments" replace />} />
    </Routes>
  );
}
