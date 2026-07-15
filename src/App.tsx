import { useEffect } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { AppRoutes } from './router';
import { seedDoctors } from './data/doctors';
import { tokens } from './theme/tokens';

const { Header, Content } = Layout;

// DOC-7 AC-2: top-level navigation between the main screens.
const NAV_ITEMS = [
  { key: '/appointments', label: <Link to="/appointments">Appointments</Link> },
  { key: '/appointments/new', label: <Link to="/appointments/new">Book</Link> },
  { key: '/doctors', label: <Link to="/doctors">Doctors</Link> },
];

export function App() {
  // DOC-3 AC-1/AC-4: seed doctors once on startup (idempotent).
  useEffect(() => {
    seedDoctors();
  }, []);

  const { pathname } = useLocation();
  const selectedKey =
    NAV_ITEMS.map((i) => i.key).find((key) => pathname === key) ??
    (pathname.startsWith('/appointments/new') ? '/appointments/new' : '/appointments');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', gap: tokens.space.lg }}>
        <Typography.Title level={4} style={{ color: '#fff', margin: 0, whiteSpace: 'nowrap' }}>
          Doctor Appointments
        </Typography.Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={NAV_ITEMS}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: tokens.space.lg, width: '100%', maxWidth: 960, margin: '0 auto' }}>
        <AppRoutes />
      </Content>
    </Layout>
  );
}
