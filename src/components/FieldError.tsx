import { Icon } from './Icon';

interface FieldErrorProps {
  id: string;
  message?: string;
}

/** Thông báo lỗi dưới ô nhập; được liên kết qua aria-describedby và đọc ngay khi xuất hiện. */
export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-rose-700">
      <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </p>
  );
}
