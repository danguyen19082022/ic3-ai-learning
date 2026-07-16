# IC3 AI Learning

Website prototype nhiều trang phục vụ ôn tập và thi thử IC3 dành cho học sinh khối 6, 7 và 8.

## Công nghệ

- React
- Vite
- Lucide React Icons
- CSS responsive tự viết
- Dữ liệu mẫu, chưa kết nối backend hoặc Firebase

## Cài đặt và chạy dự án

Yêu cầu máy tính đã cài Node.js phiên bản 18 trở lên.

```bash
npm install
npm run dev
```

Sau đó mở địa chỉ được Vite hiển thị, thông thường là:

```text
http://localhost:5173
```

## Build bản production

```bash
npm run build
```

Kết quả được tạo trong thư mục `dist`.

## Tài khoản và dữ liệu mẫu

### Học sinh

- Chọn Trường → Khối → Lớp → Họ và tên.
- Mật khẩu mẫu: `123456`.

### Giáo viên

- Tên đăng nhập: `teacher1`.
- Mật khẩu: `teacher123`.

### Quản trị viên

- Tên đăng nhập: `admin`.
- Mật khẩu: `admin123`.

Prototype hiện cho phép mở trực tiếp khu vực giáo viên và quản trị viên từ trang chủ để thuận tiện trình diễn giao diện.

## Các trang đã xây dựng

1. Trang chủ và đăng nhập học sinh.
2. Dashboard học sinh.
3. Trang chọn chế độ Ôn tập hoặc Thi thử.
4. Danh sách chủ đề ôn tập.
5. Trang làm bài.
6. Trang kết quả.
7. Trang xem lại đáp án.
8. Bảng xếp hạng.
9. Dashboard giáo viên.
10. Dashboard quản trị viên.

## Các dạng câu hỏi mẫu

- Single choice.
- Multiple choice.
- Bảng Đúng/Sai.
- Matching kéo thả.
- Reorder kéo thả.
- Hotspot chọn vùng trên hình.

## Cấu trúc thư mục

```text
IC3-AI-Learning/
├── dist/                Bản build production
├── src/
│   ├── main.jsx         Toàn bộ component, dữ liệu mẫu và điều hướng
│   └── styles.css       Hệ thống giao diện và responsive
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

## Lưu ý

Đây là prototype giao diện. Dữ liệu đăng nhập, câu hỏi, kết quả và bảng xếp hạng đang được khai báo trực tiếp trong mã nguồn. Khi phát triển phiên bản chính thức, có thể tách component, bổ sung API/backend và kết nối cơ sở dữ liệu.
