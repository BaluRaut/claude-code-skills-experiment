import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/render';
import { AppointmentsListPage } from './AppointmentsListPage';
import { appointmentRepo } from '../appointment.repo';
import { reloadDoctors } from '../../doctors/doctor.repo';

function seedDoctor(): string {
  const id = crypto.randomUUID();
  localStorage.setItem('doctors', JSON.stringify([{ id, name: 'Dr. Test', specialty: 'General' }]));
  reloadDoctors();
  return id;
}

describe('AppointmentsListPage (DOC-6 / DOC-7)', () => {
  it('shows an empty state with a book CTA when there are no appointments', () => {
    renderWithProviders(<AppointmentsListPage />);
    expect(screen.getByTestId('appointments-empty')).toBeInTheDocument();
    expect(screen.getByTestId('appointments-empty-book')).toBeInTheDocument();
  });

  it('lists appointments and cancels one', async () => {
    const user = userEvent.setup();
    const doctorId = seedDoctor();
    appointmentRepo.create({ doctorId, patientName: 'Sam', slot: '2026-08-01T10:00:00.000Z' });

    renderWithProviders(<AppointmentsListPage />);
    expect(screen.getByText('Dr. Test')).toBeInTheDocument();
    expect(screen.getByText('Sam')).toBeInTheDocument();

    await user.click(screen.getByTestId('appointment-cancel'));
    await waitFor(() => expect(screen.queryByText('Sam')).not.toBeInTheDocument());
  });
});
