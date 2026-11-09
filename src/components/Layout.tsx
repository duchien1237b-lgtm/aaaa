import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import type { LayoutContextValue } from '../hooks/useLayout';
import type { Transaction } from '../types';
import { Header } from './Header';
import { TransactionFormModal } from './TransactionFormModal';

interface FormState {
  open: boolean;
  editing: Transaction | null;
}

export function Layout() {
  const [form, setForm] = useState<FormState>({ open: false, editing: null });
  const { pathname } = useLocation();

  const openForm = useCallback((editing?: Transaction) => {
    setForm({ open: true, editing: editing ?? null });
  }, []);

  const closeForm = useCallback(() => {
    setForm((current) => ({ ...current, open: false }));
  }, []);

  const context = useMemo<LayoutContextValue>(() => ({ openForm }), [openForm]);

  // Chuyển trang thì cuộn về đầu.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <button
        type="button"
        className="skip-link"
        onClick={() => document.getElementById('main')?.focus()}
      >
        Bỏ qua tới nội dung chính
      </button>

      <Header onAdd={() => openForm()} />

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet context={context} />
      </main>

      <footer className="border-t border-line bg-white">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-ink-mute tablet:px-6 desktop:px-8">
          Bài thực hành Lab 2, môn Thiết kế Web. Dữ liệu được lưu ngay trên trình duyệt của bạn,
          không gửi đi đâu cả.
        </p>
      </footer>

      <TransactionFormModal open={form.open} editing={form.editing} onClose={closeForm} />
    </div>
  );
}
