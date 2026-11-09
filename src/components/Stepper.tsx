import { Icon } from './Icon';

interface StepperProps {
  steps: readonly string[];
  /** Chỉ số bước hiện tại, bắt đầu từ 0 */
  current: number;
}

/** Thanh tiến trình của form nhiều bước. Đây là chuỗi bước thật nên có đánh số. */
export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex items-center" aria-label="Tiến trình các bước">
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={label}
            aria-current={active ? 'step' : undefined}
            className="flex flex-1 items-center last:flex-none"
          >
            <span className="flex items-center gap-2">
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                  done
                    ? 'bg-brand-700 text-white'
                    : active
                      ? 'bg-brand-900 text-white ring-4 ring-brand-200'
                      : 'border border-edge bg-white text-ink-mute'
                }`}
              >
                {done ? <Icon name="check" className="h-4 w-4" strokeWidth={2.6} /> : index + 1}
              </span>
              <span
                className={`text-sm ${active ? 'font-semibold text-ink' : 'text-ink-soft'}`}
              >
                {label}
                {done && <span className="sr-only"> (đã xong)</span>}
              </span>
            </span>
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`mx-3 h-0.5 min-w-4 flex-1 rounded-full ${
                  done ? 'bg-brand-600' : 'bg-line'
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
