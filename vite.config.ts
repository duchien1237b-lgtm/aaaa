import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Render (Web Service) cấp cổng qua biến môi trường PORT và truy cập bằng tên miền *.onrender.com.
// Nếu không cấu hình 3 dòng dưới, `vite preview` chỉ nghe localhost:4173 và chặn host lạ (403),
// Render sẽ báo "No open ports detected" hoặc trang hiện "Blocked request".
// Khai báo tối thiểu để tsc không cần cài thêm @types/node.
declare const process: { env: Record<string, string | undefined> };
const port = Number(process.env.PORT) || 4173;

export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port,
    strictPort: true,
    allowedHosts: true,
  },
  test: {
    environment: 'jsdom',
    css: false,
  },
});
