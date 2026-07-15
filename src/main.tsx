import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, App as AntApp } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { antdTheme } from './theme/tokens';
import { seedDoctorsIfEmpty } from './data/doctors';

// DOC-3: ensure the doctor directory is seeded before first render.
seedDoctorsIfEmpty();

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
