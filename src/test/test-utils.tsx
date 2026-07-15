// testing-library-react skill: ONE shared custom render wrapping the app's
// providers (antd theme + App context for message, router). Tests import
// renderWithProviders from here, never @testing-library/react directly.
import type { ReactElement, ReactNode } from 'react';
import { render, type RenderResult } from '@testing-library/react';
import { App as AntApp, ConfigProvider } from 'antd';
import { MemoryRouter } from 'react-router-dom';
import { antdTheme } from '../theme/tokens';

interface Options {
  route?: string;
}

function Providers({ children, route }: { children: ReactNode; route: string }) {
  return (
    <ConfigProvider theme={antdTheme}>
      <AntApp>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/' }: Options = {},
): RenderResult {
  return render(<Providers route={route}>{ui}</Providers>);
}
