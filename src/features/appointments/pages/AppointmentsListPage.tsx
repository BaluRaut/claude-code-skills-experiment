// new-page skill: the four states (empty / no-match / content), thin page,
// data from hooks, testids on interactive + assertion targets.
// DOC-6 (list+cancel), DOC-7 (empty), DOC-9 (filters).
import { useMemo, useState } from 'react';
import { App, Button, Card, DatePicker, Empty, List, Select, Space, Typography } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { Link } from 'react-router-dom';
import { useAppointments } from '../useAppointments';
import { useDoctors } from '../../doctors/useDoctors';
import { appointmentRepo } from '../appointment.repo';
import { formatSlot } from '../../../lib/dates';

export function AppointmentsListPage() {
  const appointments = useAppointments();
  const doctors = useDoctors();
  const { message } = App.useApp();
  const [doctorFilter, setDoctorFilter] = useState<string | undefined>(undefined);
  const [dateFilter, setDateFilter] = useState<Dayjs | null>(null);

  const doctorName = useMemo(() => {
    const map = new Map(doctors.map((d) => [d.id, d.name]));
    return (id: string) => map.get(id) ?? 'Unknown doctor';
  }, [doctors]);

  const filtered = appointments.filter((a) => {
    if (doctorFilter && a.doctorId !== doctorFilter) return false;
    if (dateFilter && !dayjs(a.slot).isSame(dateFilter, 'day')) return false;
    return true;
  });

  if (appointments.length === 0) {
    return (
      <Empty data-testid="appointments-empty" description="No appointments yet">
        <Link to="/appointments/new">
          <Button type="primary" data-testid="appointments-empty-book">
            Book appointment
          </Button>
        </Link>
      </Empty>
    );
  }

  const filtersActive = doctorFilter !== undefined || dateFilter !== null;

  return (
    <Card
      title="Appointments"
      extra={
        <Link to="/appointments/new">
          <Button type="primary" data-testid="appointments-book">
            Book
          </Button>
        </Link>
      }
    >
      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          allowClear
          placeholder="Filter by doctor"
          style={{ width: 220 }}
          data-testid="filter-doctor"
          value={doctorFilter}
          onChange={(value) => setDoctorFilter(value)}
          options={doctors.map((d) => ({ value: d.id, label: d.name }))}
        />
        <DatePicker
          placeholder="Filter by date"
          data-testid="filter-date"
          value={dateFilter}
          onChange={(value) => setDateFilter(value)}
        />
        {filtersActive && (
          <Button
            data-testid="filter-clear"
            onClick={() => {
              setDoctorFilter(undefined);
              setDateFilter(null);
            }}
          >
            Clear
          </Button>
        )}
      </Space>

      {filtered.length === 0 ? (
        <Empty data-testid="appointments-no-match" description="No appointments match your filters" />
      ) : (
        <List
          dataSource={filtered}
          rowKey="id"
          data-testid="appointments-list"
          renderItem={(appointment) => (
            <List.Item
              data-testid="appointment-row"
              actions={[
                <Button
                  key="cancel"
                  danger
                  data-testid="appointment-cancel"
                  onClick={() => {
                    appointmentRepo.remove(appointment.id);
                    message.success('Appointment canceled');
                  }}
                >
                  Cancel
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={doctorName(appointment.doctorId)}
                description={
                  <span>
                    <Typography.Text strong>{appointment.patientName}</Typography.Text>
                    {' · '}
                    {formatSlot(appointment.slot)}
                  </span>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}
