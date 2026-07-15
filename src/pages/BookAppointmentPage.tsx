// DOC-4: booking form with validation. DOC-5: double-booking rejection surfaces
// as a field-level error here.
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { App, Button, Card, DatePicker, Form, Input, Select, Space, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import { useDoctors } from '../hooks/useStore';
import { bookAppointment, SlotConflictError } from '../data/appointments';
import { tokens } from '../theme/tokens';

interface BookingFormValues {
  patientName: string;
  doctorId: string;
  slot: Dayjs;
}

export function BookAppointmentPage() {
  const doctors = useDoctors();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetDoctorId = searchParams.get('doctorId') ?? undefined;
  const { message } = App.useApp();
  const [form] = Form.useForm<BookingFormValues>();
  const [saving, setSaving] = useState(false);

  const onFinish = (values: BookingFormValues) => {
    setSaving(true);
    try {
      bookAppointment({
        doctorId: values.doctorId,
        patientName: values.patientName.trim(),
        // DOC-4 AC-4: persist a serializable ISO string, not the picker object.
        slot: values.slot.toDate().toISOString(),
      });
      message.success('Appointment booked');
      // DOC-4 AC-3: return to the list where the new appointment is visible.
      navigate('/appointments');
    } catch (err) {
      if (err instanceof SlotConflictError) {
        // DOC-5 AC-1: clear, field-level conflict error.
        form.setFields([{ name: 'slot', errors: [err.message] }]);
      } else {
        message.error('Could not book the appointment');
      }
      setSaving(false);
    }
  };

  return (
    <Card>
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Book an appointment
        </Typography.Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
          initialValues={{ doctorId: presetDoctorId }}
          style={{ maxWidth: 480 }}
        >
          <Form.Item
            label="Patient name"
            name="patientName"
            rules={[{ required: true, whitespace: true, message: 'Please enter the patient name' }]}
          >
            <Input placeholder="e.g. Jamie Rivera" autoComplete="off" />
          </Form.Item>

          <Form.Item
            label="Doctor"
            name="doctorId"
            rules={[{ required: true, message: 'Please choose a doctor' }]}
          >
            <Select
              placeholder="Choose a doctor"
              options={doctors.map((d) => ({
                value: d.id,
                label: `${d.name} — ${d.specialty}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Date & time"
            name="slot"
            rules={[{ required: true, message: 'Please pick a date and time' }]}
          >
            <DatePicker
              showTime={{ format: 'HH:mm', minuteStep: 15 }}
              format="YYYY-MM-DD HH:mm"
              placeholder="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: tokens.space.md }}>
            <Space>
              {/* DOC-4 AC-5: disabled/busy while saving, no double-submit. */}
              <Button type="primary" htmlType="submit" loading={saving} disabled={saving}>
                Book appointment
              </Button>
              <Button onClick={() => navigate('/appointments')} disabled={saving}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
}
