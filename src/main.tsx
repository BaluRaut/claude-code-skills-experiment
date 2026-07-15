import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, App as AntApp } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { antdTheme } from './theme/tokens';

// antd 6 + React 19: ConfigProvider carries the theme (mapped from tokens),
// AntApp provides message/notification context and the CSS reset boundary.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={antdTheme}>
      <AntApp>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  </StrictMode>,
);
