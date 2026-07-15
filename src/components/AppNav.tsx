// DOC-7 AC-2: navigation lets the user move between screens without editing
// the URL. antd Menu wired to react-router (antd skill: components, not raw CSS).
import { useMemo } from 'react';
import { Menu } from 'antd';
import { CalendarOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const ITEMS = [
  { key: '/appointments', icon: <CalendarOutlined />, label: <Link to="/appointments">Appointments</Link> },
  { key: '/appointments/new', icon: <PlusOutlined />, label: <Link to="/appointments/new">Book</Link> },
  { key: '/doctors', icon: <TeamOutlined />, label: <Link to="/doctors">Doctors</Link> },
];

export function AppNav() {
  const { pathname } = useLocation();
  const selected = useMemo(() => {
    const match = ITEMS.map((i) => i.key)
      .filter((key) => pathname === key || pathname.startsWith(`${key}/`))
      .sort((a, b) => b.length - a.length)[0];
    return match ?? '/appointments';
  }, [pathname]);

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[selected]}
      items={ITEMS}
      data-testid="app-nav"
      style={{ flex: 1, minWidth: 0 }}
    />
  );
}
