import { useEffect, useState } from 'react';

const pageNames = {
  home: 'Trang chủ', student: 'Dashboard học sinh', mode: 'Chọn chế độ', topics: 'Chủ đề ôn tập',
  quiz: 'Làm bài', result: 'Kết quả', review: 'Xem lại đáp án', leaderboard: 'Bảng xếp hạng',
  teacher: 'Giáo viên', admin: 'Quản trị viên'
};

export function useHashPage() {
  const read = () => window.location.hash.replace('#/', '') || 'home';
  const [page, setPage] = useState(read);
  useEffect(() => {
    const handler = () => setPage(read());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  const go = (next) => {
    window.location.hash = `/${next}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return [pageNames[page] ? page : 'home', go];
}
