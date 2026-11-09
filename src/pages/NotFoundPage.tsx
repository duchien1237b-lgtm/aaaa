import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface NotFoundPageProps {
  title?: string;
  message?: string;
}

export function NotFoundPage({
  title = 'Không tìm thấy trang này',
  message = 'Đường dẫn có thể đã thay đổi hoặc bạn gõ chưa đúng.',
}: NotFoundPageProps) {
  useDocumentTitle(title);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-100 text-brand-800">
        <Icon name="search" className="h-8 w-8" />
      </span>
      <h1 className="mt-5 text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-ink-soft">{message}</p>
      <Link to="/" className="btn btn-primary mt-6">
        <Icon name="arrow-left" className="h-4 w-4" />
        Về sổ chi tiêu
      </Link>
    </div>
  );
}
