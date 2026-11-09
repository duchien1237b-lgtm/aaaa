/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Breakpoint tùy biến (Feature F=2). Đúng 3 vùng hiển thị:
    //   dưới 640px      -> mobile  (1 cột)
    //   640px - 1023px  -> tablet  (2 cột)
    //   từ 1024px       -> desktop (3 cột)
    screens: {
      tablet: '640px',
      desktop: '1024px',
    },
    extend: {
      colors: {
        // C = 1 -> Emerald #059669 là brand.600
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        ink: {
          DEFAULT: '#022c22',
          soft: '#3d5a4e',
          mute: '#5b7468',
        },
        paper: '#f3f8f5',
        line: '#d5e5dc',
        edge: '#6f8a7e',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', '"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(2, 44, 34, 0.04), 0 10px 24px -14px rgba(2, 44, 34, 0.16)',
        sheet: '0 -8px 40px -8px rgba(2, 44, 34, 0.35)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'sheet-in': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 160ms ease-out',
        'sheet-in': 'sheet-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'toast-in': 'toast-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
