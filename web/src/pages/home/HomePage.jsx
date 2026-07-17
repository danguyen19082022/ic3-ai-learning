import { useState } from 'react';
import { Bot, Building2, ChevronDown, Clock3, KeyRound, Layers3, LockKeyhole, LogIn, School, ShieldCheck, Sparkles, Target, TrendingUp, UserCog, UserRound, Users } from 'lucide-react';
import { schools, grades, classMap, studentNames } from '../../data/schools.js';
import { leaderboardRows } from '../../data/leaderboard.js';
import { RobotBuddy } from '../../components/common/RobotBuddy.jsx';
import { RankBadge } from '../../components/common/RankBadge.jsx';
import { cx } from '../../utils/classNames.js';

function TechBackdrop() {
  return <div className="tech-backdrop" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>;
}

function SelectField({ label, icon: Icon, value, onChange, disabled, children }) {
  return (
    <label className={cx('field', disabled && 'disabled')}>
      <span>{label}</span>
      <div className="select-wrap">
        <Icon size={18} />
        <select value={value} onChange={onChange} disabled={disabled}>{children}</select>
        <ChevronDown className="select-chevron" size={17} />
      </div>
    </label>
  );
}


function LeaderboardPreview() {
  return (
    <section className="ranking-card home-ranking">
      <div className="section-heading">
        <div><span className="eyebrow"><Sparkles size={14} /> Thành tích nổi bật</span><h2>Bảng xếp hạng tuần</h2></div>
        <span className="live-dot">Đang cập nhật</span>
      </div>
      <div className="rank-list">
        {leaderboardRows.slice(0, 5).map((row, i) => (
          <div className={cx('rank-row', i < 3 && 'is-top')} key={row.name}>
            <RankBadge rank={i + 1} />
            <div className="rank-avatar">{row.name.split(' ').slice(-1)[0][0]}</div>
            <div className="rank-person"><strong>{row.name}</strong><small>{row.school} · {row.className}</small></div>
            <div className="rank-score"><b>{row.score}</b><small><Clock3 size={12} /> {row.time}</small></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LoginPanel({ onLogin, go, setToast }) {
  const [form, setForm] = useState({ school: '', grade: '', className: '', name: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const update = (key, value) => {
    const resets = key === 'school' ? { grade: '', className: '', name: '' } : key === 'grade' ? { className: '', name: '' } : key === 'className' ? { name: '' } : {};
    setForm((old) => ({ ...old, ...resets, [key]: value }));
  };
  const submit = (e) => {
    e.preventDefault();
    if (!form.school || !form.grade || !form.className || !form.name || !form.password) {
      setToast({ type: 'error', text: 'Vui lòng hoàn thành đầy đủ thông tin đăng nhập.' }); return;
    }
    onLogin(form); go('student');
  };
  return (
    <section className="login-card">
      <div className="login-title">
        <div className="login-icon"><UserRound size={23} /></div>
        <div><span className="eyebrow">Khu vực học sinh</span><h1>Chào mừng trở lại!</h1><p>Đăng nhập để tiếp tục hành trình chinh phục IC3.</p></div>
      </div>
      <form onSubmit={submit}>
        <SelectField label="Trường" icon={Building2} value={form.school} onChange={(e) => update('school', e.target.value)}>
          <option value="">Chọn trường của bạn</option>{schools.map((v) => <option key={v}>{v}</option>)}
        </SelectField>
        <div className="form-grid">
          <SelectField label="Khối" icon={Layers3} disabled={!form.school} value={form.grade} onChange={(e) => update('grade', e.target.value)}>
            <option value="">Chọn khối</option>{grades.map((v) => <option key={v}>{v}</option>)}
          </SelectField>
          <SelectField label="Lớp" icon={School} disabled={!form.grade} value={form.className} onChange={(e) => update('className', e.target.value)}>
            <option value="">Chọn lớp</option>{(classMap[form.grade] || []).map((v) => <option key={v}>{v}</option>)}
          </SelectField>
        </div>
        <SelectField label="Họ và tên" icon={UserRound} disabled={!form.className} value={form.name} onChange={(e) => update('name', e.target.value)}>
          <option value="">Chọn tên học sinh</option>{studentNames.map((v) => <option key={v}>{v}</option>)}
        </SelectField>
        <label className="field"><span>Mật khẩu</span><div className="password-wrap"><LockKeyhole size={18} /><input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Nhập mật khẩu được cấp"/><button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? 'Ẩn' : 'Hiện'}</button></div></label>
        <button className="primary-button login-button" type="submit"><LogIn size={20} /> Đăng nhập</button>
        <div className="login-help"><KeyRound size={16} /><span>Mật khẩu dùng thử: <b>123456</b></span></div>
      </form>
    </section>
  );
}

export function HomePage({ go, onLogin, setToast }) {
  const stats = [
    [Building2, '03', 'Trường tham gia', 'blue'], [School, '18', 'Lớp đang học', 'violet'],
    [Users, '528', 'Học sinh', 'cyan'], [Target, '87%', 'Tỉ lệ đạt', 'green']
  ];
  return (
    <main className="home-page">
      <TechBackdrop />
      <div className="home-hero page-shell">
        <div className="hero-copy"><span className="eyebrow"><Bot size={14} /> Học tập được hỗ trợ bởi AI</span><h1>Kỹ năng số vững vàng.<br/><em>Tương lai rộng mở.</em></h1><p>Luyện tập IC3 theo lộ trình rõ ràng, theo dõi tiến bộ và tự tin trước mỗi kỳ thi.</p></div>
        <div className="floating-robot"><RobotBuddy /><span><Sparkles size={14} /> Sẵn sàng học chưa?</span></div>
        <div className="home-grid"><LeaderboardPreview /><LoginPanel onLogin={onLogin} go={go} setToast={setToast} /></div>
        <div className="home-stats">{stats.map(([Icon, value, label, color]) => <article key={label} className="stat-card"><span className={`stat-icon ${color}`}><Icon size={22} /></span><div><strong>{value}</strong><small>{label}</small></div><TrendingUp size={17} className="stat-trend" /></article>)}</div>
        <div className="portal-strip"><div><ShieldCheck size={19}/><span><b>Khu vực quản lý</b><small>Dành cho giáo viên và quản trị viên</small></span></div><div><button className="ghost-button" onClick={() => go('teacher')}><School size={17}/> Giáo viên</button><button className="ghost-button" onClick={() => go('admin')}><UserCog size={17}/> Quản trị viên</button></div></div>
      </div>
    </main>
  );
}
