// theming skill: tokens are the single source of truth. The antd theme is
// MAPPED from them (never restate a color in ConfigProvider that isn't here).
import type { ThemeConfig } from 'antd';

export const tokens = {
  color: {
    primary: '#1677ff',
    success: '#52c41a',
    warning: '#faad14',
    danger: '#ff4d4f',
    textMuted: '#8c8c8c',
  },
  space: { xs: 4, sm: 8, md: 16, lg: 24 },
  radius: { md: 8 },
} as const;

// Feeds antd's ConfigProvider — see the `antd` and `theming` skills.
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: tokens.color.primary,
    colorSuccess: tokens.color.success,
    colorWarning: tokens.color.warning,
    colorError: tokens.color.danger,
    borderRadius: tokens.radius.md,
  },
};
