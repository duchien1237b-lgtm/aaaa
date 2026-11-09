import { useId, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  CATEGORY_MAP,
  METHOD_LABEL,
  PAYMENT_METHODS,
  categoriesFor,
} from '../data/categories';
import { useToast } from '../hooks/useToast';
import { useTransactions } from '../hooks/useTransactions';
import { formatLongDate, todayISO } from '../lib/date';
import {
  MIN_DATE,
  NOTE_MAX,
  STEP_COUNT,
  TITLE_MAX,
  firstInvalidStep,
  parseAmount,
  validateStep,
} from '../lib/validation';
import type {
  FormErrors,
  FormValues,
  PaymentMethod,
  Transaction,
  TransactionDraft,
  TransactionType,
} from '../types';
import { formatCurrency, truncateText } from '../utils';
import { FieldError } from './FieldError';
import { Icon } from './Icon';
import { Modal } from './Modal';
import { Stepper } from './Stepper';

const STEP_LABELS = ['Số tiền', 'Chi tiết', 'Xác nhận'] as const;

const QUICK_AMOUNTS: Record<TransactionType, number[]> = {
  expense: [20000, 50000, 100000, 500000],
  income: [1000000, 5000000, 10000000, 20000000],
};

const TITLE_ID = 'transaction-form-title';

function emptyValues(today: string): FormValues {
  return {
    type: 'expense',
    amount: '',
    title: '',
    category: '',
    date: today,
    method: 'cash',
    note: '',
    sharedWith: '',
  };
}

function fromTransaction(tx: Transaction): FormValues {
  return {
    type: tx.type,
    amount: String(tx.amount),
    title: tx.title,
    category: tx.category,
    date: tx.date,
    method: tx.method,
    note: tx.note,
    sharedWith: tx.sharedWith ?? '',
  };
}

function groupDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits === '' ? '' : new Intl.NumberFormat('vi-VN').format(Number(digits));
}

function isPaymentMethod(value: string): value is PaymentMethod {
  return PAYMENT_METHODS.some((m) => m.id === value);
}

interface TransactionFormModalProps {
  open: boolean;
  editing: Transaction | null;
  onClose: () => void;
}

export function TransactionFormModal({ open, editing, onClose }: TransactionFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy={TITLE_ID}>
      {/* Form chỉ được gắn vào khi mở, nên mỗi lần mở là một trạng thái sạch. */}
      <TransactionForm editing={editing} onClose={onClose} />
    </Modal>
  );
}

interface TransactionFormProps {
  editing: Transaction | null;
  onClose: () => void;
}

