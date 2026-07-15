// zod-schemas skill: entity schema is the source of truth; the form schema is
// derived with .pick (never re-declared).
import { z } from 'zod';

export const appointmentSchema = z.object({
  id: z.string().uuid(),
  doctorId: z.string().min(1),
  patientName: z.string().min(1),
  slot: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export type Appointment = z.infer<typeof appointmentSchema>;

export const newAppointmentSchema = appointmentSchema.pick({
  doctorId: true,
  patientName: true,
  slot: true,
});

export type NewAppointment = z.infer<typeof newAppointmentSchema>;
