# Bé Milk – Nhật ký chăm ngoan

Ứng dụng Next.js dành cho bé Milk, gồm nhiệm vụ hằng ngày, sao thưởng, đổi quà, giọng đọc tiếng Việt, thú cưng ảo, sticker/huy hiệu, thống kê và khu vực ba mẹ.

## Chạy trên máy tính

Yêu cầu Node.js 20.9 trở lên.

```bash
npm install
npm run dev
```

Mở http://localhost:3000

## Đưa lên Vercel

1. Giải nén thư mục dự án.
2. Tạo repository mới trên https://github.com và tải toàn bộ mã nguồn lên.
3. Đăng nhập https://vercel.com, chọn **Add New → Project**.
4. Import repository vừa tạo.
5. Framework Preset chọn **Next.js** (Vercel thường tự nhận).
6. Chọn **Deploy**. Không cần Environment Variables cho bản chạy thử này.

Mỗi lần cập nhật mã nguồn trên GitHub, Vercel sẽ tự triển khai lại.

## Khu vực ba mẹ

- Mở nút **Ba Mẹ** ở thanh điều hướng.
- PIN mặc định: `1234`.
- Hãy thay cơ chế PIN mẫu bằng đăng nhập có xác thực phía máy chủ trước khi dùng công khai.

## Lưu ý dữ liệu

Bản 1.0 lưu dữ liệu trong Local Storage của trình duyệt. Dữ liệu nằm trên thiết bị/trình duyệt đang sử dụng, không tự đồng bộ giữa điện thoại và máy tính. Không xóa dữ liệu trình duyệt nếu muốn giữ tiến độ. Để dùng nhiều thiết bị hoặc có tài khoản riêng, cần bổ sung Supabase (database, authentication và phân quyền) ở bước tiếp theo.

## Những điểm cần hoàn thiện trước khi phát hành rộng

- Đổi PIN mẫu `1234` thành xác thực an toàn phía máy chủ.
- Kết nối Supabase để đồng bộ dữ liệu.
- Thêm ảnh chân dung bé do gia đình cung cấp vào `public/` và thay phần minh họa emoji ở trang chủ.
- Bổ sung quy trình xác nhận đổi quà của ba mẹ và sao lưu dữ liệu.
- Thử nghiệm trên các trình duyệt Android/iOS; giọng đọc phụ thuộc giọng tiếng Việt có sẵn trên thiết bị.