function TransactionForm({ editing, onClose }: TransactionFormProps) {
  const { add, update } = useTransactions();
  const { notify } = useToast();
  const uid = useId();

  const today = useMemo(() => todayISO(), []);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(() =>
    editing ? fromTransaction(editing) : emptyValues(today),
  );
  // Chỉ hiện lỗi của bước nào người dùng đã thử đi tiếp.
  const [attempted, setAttempted] = useState<boolean[]>(() => Array<boolean>(STEP_COUNT).fill(false));

  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const errors = useMemo<FormErrors>(
    () => (attempted[step] ? validateStep(step, values, today) : {}),
    [attempted, step, values, today],
  );

  const isEditing = editing !== null;
  const isLastStep = step === STEP_COUNT - 1;
  const categories = categoriesFor(values.type);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function setType(type: TransactionType) {
    setValues((current) => {
      const stillValid = current.category !== '' && CATEGORY_MAP[current.category].kind === type;
      return { ...current, type, category: stillValid ? current.category : '' };
    });
  }

  function onAmountChange(event: ChangeEvent<HTMLInputElement>) {
    setField('amount', event.target.value.replace(/\D/g, '').slice(0, 10));
  }

  function focusFirstInvalid() {
    window.requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
  }

  function focusHeading() {
    window.requestAnimationFrame(() => headingRef.current?.focus());
  }

  function markAttempted(target: number | 'all') {
    setAttempted((list) => list.map((value, index) => (target === 'all' || index === target ? true : value)));
  }

  function goNext() {
    if (Object.keys(validateStep(step, values, today)).length > 0) {
      markAttempted(step);
      focusFirstInvalid();
      return;
    }
    setStep((current) => Math.min(current + 1, STEP_COUNT - 1));
    focusHeading();
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
    focusHeading();
  }

  function save() {
    const badStep = firstInvalidStep(values, today);
    if (badStep !== -1) {
      markAttempted('all');
      setStep(badStep);
      focusFirstInvalid();
      return;
    }

    const category = values.category;
    if (category === '') return; // đã được validateStep chặn ở trên; giúp TypeScript thu hẹp kiểu

    const email = values.sharedWith.trim();
    const draft: TransactionDraft = {
      title: values.title.trim(),
      amount: parseAmount(values.amount),
      type: values.type,
      category,
      date: values.date,
      method: values.method,
      note: values.note.trim(),
      ...(email !== '' ? { sharedWith: email } : {}),
    };

    const shortTitle = truncateText(draft.title, 32);
    if (editing) {
      update({ ...draft, id: editing.id });
      notify('success', `Đã cập nhật giao dịch “${shortTitle}”`);
    } else {
      add(draft);
      notify('success', `Đã thêm giao dịch “${shortTitle}”`);
    }
    onClose();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLastStep) save();
    else goNext();
  }

  const amountId = `${uid}-amount`;
  const titleId = `${uid}-title`;
  const dateId = `${uid}-date`;
  const methodId = `${uid}-method`;
  const noteId = `${uid}-note`;
  const emailId = `${uid}-email`;

  const selectedCategory = values.category === '' ? null : CATEGORY_MAP[values.category];
  const isIncome = values.type === 'income';

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate>
      <div className="sticky top-0 z-10 border-b border-line bg-white px-5 pb-4 pt-5 tablet:px-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id={TITLE_ID} className="text-xl font-semibold">
            {isEditing ? 'Sửa giao dịch' : 'Thêm giao dịch'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng form"
            className="-mr-2 -mt-1 grid h-11 w-11 place-items-center rounded-xl text-ink-soft hover:bg-brand-100"
          >
            <Icon name="close" />
          </button>
        </div>
        <Stepper steps={STEP_LABELS} current={step} />
      </div>

      <div className="px-5 py-5 tablet:px-6">
        {step === 0 && (
          <div className="space-y-5">
            <h3 ref={headingRef} tabIndex={-1} className="text-lg font-semibold outline-none">
              Bạn muốn ghi khoản nào?
            </h3>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-ink-soft">Loại giao dịch</legend>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: 'expense', label: 'Chi tiêu', icon: 'trend-down' },
                    { value: 'income', label: 'Thu nhập', icon: 'trend-up' },
                  ] as const
                ).map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name={`${uid}-type`}
                      value={option.value}
                      checked={values.type === option.value}
                      onChange={() => setType(option.value)}
                      className="peer sr-only"
                    />
                    <span
                      className={`flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-line bg-white px-3 font-semibold text-ink-soft transition-colors peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600 ${
                        option.value === 'expense'
                          ? 'peer-checked:border-rose-700 peer-checked:bg-rose-50 peer-checked:text-rose-800'
                          : 'peer-checked:border-brand-700 peer-checked:bg-brand-50 peer-checked:text-brand-800'
                      }`}
                    >
                      <Icon name={option.icon} />
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor={amountId} className="mb-2 block text-sm font-medium text-ink-soft">
                Số tiền
              </label>
              <div className="relative">
                <input
                  id={amountId}
                  data-autofocus
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="0"
                  value={groupDigits(values.amount)}
                  onChange={onAmountChange}
                  aria-invalid={errors.amount ? true : undefined}
                  aria-describedby={errors.amount ? `${amountId}-error` : undefined}
                  className="field pr-12 font-display text-3xl font-semibold tabular-nums"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-xl font-semibold text-ink-mute"
                >
                  ₫
                </span>
              </div>
              <FieldError id={`${amountId}-error`} message={errors.amount} />

              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Chọn nhanh số tiền">
                {QUICK_AMOUNTS[values.type].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className="chip"
                    aria-label={`Chọn ${formatCurrency(amount)}`}
                    onClick={() => setField('amount', String(amount))}
                  >
                    {new Intl.NumberFormat('vi-VN').format(amount)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h3 ref={headingRef} tabIndex={-1} className="text-lg font-semibold outline-none">
              Khoản {isIncome ? 'thu' : 'chi'} này là gì?
            </h3>

            <div>
              <label htmlFor={titleId} className="mb-2 block text-sm font-medium text-ink-soft">
                Tên giao dịch
              </label>
              <input
                id={titleId}
                type="text"
                maxLength={TITLE_MAX}
                autoComplete="off"
                placeholder={isIncome ? 'Ví dụ: Lương tháng 11' : 'Ví dụ: Cà phê với bạn'}
                value={values.title}
                onChange={(event) => setField('title', event.target.value)}
                aria-invalid={errors.title ? true : undefined}
                aria-describedby={errors.title ? `${titleId}-error` : undefined}
                className="field"
              />
              <FieldError id={`${titleId}-error`} message={errors.title} />
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-ink-soft">Danh mục</legend>
              <div className="grid grid-cols-2 gap-2 tablet:grid-cols-3">
                {categories.map((category, index) => (
                  <label key={category.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name={`${uid}-category`}
                      value={category.id}
                      checked={values.category === category.id}
                      onChange={() => setField('category', category.id)}
                      aria-invalid={errors.category && index === 0 ? true : undefined}
                      aria-describedby={errors.category ? `${uid}-category-error` : undefined}
                      className="peer sr-only"
                    />
                    <span className="flex min-h-[48px] items-center gap-2 rounded-xl border-2 border-line bg-white px-3 py-2 text-sm font-medium text-ink-soft transition-colors peer-checked:border-brand-700 peer-checked:bg-brand-50 peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600">
                      <span
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                        style={{ backgroundColor: category.tint, color: category.color }}
                      >
                        <Icon name={category.icon} className="h-4 w-4" />
                      </span>
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>
              <FieldError id={`${uid}-category-error`} message={errors.category} />
            </fieldset>

            <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2">
              <div>
                <label htmlFor={dateId} className="mb-2 block text-sm font-medium text-ink-soft">
                  Ngày giao dịch
                </label>
                <input
                  id={dateId}
                  type="date"
                  min={MIN_DATE}
                  max={today}
                  value={values.date}
                  onChange={(event) => setField('date', event.target.value)}
                  aria-invalid={errors.date ? true : undefined}
                  aria-describedby={errors.date ? `${dateId}-error` : undefined}
                  className="field"
                />
                <FieldError id={`${dateId}-error`} message={errors.date} />
              </div>

              <div>
                <label htmlFor={methodId} className="mb-2 block text-sm font-medium text-ink-soft">
                  Cách thanh toán
                </label>
                <select
                  id={methodId}
                  value={values.method}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (isPaymentMethod(next)) setField('method', next);
                  }}
                  className="field"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor={noteId} className="mb-2 block text-sm font-medium text-ink-soft">
                Ghi chú (không bắt buộc)
              </label>
              <textarea
                id={noteId}
                rows={2}
                maxLength={NOTE_MAX}
                value={values.note}
                onChange={(event) => setField('note', event.target.value)}
                aria-invalid={errors.note ? true : undefined}
                aria-describedby={`${noteId}-count${errors.note ? ` ${noteId}-error` : ''}`}
                className="field resize-none"
              />
              <p id={`${noteId}-count`} className="mt-1 text-right text-sm text-ink-mute">
                {values.note.length}/{NOTE_MAX}
              </p>
              <FieldError id={`${noteId}-error`} message={errors.note} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h3 ref={headingRef} tabIndex={-1} className="text-lg font-semibold outline-none">
              Kiểm tra lại trước khi lưu
            </h3>

            <div className="overflow-hidden rounded-2xl border border-line">
              <div
                className="flex items-center gap-3 p-4"
                style={{ backgroundColor: selectedCategory?.tint }}
              >
                {selectedCategory && (
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/70"
                    style={{ color: selectedCategory.color }}
                  >
                    <Icon name={selectedCategory.icon} className="h-6 w-6" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium">{values.title.trim()}</p>
                  <p
                    className={`font-display text-2xl font-semibold tabular-nums ${
                      isIncome ? 'text-brand-800' : 'text-rose-800'
                    }`}
                  >
                    {isIncome ? '+' : '−'}
                    {formatCurrency(parseAmount(values.amount))}
                  </p>
                </div>
              </div>
              <dl className="divide-y divide-line text-sm">
                {(
                  [
                    ['Loại', isIncome ? 'Thu nhập' : 'Chi tiêu'],
                    ['Danh mục', selectedCategory?.label ?? ''],
                    ['Ngày', values.date ? formatLongDate(values.date) : ''],
                    ['Thanh toán', METHOD_LABEL[values.method]],
                    ['Ghi chú', values.note.trim() === '' ? 'Không có' : values.note.trim()],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-ink-mute">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <label htmlFor={emailId} className="mb-2 block text-sm font-medium text-ink-soft">
                Chia sẻ với (email, không bắt buộc)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-ink-mute">
                  <Icon name="mail" className="h-5 w-5" />
                </span>
                <input
                  id={emailId}
                  type="email"
                  autoComplete="off"
                  placeholder="ten@gmail.com"
                  value={values.sharedWith}
                  onChange={(event) => setField('sharedWith', event.target.value)}
                  aria-invalid={errors.sharedWith ? true : undefined}
                  aria-describedby={`${emailId}-hint${errors.sharedWith ? ` ${emailId}-error` : ''}`}
                  className="field pl-11"
                />
              </div>
              <p id={`${emailId}-hint`} className="mt-1.5 text-sm text-ink-mute">
                Dùng khi chia tiền với bạn bè. Email chỉ được ghi nhớ cùng giao dịch này.
              </p>
              <FieldError id={`${emailId}-error`} message={errors.sharedWith} />
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-line bg-white px-5 py-4 tablet:flex-row tablet:justify-between tablet:px-6">
        {step === 0 ? (
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Hủy
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={goBack}>
            <Icon name="arrow-left" className="h-4 w-4" />
            Quay lại
          </button>
        )}

        {isLastStep ? (
          <button type="submit" className="btn btn-primary">
            <Icon name="check" className="h-4 w-4" strokeWidth={2.4} />
            {isEditing ? 'Lưu thay đổi' : 'Lưu giao dịch'}
          </button>
        ) : (
          <button type="submit" className="btn btn-primary">
            Tiếp tục
            <Icon name="arrow-right" className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
