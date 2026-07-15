import { App, Button, Card, DatePicker, Form, Input, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '../hooks/useDoctors';
import { useAppointments } from '../hooks/useAppointments';
import { createAppointment } from '../data/appointments';
import { hasConflict } from '../lib/conflicts';
import type { NewAppointment } from '../types';

interface BookingForm {
  patientName: string;
  doctorId: string;
  slot: Dayjs;
}

// DOC-4 + DOC-5: book an appointment with validation and no double-booking.
export function BookAppointmentPage() {
  const navigate = useNavigate();
  const doctors = useDoctors();
  const appointments = useAppointments();
  const { message } = App.useApp();
  const [form] = Form.useForm<BookingForm>();

  const onFinish = (values: BookingForm) => {
    const input: NewAppointment = {
      patientName: values.patientName,
      doctorId: values.doctorId,
      slot: values.slot.toISOString(),
    };
    if (hasConflict(appointments, input)) {
      form.setFields([{ name: 'slot', errors: ['That slot is already booked for this doctor'] }]);
      return;
    }
    createAppointment(input);
    message.success('Appointment booked');
    navigate('/appointments');
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

        <Button type="primary" htmlType="submit" data-testid="book-submit">
          Book appointment
        </Button>
      </Form>
    </Card>
  );
}
