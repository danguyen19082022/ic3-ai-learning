import { Logo } from '../common/Logo.jsx';

export function AppFooter({ go }) {
  return <footer><div><Logo/><p>© 2026 IC3 AI Learning · Kỹ năng số cho tương lai.</p></div><div><button onClick={()=>go('student')}>Học tập</button><button onClick={()=>go('leaderboard')}>Bảng xếp hạng</button><button onClick={()=>go('teacher')}>Giáo viên</button><button onClick={()=>go('admin')}>Quản trị viên</button></div></footer>;
}
