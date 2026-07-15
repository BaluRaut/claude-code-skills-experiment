// DOC-6: appointments list + cancel + persistence.
// DOC-7 AC-1: designed empty state with a Book CTA.
// DOC-9: filter by doctor and date (combinable, clearable, distinct empty state).
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  App,
  Button,
  Card,
  DatePicker,
  Empty,
  List,
  Popconfirm,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import type { Dayjs } from 'dayjs';
import { useAppointments, useDoctors } from '../hooks/useStore';
import { cancelAppointment } from '../data/appointments';
import { formatSlot, isSameDay } from '../lib/datetime';
import { tokens } from '../theme/tokens';

export function AppointmentsPage() {
  const appointments = useAppointments();
  const doctors = useDoctors();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [doctorFilter, setDoctorFilter] = useState<string | undefined>();
  const [dateFilter, setDateFilter] = useState<Dayjs | null>(null);

  const doctorName = useMemo(() => {
    const map = new Map(doctors.map((d) => [d.id, d.name] as const));
    return (id: string) => map.get(id) ?? 'Unknown doctor';
  }, [doctors]);

  const hasFilter = doctorFilter !== undefined || dateFilter !== null;

  const filtered = useMemo(() => {
    return appointments.filter((appt) => {
      if (doctorFilter && appt.doctorId !== doctorFilter) return false;
      if (dateFilter && !isSameDay(appt.slot, dateFilter)) return false;
      return true;
    });
  }, [appointments, doctorFilter, dateFilter]);

  const clearFilters = () => {
    setDoctorFilter(undefined);
    setDateFilter(null);
  };

  const handleCancel = (id: string) => {
    cancelAppointment(id);
    message.success('Appointment cancelled');
  };

  // DOC-7 AC-1: no appointments at all → designed empty state with CTA.
  if (appointments.length === 0) {
    return (
      <Card>
        <Empty description="You have no appointments yet">
          <Button type="primary" onClick={() => navigate('/appointments/new')}>
            Book appointment
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Card>
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <Space
          style={{ width: '100%', justifyContent: 'space-between' }}
          wrap
          align="center"
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            Appointments
          </Typography.Title>
          <Link to="/appointments/new">
            <Button type="primary">Book appointment</Button>
          </Link>
        </Space>

        {/* DOC-9: combinable, clearable filters. */}
        <Space wrap size="small">
          <Select
            allowClear
            placeholder="Filter by doctor"
            style={{ minWidth: 220 }}
            value={doctorFilter}
            onChange={(value) => setDoctorFilter(value)}
            options={doctors.map((d) => ({ value: d.id, label: d.name }))}
          />
          <DatePicker
            placeholder="Filter by date"
            value={dateFilter}
            onChange={(value) => setDateFilter(value)}
          />
          {hasFilter && <Button onClick={clearFilters}>Clear filters</Button>}
        </Space>

        {filtered.length === 0 ? (
          // DOC-9 AC-4: filtered-to-nothing is distinct from "no appointments".
          <Empty description="No appointments match these filters">
            <Button onClick={clearFilters}>Clear filters</Button>
          </Empty>
        ) : (
          <List
            dataSource={filtered}
            rowKey={(appt) => appt.id}
            renderItem={(appt) => (
              <List.Item
                actions={[
                  <Popconfirm
                    key="cancel"
                    title="Cancel this appointment?"
                    okText="Yes, cancel"
                    cancelText="Keep"
                    onConfirm={() => handleCancel(appt.id)}
                  >
                    <Button danger type="text">
                      Cancel
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space size={tokens.space.sm}>
                      <span>{doctorName(appt.doctorId)}</span>
                      <Tag>{appt.patientName}</Tag>
                    </Space>
                  }
                  description={formatSlot(appt.slot)}
                />
              </List.Item>
            )}
          />
        )}
      </Space>
    </Card>
  );
}
