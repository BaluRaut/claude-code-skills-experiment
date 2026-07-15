// new-form skill: antd Form for UX validation + zod schema as the payload
// guard, a pure conflict check, submit busy-state, testids. No business logic
// baked into the JSX handler beyond wiring.
import { useState } from 'react';
import { App, Button, Card, DatePicker, Form, Input, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '../../doctors/useDoctors';
import { useAppointments } from '../useAppointments';
import { appointmentRepo } from '../appointment.repo';
import { newAppointmentSchema } from '../appointment.schema';
import { hasConflict } from '../conflicts';

interface BookingForm {
  patientName: string;
  doctorId: string;
  slot: Dayjs;
}

export function BookAppointmentPage() {
  const navigate = useNavigate();
  const doctors = useDoctors();
  const appointments = useAppointments();
  const { message } = App.useApp();
  const [form] = Form.useForm<BookingForm>();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = (values: BookingForm) => {
    setSubmitting(true);
    try {
      // zod is the boundary guard even though antd rules validated the UX.
      const parsed = newAppointmentSchema.safeParse({
        patientName: values.patientName,
        doctorId: values.doctorId,
        slot: values.slot.toISOString(),
      });
      if (!parsed.success) return;

      if (hasConflict(appointments, parsed.data)) {
        form.setFields([{ name: 'slot', errors: ['That slot is already booked for this doctor'] }]);
        return;
      }

      appointmentRepo.create(parsed.data);
      message.success('Appointment booked');
      navigate('/appointments');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Book an appointment">
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 480 }}>
        <Form.Item
          name="patientName"
          label="Patient name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input data-testid="patient-name" />
        </Form.Item>

        <Form.Item name="doctorId" label="Doctor" rules={[{ required: true, message: 'Select a doctor' }]}>
          <Select
            data-testid="doctor-select"
            placeholder="Choose a doctor"
            options={doctors.map((d) => ({ value: d.id, label: `${d.name} — ${d.specialty}` }))}
          />
        </Form.Item>

        <Form.Item name="slot" label="Date & time" rules={[{ required: true, message: 'Pick a slot' }]}>
          <DatePicker showTime data-testid="slot-picker" style={{ width: '100%' }} />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={submitting} data-testid="book-submit">
          Book appointment
        </Button>
      </Form>
    </Card>
  );
}
