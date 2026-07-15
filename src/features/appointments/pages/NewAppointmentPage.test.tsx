// DOC-8 AC-3: the booking form. A conflicting slot shows the field error and
// does NOT persist; a valid booking persists exactly once. Drives the real
// antd Form through user-event (testing-library-react).
import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import { NewAppointmentPage } from './NewAppointmentPage';
import { appointmentRepo } from '../appointment.repo';
import { doctorRepo } from '../../doctors/doctor.repo';

// A local wall-clock slot; both the seeded conflict and the typed value use
// the SAME local time so their ISO strings match exactly.
const LOCAL_SLOT = new Date(2026, 7, 1, 9, 0, 0, 0); // Aug 1 2026, 09:00 local
const SLOT_ISO = LOCAL_SLOT.toISOString();
const SLOT_TYPED = '2026-08-01 09:00';

let doctorId: string;

beforeEach(() => {
  localStorage.clear();
  appointmentRepo.reset();
  doctorRepo.reset();
  doctorId = doctorRepo.create({ name: 'Dr. Test', specialty: 'General' }).id;
});

async function fillForm(patient: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Patient name'), patient);

  await user.click(screen.getByLabelText('Doctor'));
  await user.click(await screen.findByText('Dr. Test — General'));

  const dateInput = screen.getByLabelText('Date & time');
  await user.click(dateInput);
  await user.type(dateInput, SLOT_TYPED);
  await user.keyboard('{Enter}');

  await user.click(screen.getByTestId('booking-submit'));
  return user;
}

describe('NewAppointmentPage', () => {
  it('persists exactly one appointment on a valid booking (DOC-4 AC-3)', async () => {
    renderWithProviders(<NewAppointmentPage />);
    await fillForm('Alice');

    await waitFor(() => expect(appointmentRepo.list()).toHaveLength(1));
    const [saved] = appointmentRepo.list();
    expect(saved?.patientName).toBe('Alice');
    expect(saved?.doctorId).toBe(doctorId);
    expect(saved?.slot).toBe(SLOT_ISO);
  });

  it('rejects a conflicting slot with a field error and does not persist (DOC-5/DOC-8 AC-3)', async () => {
    appointmentRepo.create({ doctorId, patientName: 'Existing', slot: SLOT_ISO });

    renderWithProviders(<NewAppointmentPage />);
    await fillForm('Bob');

    expect(await screen.findByText('That slot is already booked')).toBeInTheDocument();
    expect(appointmentRepo.list()).toHaveLength(1); // the pre-existing one only
  });
});
