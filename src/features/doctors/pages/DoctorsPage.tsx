// DOC-3: Doctors directory. Thin page (new-page): data from the hook, antd
// components, tokens for spacing — no localStorage, no logic.
import { List, Card, Empty, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useDoctors } from '../useDoctors';
import { tokens } from '../../../theme/tokens';

export function DoctorsPage() {
  const doctors = useDoctors();

  if (doctors.length === 0) {
    return (
      <Empty description="No doctors available" data-testid="doctors-empty" />
    );
  }

  return (
    <Card
      title="Doctors"
      data-testid="doctors-page"
      extra={<Link to="/appointments/new">Book appointment</Link>}
    >
      <List
        dataSource={doctors}
        data-testid="doctors-list"
        renderItem={(doctor) => (
          <List.Item data-testid="doctors-row" data-doctor-id={doctor.id}>
            <List.Item.Meta
              title={<Typography.Text strong>{doctor.name}</Typography.Text>}
              description={
                <Tag color={tokens.color.primary} data-testid="doctor-specialty">
                  {doctor.specialty}
                </Tag>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
