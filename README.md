# Sổ Chi Tiêu — Lab 2 Thiết kế Web

MSSV **6651071062**. Ứng dụng quản lý chi tiêu cá nhân: ghi thu chi, xem số dư theo tháng,
xem tiền đã chi vào danh mục nào, tìm và lọc giao dịch. Dữ liệu lưu trong `localStorage`.

## Biến thể cá nhân hóa

| Mục | Phép tính | Kết quả |
| --- | --- | --- |
| S | 6+6+5+1+0+7+1+0+6+2 | **34** |
| D | 34 mod 15 = 4 | Bảng 1 dòng 4: **Quản lý chi tiêu cá nhân** (tự tạo dữ liệu + lưu localStorage) |
| F | 62 mod 10 = 2 | Bảng 2 dòng 2: **Form nhiều bước có validate · Toast thông báo · Responsive breakpoint tùy biến** |
| C | 6 mod 5 = 1 | Bảng 3 dòng 1: **Emerald #059669** |

## Chạy dự án

```bash
npm install
npm run dev          # chạy thử tại http://localhost:5173
npm run build        # tsc --noEmit + vite build
```

## Bốn lệnh kiểm tra chất lượng (chụp màn hình để nộp)

```bash
npx tsc --noEmit     # 0 lỗi
npx eslint .         # 0 lỗi, 0 cảnh báo
npm run test         # xem ghi chú về số lượng test bên dưới
# Lighthouse: mở bản đã deploy trong Chrome > DevTools > Lighthouse > Mobile
```

> **Về "7/7 test case":** file `src/utils.test.ts` được sao chép nguyên văn từ đề và chỉ có
> **6** khối `it()` (formatCurrency 1, truncateText 2, validateEmail 2, debounce 1), nên kết quả
> sẽ là `6 passed`. Nên hỏi lại giảng viên để biết có phải đề ghi nhầm không. Không tự thêm test,
> vì đề yêu cầu không sửa file này.

## Ba tính năng bắt buộc (F = 2) nằm ở đâu

1. **Form nhiều bước có validate**: `src/components/TransactionFormModal.tsx` (3 bước: Số tiền,
   Chi tiết, Xác nhận), luật kiểm tra trong `src/lib/validation.ts`, thanh tiến trình
   `src/components/Stepper.tsx`. Chỉ hiện lỗi của bước người dùng đã thử đi tiếp; bấm "Tiếp tục"
   khi có lỗi thì focus nhảy vào ô lỗi đầu tiên.
2. **Toast thông báo**: `src/context/ToastProvider.tsx` và `src/components/ToastViewport.tsx`.
   Hiện khi thêm, sửa, xóa giao dịch và khôi phục dữ liệu mẫu. Tự tắt sau 4,5 giây, có nút đóng.
3. **Responsive breakpoint tùy biến**: `tailwind.config.js` ghi đè `screens` thành đúng hai mốc
   `tablet: 640px` và `desktop: 1024px`, cho ba vùng: dưới 640px (1 cột), 640–1023px (2 cột),
   từ 1024px (3 cột). Xem `grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3` trong `ListPage.tsx`.

## Đáp ứng yêu cầu kỹ thuật

- **TypeScript strict, không dùng `any`**: `debounce` dùng ràng buộc `never[]` thay cho `any[]`
  trong chữ ký mẫu của đề; test của đề vẫn chạy được.
- **ESLint**: cấu hình mặc định kiểu Vite + 2 rule bổ sung là `@typescript-eslint/no-explicit-any`
  và `eqeqeq` (đề nhắc "xem mục III.4" nhưng mục đó không nêu cụ thể 2 rule nào; đổi trong
  `eslint.config.js` nếu giảng viên chỉ định rule khác).
- **Routing**: `/` (danh sách) và `/item/:id` (chi tiết), điều hướng bằng `<Link>`.
- **State**: `useReducer` + Context (`src/state`, `src/context`), không thêm thư viện state.
- **Accessibility**: modal đóng bằng Esc, bẫy focus, trả focus khi đóng; nút chỉ có icon đều có
  `aria-label`; ô nhập có `label`, lỗi gắn `aria-describedby`; màu chữ chọn đạt AA (Emerald
  #059669 dùng cho nền, viền, thanh biểu đồ; chữ và nút dùng tông đậm hơn #047857).
- **Dữ liệu**: `src/data/data.json` có 25 giao dịch (tối thiểu 20).

## Deploy

### Render.com (Static Site)

Dự án có sẵn `render.yaml` (Blueprint), `.node-version` (Node 20) và `package-lock.json`.

**Cách 1: Blueprint (nhanh nhất)**

1. Đẩy toàn bộ thư mục lên một repo GitHub (nhánh `main`), nhớ commit cả `package-lock.json`.
2. Vào <https://dashboard.render.com> > **New** > **Blueprint** > chọn repo.
3. Render đọc `render.yaml` và tạo Static Site `so-chi-tieu-6651071062`. Bấm **Apply**.
4. Chờ build xong, link có dạng `https://so-chi-tieu-6651071062.onrender.com`.

**Cách 2: Tạo tay Static Site**

1. **New** > **Static Site** > chọn repo.
2. Điền:
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`
   - Environment Variable: `NODE_VERSION` = `20`
3. Sau khi tạo xong, vào tab **Redirects/Rewrites** thêm 1 dòng:
   Source `/*`, Destination `/index.html`, Action **Rewrite**.
   Thiếu dòng này thì bấm F5 ở trang `/item/:id` sẽ bị 404 (Render không đọc `_redirects`).

Nếu đổi tên service hoặc dùng nhánh khác `main`, sửa `name` / `branch` trong `render.yaml`.

### Vercel / Netlify

Vẫn giữ `vercel.json` và `public/_redirects` nếu muốn deploy ở đó.
Vercel: import repo GitHub, giữ mặc định (Framework: Vite, build `npm run build`, output `dist`).

## Gợi ý lịch commit (tối thiểu 14 commit, `[HH:MM] mô tả`)

Hãy commit thật trong lúc làm, đừng gộp lại cuối buổi. Ví dụ theo thứ tự:

1. `[HH:MM] Khởi tạo dự án Vite React TS, bật strict`
2. `[HH:MM] Cài Tailwind, cấu hình màu emerald và breakpoint`
3. `[HH:MM] Cấu hình ESLint và Vitest`
4. `[HH:MM] Viết utils.ts và copy utils.test.ts`
5. `[HH:MM] Tạo data.json 25 giao dịch và định nghĩa kiểu`
6. `[HH:MM] Thêm reducer, context và lưu localStorage`
7. `[HH:MM] Thêm Header, Layout và routing 2 trang`
8. `[HH:MM] Làm thẻ giao dịch và trang danh sách`
9. `[HH:MM] Thêm khối tổng quan và biểu đồ danh mục`
10. `[HH:MM] Thêm tìm kiếm debounce, lọc và sắp xếp`
11. `[HH:MM] Làm Modal có Esc và bẫy focus`
12. `[HH:MM] Làm form nhiều bước và validate từng bước`
13. `[HH:MM] Thêm Toast thông báo`
14. `[HH:MM] Làm trang chi tiết, sửa và xóa`
15. `[HH:MM] Sửa lỗi accessibility và chạy Lighthouse`
16. `[HH:MM] Deploy lên Vercel, cập nhật README`
