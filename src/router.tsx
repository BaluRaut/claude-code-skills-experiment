// react-router-v6 skill: one central route table, redirect from root, 404.
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppointmentsListPage } from './features/appointments/pages/AppointmentsListPage';
import { BookAppointmentPage } from './features/appointments/pages/BookAppointmentPage';
import { DoctorsPage } from './features/doctors/DoctorsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/appointments" replace />} />
      <Route path="/appointments" element={<AppointmentsListPage />} />
      <Route path="/appointments/new" element={<BookAppointmentPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="*" element={<Navigate to="/appointments" replace />} />
    </Routes>
  );
}
