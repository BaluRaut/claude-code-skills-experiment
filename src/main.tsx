import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, App as AntApp } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { antdTheme } from './theme/tokens';
import { doctorRepo } from './features/doctors/doctor.repo';

// DOC-3: seed the doctor directory before first render.
doctorRepo.seedIfEmpty();

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
