// Placeholder home screen — the shell is set up and runs. YOU build the
// appointment feature from here using the skills (see how-to-use-skills.md).
import { Card, Space, Typography } from 'antd';

export function HomePage() {
  return (
    <Card data-testid="home-card">
      <Space direction="vertical" size="middle">
        <Typography.Title level={4}>The shell is ready 🩺</Typography.Title>
        <Typography.Paragraph type="secondary">
          Vite + React 19 + antd 6 + TypeScript, wired with theme tokens and routing.
          There is no feature yet — that is yours to build.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Open <Typography.Text code>how-to-use-skills.md</Typography.Text> and build the doctor
          appointment app step by step by invoking the skills in{' '}
          <Typography.Text code>.claude/skills/</Typography.Text>.
        </Typography.Paragraph>
      </Space>
    </Card>
  );
}
