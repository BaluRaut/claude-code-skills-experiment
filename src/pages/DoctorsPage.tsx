import { Card, List } from 'antd';
import { useDoctors } from '../hooks/useDoctors';

// DOC-3: list the available doctors.
export function DoctorsPage() {
  const doctors = useDoctors();
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
