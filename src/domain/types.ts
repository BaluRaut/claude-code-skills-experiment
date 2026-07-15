// DOC-2 AC-1: typed domain entities.

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  /** ISO-8601 datetime string for the booked slot (DOC-4 AC-4). */
  slot: string;
  /** ISO-8601 datetime string of when the record was created (DOC-2 AC-4). */
  createdAt: string;
}
