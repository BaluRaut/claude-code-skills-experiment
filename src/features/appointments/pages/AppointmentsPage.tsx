// DOC-6 (list + cancel + persistence), DOC-7 (empty/error/theme), DOC-9
// (filters). Thin page (new-page): data from hooks, filtering via the pure
// filterAppointments fn, antd components, tokens for spacing.
import { useMemo, useState } from 'react';
import { App as AntApp, Button, Card, DatePicker, Empty, List, Popconfirm, Select, Space, Tag, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAppointments } from '../useAppointments';
import { appointmentRepo } from '../appointment.repo';
import { useDoctors } from '../../doctors/useDoctors';
import { filterAppointments, isFilterActive, type AppointmentFilter } from '../filter';
import { tokens } from '../../../theme/tokens';

function formatSlot(iso: string): string {
  return format(new Date(iso), 'EEE, MMM d yyyy · h:mm a');
}

export function AppointmentsPage() {
  const appointments = useAppointments();
  const doctors = useDoctors();
  const { message } = AntApp.useApp();

  const [doctorId, setDoctorId] = useState<string | undefined>(undefined);
  const [day, setDay] = useState<Dayjs | null>(null);

  const doctorNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of doctors) map.set(d.id, d.name);
    return map;
  }, [doctors]);

  const filter: AppointmentFilter = {
    doctorId,
    date: day ? day.format('YYYY-MM-DD') : undefined,
  };

  // Newest-first by booking time (DOC-6 AC-2), then apply filters (DOC-9).
  const visible = useMemo(() => {
    const sorted = [...appointments].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    return filterAppointments(sorted, filter);
  }, [appointments, filter.doctorId, filter.date]);

  const cancel = (id: string) => {
    appointmentRepo.remove(id);
    message.success('Appointment cancelled');
  };

  const clearFilters = () => {
    setDoctorId(undefined);
    setDay(null);
  };

  // DOC-7 AC-1: no appointments at all → designed empty state with a CTA.
  if (appointments.length === 0) {
    return (
      <Empty
        data-testid="appointments-empty"
        description="No appointments yet"
        style={{ padding: tokens.space.lg }}
      >
        <Link to="/appointments/new">
          <Button type="primary" data-testid="appointments-empty-cta">
            Book appointment
          </Button>
        </Link>
      </Empty>
    );
  }

  return (
    <Card
      title="Appointments"
      data-testid="appointments-page"
      extra={
        <Link to="/appointments/new">
          <Button type="primary" data-testid="appointments-book">
            Book appointment
          </Button>
        </Link>
      }
    >
      <Space wrap style={{ marginBottom: tokens.space.md }}>
        <Select
          allowClear
          placeholder="All doctors"
          data-testid="filter-doctor"
          style={{ minWidth: 200 }}
          value={doctorId}
          onChange={(value: string | undefined) => setDoctorId(value)}
          options={doctors.map((d) => ({ value: d.id, label: d.name }))}
        />
        <DatePicker
          placeholder="Any date"
          data-testid="filter-date"
          value={day}
          onChange={(value) => setDay(value)}
        />
        <Button
          data-testid="filter-clear"
          onClick={clearFilters}
          disabled={!isFilterActive(filter)}
        >
          Clear filters
        </Button>
      </Space>

      {/* DOC-9 AC-4: active filter with no matches → a DISTINCT empty state. */}
      {visible.length === 0 ? (
        <Empty
          data-testid="appointments-no-matches"
          description="No appointments match these filters"
        />
      ) : (
        <List
          dataSource={visible}
          data-testid="appointments-list"
          renderItem={(appt) => (
            <List.Item
              data-testid="appointments-row"
              data-appointment-id={appt.id}
              actions={[
                <Popconfirm
                  key="cancel"
                  title="Cancel this appointment?"
                  okText="Yes, cancel"
                  cancelText="Keep"
                  onConfirm={() => cancel(appt.id)}
                >
                  <Button danger data-testid="appointment-cancel">
                    Cancel
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Typography.Text strong data-testid="appointment-doctor">
                    {doctorNameById.get(appt.doctorId) ?? 'Unknown doctor'}
                  </Typography.Text>
                }
                description={
                  <Space direction="vertical" size={tokens.space.xs}>
                    <span data-testid="appointment-patient">{appt.patientName}</span>
                    <Tag color={tokens.color.primary} data-testid="appointment-slot">
                      {formatSlot(appt.slot)}
                    </Tag>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}
