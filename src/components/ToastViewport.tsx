import type { IconName, ToastItem, ToastKind } from '../types';
import { Icon } from './Icon';

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

const STYLE: Record<ToastKind, { icon: IconName; badge: string }> = {
  success: { icon: 'check', badge: 'bg-brand-600 text-white' },
  error: { icon: 'alert', badge: 'bg-rose-700 text-white' },
  info: { icon: 'info', badge: 'bg-sky-700 text-white' },
};

/** Vùng thông báo: đọc to lịch sự (polite), lỗi dùng role="alert" để được đọc ngay. */
export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Thông báo"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2 p-4 tablet:items-end tablet:p-6"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.kind === 'error' ? 'alert' : 'status'}
          className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-2xl border border-line bg-white p-3.5 pr-2 shadow-sheet"
        >
          <span
            className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${STYLE[toast.kind].badge}`}
          >
            <Icon name={STYLE[toast.kind].icon} className="h-4 w-4" strokeWidth={2.4} />
          </span>
          <p className="flex-1 py-0.5 text-sm font-medium leading-snug text-ink">{toast.message}</p>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Đóng thông báo"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-brand-100"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
