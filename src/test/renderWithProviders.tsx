import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { App as AntApp, ConfigProvider } from 'antd';
import { MemoryRouter } from 'react-router-dom';
import { antdTheme } from '../theme/tokens';

/** Renders UI inside the same providers as the real app (theme, antd App, router). */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/' }: { route?: string } = {},
) {
  return render(
    <ConfigProvider theme={antdTheme}>
      <AntApp>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </AntApp>
    </ConfigProvider>,
  );
}
