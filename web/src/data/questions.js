export const questions = [
  {
    id: 1, type: 'single', label: 'Chọn một đáp án',
    text: 'Đâu là chức năng chính của hệ điều hành trên máy tính?',
    options: ['Quản lý phần cứng và phần mềm', 'Chỉ dùng để soạn thảo văn bản', 'Chỉ dùng để truy cập Internet', 'Tạo bài trình chiếu tự động'],
    correct: 0,
    explanation: 'Hệ điều hành quản lý tài nguyên phần cứng, phần mềm và cung cấp môi trường để các ứng dụng hoạt động.'
  },
  {
    id: 2, type: 'multiple', label: 'Chọn nhiều đáp án',
    text: 'Những hành động nào giúp bảo vệ tài khoản trực tuyến?',
    options: ['Bật xác thực hai yếu tố', 'Dùng cùng một mật khẩu cho mọi tài khoản', 'Tạo mật khẩu mạnh và riêng biệt', 'Chia sẻ mã OTP với người hỗ trợ'],
    correct: [0, 2],
    explanation: 'Mật khẩu mạnh, riêng biệt và xác thực hai yếu tố giúp giảm đáng kể nguy cơ tài khoản bị chiếm quyền.'
  },
  {
    id: 3, type: 'boolean', label: 'Bảng Đúng / Sai',
    text: 'Xác định các phát biểu sau là Đúng hay Sai.',
    statements: [
      ['Tệp có thể được lưu trong thư mục.', true],
      ['RAM lưu dữ liệu vĩnh viễn khi tắt máy.', false],
      ['Trình duyệt web là một phần mềm ứng dụng.', true]
    ],
    explanation: 'RAM là bộ nhớ tạm thời; dữ liệu trong RAM thường mất khi thiết bị tắt nguồn.'
  },
  {
    id: 4, type: 'matching', label: 'Kéo thả ghép cặp',
    text: 'Kéo mỗi thuật ngữ vào vị trí phù hợp với mô tả.',
    pairs: [
      ['CPU', 'Xử lý lệnh và dữ liệu'],
      ['RAM', 'Lưu dữ liệu tạm thời'],
      ['SSD', 'Lưu trữ dữ liệu lâu dài']
    ],
    explanation: 'CPU xử lý lệnh, RAM lưu tạm trong phiên làm việc và SSD lưu dữ liệu lâu dài.'
  },
  {
    id: 5, type: 'reorder', label: 'Sắp xếp thứ tự',
    text: 'Sắp xếp đúng quy trình lưu một tài liệu mới.',
    items: ['Chọn thư mục lưu', 'Nhập tên tệp', 'Chọn lệnh Lưu', 'Nhấn nút xác nhận Lưu'],
    correctOrder: ['Chọn lệnh Lưu', 'Chọn thư mục lưu', 'Nhập tên tệp', 'Nhấn nút xác nhận Lưu'],
    explanation: 'Quy trình thông thường là gọi lệnh Lưu, chọn vị trí, đặt tên rồi xác nhận.'
  },
  {
    id: 6, type: 'hotspot', label: 'Chọn vùng trên hình',
    text: 'Hãy chọn nút dùng để đóng cửa sổ trong hình minh họa.',
    correctRegion: { xMin: 88, xMax: 100, yMin: 0, yMax: 14 },
    explanation: 'Nút có biểu tượng X ở góc trên bên phải dùng để đóng cửa sổ.'
  }
];
