// testing-library-react skill: one custom render wrapping the real providers.
import { type ReactElement } from 'react';
import { render, type RenderResult } from '@testing-library/react';
import { App as AntApp, ConfigProvider } from 'antd';
import { MemoryRouter } from 'react-router-dom';
import { antdTheme } from '../theme/tokens';

export function renderWithProviders(ui: ReactElement, route = '/'): RenderResult {
  return render(
    <ConfigProvider theme={antdTheme}>
      <AntApp>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </AntApp>
    </ConfigProvider>,
  );
}
