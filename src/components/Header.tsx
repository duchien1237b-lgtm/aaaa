import { Link } from 'react-router-dom';
import { Icon } from './Icon';

interface HeaderProps {
  onAdd: () => void;
}

function Logo() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="11" fill="#064e3b" />
      <path d="M11 9h15a4 4 0 0 1 4 4v18H15a4 4 0 0 1-4-4V9z" fill="#ecfdf5" />
      <path d="M15 17h11M15 21.5h11M15 26h6" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <circle cx="29" cy="29" r="7" fill="#059669" />
      <path
        d="M29 25v8M26.5 27.5h3.6a1.6 1.6 0 0 1 0 3.2h-3.6"
        stroke="#ecfdf5"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Header({ onAdd }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 tablet:px-6 desktop:px-8">
        <Link to="/" className="flex items-center gap-2.5 rounded-lg">
          <Logo />
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Sổ Chi Tiêu
          </span>
        </Link>

        <button type="button" onClick={onAdd} className="btn btn-primary">
          <Icon name="plus" className="h-5 w-5" strokeWidth={2.2} />
          <span className="hidden tablet:inline">Thêm giao dịch</span>
          <span className="tablet:hidden">Thêm</span>
        </button>
      </div>
    </header>
  );
}
