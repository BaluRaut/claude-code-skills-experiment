import { Layout, Typography } from 'antd';
import { AppRoutes } from './router';

const { Header, Content } = Layout;

export function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <Typography.Title level={3} style={{ color: '#fff', margin: 0, lineHeight: '64px' }}>
          Doctor Appointments
        </Typography.Title>
      </Header>
      <Content style={{ padding: 24, width: '100%', maxWidth: 960, margin: '0 auto' }}>
        <AppRoutes />
      </Content>
    </Layout>
  );
}
