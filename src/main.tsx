import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ToastProvider } from './context/ToastProvider';
import { TransactionsProvider } from './context/TransactionsProvider';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Không tìm thấy phần tử #root trong index.html');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <TransactionsProvider>
          <App />
        </TransactionsProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
