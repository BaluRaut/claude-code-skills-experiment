// DOC-3: doctors directory listing.
import { Link } from 'react-router-dom';
import { Card, List, Tag, Typography } from 'antd';
import { useDoctors } from '../hooks/useStore';

export function DoctorsPage() {
  const doctors = useDoctors();

  return (
    <Card>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Doctors
      </Typography.Title>
      <List
        dataSource={doctors}
        rowKey={(d) => d.id}
        renderItem={(doctor) => (
          <List.Item
            actions={[
              <Link key="book" to={`/appointments/new?doctorId=${doctor.id}`}>
                Book
              </Link>,
            ]}
          >
            <List.Item.Meta
              title={doctor.name}
              description={<Tag color="blue">{doctor.specialty}</Tag>}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
