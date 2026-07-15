// zod-schemas skill: schema = type. Form values derive from the entity schema
// via .pick() (new-form) rather than a hand-mirrored interface.
import { z } from 'zod';

export const appointmentSchema = z.object({
  id: z.string().min(1),
  doctorId: z.string().min(1),
  patientName: z.string().min(1),
  // Stored as an ISO datetime string, never a raw picker object (DOC-4 AC-4).
  slot: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export type Appointment = z.infer<typeof appointmentSchema>;

// The payload the booking form submits; id + createdAt are generated on write.
export const newAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'Select a doctor'),
  patientName: z.string().min(1, 'Patient name is required'),
  slot: z.string().datetime({ message: 'Pick a date and time' }),
});

export type NewAppointment = z.infer<typeof newAppointmentSchema>;
