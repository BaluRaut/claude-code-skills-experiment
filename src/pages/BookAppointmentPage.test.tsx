import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/render';
import { BookAppointmentPage } from './BookAppointmentPage';

describe('BookAppointmentPage (DOC-4)', () => {
  it('blocks submit when required fields are empty and persists nothing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookAppointmentPage />);

    await user.click(screen.getByTestId('book-submit'));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(localStorage.getItem('appointments')).toBeNull();
  });
});
