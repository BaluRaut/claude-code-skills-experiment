// DOC-4 + DOC-5: booking form. new-form skill: antd Form for UX + zod as the
// payload guard; the DATA LAYER owns the double-booking invariant and throws,
// the form only translates that domain error into a field error.
import { useState } from 'react';
import { App as AntApp, Button, Card, DatePicker, Form, Input, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '../../doctors/useDoctors';
import { bookAppointment } from '../appointment.repo';
import { newAppointmentSchema } from '../appointment.schema';
import { SlotConflictError } from '../conflict';

interface BookingFormValues {
  patientName: string;
  doctorId: string;
  slot: Dayjs;
}

export function NewAppointmentPage() {
  const [form] = Form.useForm<BookingFormValues>();
  const doctors = useDoctors();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [saving, setSaving] = useState(false);

  const onFinish = (values: BookingFormValues) => {
    // zod is the final payload guard; dayjs → ISO string for storage (DOC-4 AC-4).
    const parsed = newAppointmentSchema.safeParse({
      doctorId: values.doctorId,
      patientName: values.patientName.trim(),
      slot: values.slot ? values.slot.toISOString() : undefined,
    });
    if (!parsed.success) return; // antd rules normally catch this first

    setSaving(true);
    try {
      bookAppointment(parsed.data);
      message.success('Appointment booked');
      navigate('/appointments');
    } catch (err) {
      if (err instanceof SlotConflictError) {
        form.setFields([{ name: 'slot', errors: [err.message] }]);
      } else {
        message.error('Could not book the appointment.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Book an appointment" data-testid="booking-page">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Form.Item
          name="patientName"
          label="Patient name"
          rules={[{ required: true, whitespace: true, message: 'Patient name is required' }]}
        >
          <Input data-testid="booking-patient" placeholder="Full name" />
        </Form.Item>

        <Form.Item
          name="doctorId"
          label="Doctor"
          rules={[{ required: true, message: 'Select a doctor' }]}
        >
          <Select
            data-testid="booking-doctor"
            placeholder="Select a doctor"
            options={doctors.map((d) => ({
              value: d.id,
              label: `${d.name} — ${d.specialty}`,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="slot"
          label="Date & time"
          rules={[{ required: true, message: 'Pick a date and time' }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            data-testid="booking-slot"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={saving}
          disabled={saving}
          data-testid="booking-submit"
        >
          Book appointment
        </Button>
      </Form>
    </Card>
  );
}
