import { useState } from 'react';
import { LayoutDashboard, Menu, School, Trophy, X } from 'lucide-react';
import { Logo } from '../common/Logo.jsx';
import { cx } from '../../utils/classNames.js';

export function AppHeader({ page, go, student }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <button className="logo-button" onClick={() => go('home')}><Logo /></button>
      <nav className={cx('top-nav', open && 'open')}>
        <button onClick={() => { go('student'); setOpen(false); }} className={page === 'student' ? 'active' : ''}><LayoutDashboard size={17} /> Học tập</button>
        <button onClick={() => { go('leaderboard'); setOpen(false); }} className={page === 'leaderboard' ? 'active' : ''}><Trophy size={17} /> Xếp hạng</button>
        <button onClick={() => { go('teacher'); setOpen(false); }} className={page === 'teacher' ? 'active' : ''}><School size={17} /> Giáo viên</button>
      </nav>
      <div className="header-actions">
        {student && page !== 'home' && <div className="student-chip"><span>NA</span><div><b>{student.name}</b><small>{student.className}</small></div></div>}
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Mở menu">{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}
