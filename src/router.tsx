// Central route table for the doctor-appointment app.
import { Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { DoctorsPage } from './pages/DoctorsPage';

export function AppRoutes() {
  return (
    // DOC-7 AC-3: an error in any screen is caught here, not blanking the shell.
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/appointments" replace />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/appointments/new" element={<BookAppointmentPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="*" element={<Navigate to="/appointments" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
