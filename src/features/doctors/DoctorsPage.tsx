// new-page skill: thin page. Empty state handled; data from the hook.
import { Card, Empty, List } from 'antd';
import { useDoctors } from './useDoctors';

export function DoctorsPage() {
  const doctors = useDoctors();

  if (doctors.length === 0) {
    return <Empty data-testid="doctors-empty" description="No doctors available" />;
  }

  return (
    <Card title="Doctors" data-testid="doctors-page">
      <List
        dataSource={doctors}
        rowKey="id"
        renderItem={(doctor) => (
          <List.Item data-testid="doctor-row">
            <List.Item.Meta title={doctor.name} description={doctor.specialty} />
          </List.Item>
        )}
      />
    </Card>
  );
}
