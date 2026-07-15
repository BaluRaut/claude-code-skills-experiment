import { Layout, Typography } from 'antd';
import { AppRoutes } from './router';
import { AppNav } from './components/AppNav';
import { tokens } from './theme/tokens';

const { Header, Content } = Layout;

export function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', gap: tokens.space.lg }}>
        <Typography.Title
          level={4}
          style={{ color: '#fff', margin: 0, whiteSpace: 'nowrap' }}
        >
          Doctor Appointments
        </Typography.Title>
        <AppNav />
      </Header>
      <Content style={{ padding: tokens.space.lg, width: '100%', maxWidth: 960, margin: '0 auto' }}>
        <AppRoutes />
      </Content>
    </Layout>
  );
}
