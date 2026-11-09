import type { IconName } from '../types';

const PATHS: Record<IconName, string> = {
  utensils: 'M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3c-2 1.5-3 4-3 7 0 2 1 3 3 3v8',
  car: 'M5 15l1.6-5.2A2 2 0 0 1 8.5 8.5h7a2 2 0 0 1 1.9 1.3L19 15M4 15h16v4H4zM7 19v2M17 19v2M8 12h.01M16 12h.01',
  bag: 'M6 8h12l1 12H5L6 8zM9 8V6a3 3 0 0 1 6 0v2',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  film: 'M4 5h16v14H4zM10 9l5 3-5 3V9z',
  book: 'M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4zM8 17h10',
  wallet: 'M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7zM4 7l12-3v3M16 13.5h.01',
  laptop: 'M5 6h14v9H5zM3 19h18',
  gift: 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2 0-4-1-4-2.5S10 3 12 7zM12 7c2 0 4-1 4-2.5S14 3 12 7z',
  dots: 'M5 12h.01M12 12h.01M19 12h.01',
  plus: 'M12 5v14M5 12h14',
  edit: 'M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4',
  trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v6M14 11v6',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  note: 'M6 3h9l3 3v15H6zM9 11h6M9 15h6',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  card: 'M3 6h18v12H3zM3 10h18M7 15h3',
  alert: 'M12 4l9 16H3L12 4zM12 10v4M12 17h.01',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8h.01',
  'trend-down': 'M4 7l6 6 4-4 6 6M20 15v-5h-5',
  'trend-up': 'M4 17l6-6 4 4 6-6M20 9v5h-5',
};

interface IconProps {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}

/** Biểu tượng trang trí: luôn ẩn với trình đọc màn hình. Nút chỉ có icon phải có aria-label. */
export function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
