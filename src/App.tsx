import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { AppRoutes } from './router';
import { ErrorBoundary } from './components/ErrorBoundary';

const { Header, Content } = Layout;

const navItems = [
  { key: '/appointments', label: <Link to="/appointments">Appointments</Link> },
  { key: '/appointments/new', label: <Link to="/appointments/new">Book</Link> },
  { key: '/doctors', label: <Link to="/doctors">Doctors</Link> },
];

export function App() {
  const location = useLocation();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 600, marginRight: 24 }}>Doctor Appointments</span>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={navItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: 24, width: '100%', maxWidth: 960, margin: '0 auto' }}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Content>
    </Layout>
  );
}
