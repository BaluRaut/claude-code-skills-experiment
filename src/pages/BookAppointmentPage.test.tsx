// DOC-8 AC-3: the booking form persists a valid booking once, and a conflicting
// slot shows a field-level error and does NOT persist.
import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../test/renderWithProviders';
import { BookAppointmentPage } from './BookAppointmentPage';
import { seedDoctors } from '../data/doctors';
import {
  appointmentsCollection,
  bookAppointment,
  listAppointments,
} from '../data/appointments';

const SLOT_INPUT = '2026-07-20 14:30';
const SLOT_ISO = new Date('2026-07-20T14:30').toISOString();

function renderForm() {
  return renderWithProviders(
    <Routes>
      <Route path="/appointments/new" element={<BookAppointmentPage />} />
      <Route path="/appointments" element={<div>Appointments list</div>} />
    </Routes>,
    { route: '/appointments/new' },
  );
}

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText('e.g. Jamie Rivera'), 'Jamie Rivera');

  // Doctor select.
  await user.click(screen.getByText('Choose a doctor'));
  const option = await screen.findByText(/Dr\. Avery Chen/);
  await user.click(option);

  // Date/time: type into the picker input and confirm.
  const dateInput = screen.getByPlaceholderText('YYYY-MM-DD HH:mm');
  await user.click(dateInput);
  await user.type(dateInput, SLOT_INPUT);
  // Commit the typed value without submitting the form (Enter would submit).
  await user.tab();
}

beforeEach(() => {
  localStorage.clear();
  appointmentsCollection.write([]);
  localStorage.clear();
  seedDoctors();
});

describe('BookAppointmentPage', () => {
  it('shows field errors and does not persist when required fields are empty (DOC-4 AC-2)', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderForm();

    await user.click(screen.getByRole('button', { name: /book appointment/i }));

    expect(await screen.findByText('Please enter the patient name')).toBeInTheDocument();
    expect(await screen.findByText('Please choose a doctor')).toBeInTheDocument();
    expect(await screen.findByText('Please pick a date and time')).toBeInTheDocument();
    expect(listAppointments()).toHaveLength(0);
  });

  it('persists a valid booking exactly once and navigates to the list (DOC-4 AC-3)', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderForm();

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /book appointment/i }));

    await waitFor(() => expect(screen.getByText('Appointments list')).toBeInTheDocument());

    const stored = listAppointments();
    expect(stored).toHaveLength(1);
    expect(stored[0]?.patientName).toBe('Jamie Rivera');
    expect(stored[0]?.doctorId).toBe('doc-avery');
    // DOC-4 AC-4: stored as an ISO string.
    expect(stored[0]?.slot).toBe(SLOT_ISO);
  });

  it('rejects a conflicting slot with a field error and does not persist (DOC-5 AC-1/AC-3)', async () => {
    // Pre-existing booking for the same doctor + slot.
    bookAppointment({ doctorId: 'doc-avery', patientName: 'Someone', slot: SLOT_ISO });
    expect(listAppointments()).toHaveLength(1);

    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderForm();

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /book appointment/i }));

    // Field-level conflict error appears...
    expect(await screen.findByText('That slot is already booked')).toBeInTheDocument();
    // ...still on the form (did not navigate)...
    expect(screen.queryByText('Appointments list')).not.toBeInTheDocument();
    // ...and nothing new was persisted.
    expect(listAppointments()).toHaveLength(1);
  });
});
