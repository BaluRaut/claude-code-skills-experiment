// react-router-v6: one central route table. Each screen is wrapped in an
// ErrorBoundary so a render error in one page never blanks the whole app
// (DOC-7 AC-3).
import { Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppointmentsPage } from './features/appointments/pages/AppointmentsPage';
import { NewAppointmentPage } from './features/appointments/pages/NewAppointmentPage';
import { DoctorsPage } from './features/doctors/pages/DoctorsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/appointments" replace />} />
      <Route
        path="/appointments"
        element={
          <ErrorBoundary>
            <AppointmentsPage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/appointments/new"
        element={
          <ErrorBoundary>
            <NewAppointmentPage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/doctors"
        element={
          <ErrorBoundary>
            <DoctorsPage />
          </ErrorBoundary>
        }
      />
      <Route path="*" element={<Navigate to="/appointments" replace />} />
    </Routes>
  );
}
