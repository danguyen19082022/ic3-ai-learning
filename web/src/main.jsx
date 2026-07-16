import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Award, BarChart3, BookOpen, Bot, BrainCircuit, Building2, CalendarDays,
  Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  ClipboardCheck, Clock3, Download, FileQuestion, Filter, Flag, GraduationCap,
  GripVertical, Home, KeyRound, Layers3, LayoutDashboard, ListChecks, LockKeyhole,
  LogIn, LogOut, Medal, Menu, MousePointer2, PanelLeftOpen, Pencil, Play,
  Plus, RefreshCcw, RotateCcw, School, Search, Settings2, ShieldCheck, Sparkles,
  Target, TimerReset, TrendingUp, Trophy, Upload, UserCog, UserRound, Users,
  X, XCircle
} from 'lucide-react';
import './styles.css';

const schools = ['THCS Nguyễn Trãi', 'THCS Lê Quý Đôn', 'THCS Trần Hưng Đạo'];
const grades = ['Khối 6', 'Khối 7', 'Khối 8'];
const classMap = {
  'Khối 6': ['6A1', '6A2'],
  'Khối 7': ['7A1', '7A2'],
  'Khối 8': ['8A1', '8A2']
};
const studentNames = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Minh C', 'Phạm Gia Hân', 'Hoàng Đức Anh'];

const leaderboardRows = [
  { name: 'Phạm Gia Hân', school: 'THCS Nguyễn Trãi', grade: 'Khối 7', className: '7A1', score: 960, time: '18:42', date: '16/07/2026', mode: 'Thi thử' },
  { name: 'Hoàng Đức Anh', school: 'THCS Lê Quý Đôn', grade: 'Khối 8', className: '8A2', score: 940, time: '17:55', date: '16/07/2026', mode: 'Thi thử' },
  { name: 'Trần Thị B', school: 'THCS Trần Hưng Đạo', grade: 'Khối 6', className: '6A1', score: 940, time: '21:08', date: '15/07/2026', mode: 'Thi thử' },
  { name: 'Lê Minh C', school: 'THCS Nguyễn Trãi', grade: 'Khối 8', className: '8A1', score: 910, time: '22:31', date: '15/07/2026', mode: 'Ôn tập' },
  { name: 'Nguyễn Văn A', school: 'THCS Lê Quý Đôn', grade: 'Khối 6', className: '6A2', score: 890, time: '24:10', date: '14/07/2026', mode: 'Thi thử' },
  { name: 'Võ Minh Khang', school: 'THCS Nguyễn Trãi', grade: 'Khối 7', className: '7A2', score: 870, time: '26:04', date: '13/07/2026', mode: 'Thi thử' },
  { name: 'Đỗ Khánh Linh', school: 'THCS Trần Hưng Đạo', grade: 'Khối 8', className: '8A1', score: 850, time: '25:46', date: '12/07/2026', mode: 'Ôn tập' }
];

const questions = [
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
    explanation: 'Nút có biểu tượng X ở góc trên bên phải dùng để đóng cửa sổ.'
  }
];

const pageNames = {
  home: 'Trang chủ', student: 'Dashboard học sinh', mode: 'Chọn chế độ', topics: 'Chủ đề ôn tập',
  quiz: 'Làm bài', result: 'Kết quả', review: 'Xem lại đáp án', leaderboard: 'Bảng xếp hạng',
  teacher: 'Giáo viên', admin: 'Quản trị viên'
};

function cx(...classes) { return classes.filter(Boolean).join(' '); }

function useHashPage() {
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

function Logo({ compact = false }) {
  return (
    <div className="brand">
      <div className="brand-mark"><BrainCircuit size={25} /></div>
      {!compact && <div><strong>IC3 <span>AI</span> Learning</strong><small>Học thông minh · Vững kỹ năng số</small></div>}
    </div>
  );
}

function RobotBuddy({ small = false }) {
  return (
    <div className={cx('robot-buddy', small && 'robot-small')} aria-hidden="true">
      <div className="robot-antenna"><span /></div>
      <div className="robot-head">
        <div className="robot-face"><i /><i /></div>
        <div className="robot-mouth" />
      </div>
      <div className="robot-body"><BrainCircuit size={small ? 17 : 25} /></div>
      <div className="robot-shadow" />
    </div>
  );
}

function AppHeader({ page, go, student }) {
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

function RankBadge({ rank }) {
  const icons = [<Trophy size={16} />, <Medal size={16} />, <Award size={16} />];
  return <span className={cx('rank-badge', rank <= 3 && `top-${rank}`)}>{icons[rank - 1] || rank}</span>;
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

function HomePage({ go, onLogin, setToast }) {
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

function PageIntro({ eyebrow, title, text, action }) {
  return <div className="page-intro"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{text && <p>{text}</p>}</div>{action}</div>;
}

function StudentDashboard({ go, student }) {
  const s = student || { name: 'Nguyễn Văn A', school: schools[0], grade: 'Khối 6', className: '6A1' };
  const miniStats = [[Award, '860', 'Điểm gần nhất', 'blue'], [ClipboardCheck, '12', 'Bài đã làm', 'violet'], [BookOpen, '8/12', 'Chủ đề đã luyện', 'cyan'], [TrendingUp, '72%', 'Tiến độ học tập', 'green']];
  return (
    <main className="student-page page-shell">
      <section className="student-welcome">
        <div className="welcome-main"><span className="eyebrow"><Sparkles size={14}/> Chào buổi sáng</span><h1>Xin chào, {s.name}!</h1><p>Mỗi bài luyện hôm nay là một bước gần hơn tới chứng chỉ IC3.</p><div className="student-meta"><span><Building2 size={16}/>{s.school}</span><span><Layers3 size={16}/>{s.grade}</span><span><School size={16}/>{s.className}</span></div></div>
        <div className="welcome-progress"><div className="progress-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"/><circle className="ring-value" cx="60" cy="60" r="50"/></svg><div><b>72%</b><small>Tiến độ</small></div></div><RobotBuddy small /></div>
      </section>
      <div className="dashboard-stats">{miniStats.map(([Icon, value, label, color]) => <article key={label} className="mini-stat"><span className={`stat-icon ${color}`}><Icon size={21}/></span><div><strong>{value}</strong><small>{label}</small></div></article>)}</div>
      <section className="learn-section"><div className="section-heading"><div><span className="eyebrow">Bắt đầu học</span><h2>Hôm nay bạn muốn làm gì?</h2></div><span className="streak-pill"><Sparkles size={15}/> Chuỗi 5 ngày</span></div>
        <div className="learning-actions">
          <button className="learning-card practice" onClick={() => go('topics')}><span className="learning-icon"><BookOpen/></span><div><span className="card-kicker">Học theo chủ đề</span><h3>Ôn tập</h3><p>Củng cố kiến thức với toàn bộ câu hỏi theo từng chủ đề.</p><b>Bắt đầu ôn tập <ChevronRight size={18}/></b></div><span className="card-number">01</span></button>
          <button className="learning-card exam" onClick={() => go('mode')}><span className="learning-icon"><TimerReset/></span><div><span className="card-kicker">Mô phỏng kỳ thi</span><h3>Thi thử</h3><p>Thử sức với 45 câu hỏi ngẫu nhiên trong thời gian 50 phút.</p><b>Vào phòng thi <ChevronRight size={18}/></b></div><span className="card-number">02</span></button>
        </div>
      </section>
      <section className="recent-panel"><div className="section-heading"><div><span className="eyebrow">Hoạt động gần đây</span><h2>Tiếp tục hành trình</h2></div><button className="text-button" onClick={() => go('result')}>Xem kết quả <ChevronRight size={16}/></button></div><div className="recent-row"><span className="recent-icon"><FileQuestion/></span><div><strong>Chủ đề 2 · Kỹ năng máy tính</strong><small>Hoàn thành hôm qua · 38/45 câu đúng</small></div><div className="recent-score"><b>860</b><small>điểm</small></div><button className="icon-button" onClick={() => go('topics')}><Play size={18}/></button></div></section>
    </main>
  );
}

function ModePage({ go, setQuizMode }) {
  const choose = (mode) => { setQuizMode(mode); go(mode === 'Ôn tập' ? 'topics' : 'quiz'); };
  return <main className="content-page page-shell"><PageIntro eyebrow="Lộ trình học tập" title="Chọn chế độ phù hợp với bạn" text="Ôn chắc kiến thức theo chủ đề hoặc kiểm tra năng lực trong môi trường mô phỏng kỳ thi."/><div className="mode-grid">
    <button className="mode-card practice-mode" onClick={() => choose('Ôn tập')}><div className="mode-visual"><BookOpen size={44}/><span className="orbit-dot"/></div><span className="mode-tag">Linh hoạt theo chủ đề</span><h2>Chế độ Ôn tập</h2><p>Làm toàn bộ câu hỏi trong chủ đề bạn chọn. Kết quả được hiển thị sau khi hoàn thành.</p><ul><li><Check size={16}/> Tự chọn chủ đề</li><li><Check size={16}/> Có giới hạn thời gian</li><li><Check size={16}/> Theo dõi tiến bộ từng phần</li></ul><b className="mode-cta">Chọn Ôn tập <ChevronRight size={19}/></b></button>
    <button className="mode-card exam-mode" onClick={() => choose('Thi thử')}><div className="recommended"><Sparkles size={14}/> Khuyến nghị</div><div className="mode-visual"><TimerReset size={44}/><span className="orbit-dot"/></div><span className="mode-tag">Mô phỏng kỳ thi thật</span><h2>Chế độ Thi thử</h2><p>Câu hỏi ngẫu nhiên đúng khối, có đồng hồ đếm ngược và xếp hạng sau khi hoàn thành.</p><ul><li><Check size={16}/> 40–45 câu ngẫu nhiên</li><li><Check size={16}/> Thời gian 50 phút</li><li><Check size={16}/> Ghi nhận bảng xếp hạng</li></ul><b className="mode-cta">Bắt đầu Thi thử <ChevronRight size={19}/></b></button>
  </div><div className="mode-note"><CircleHelp size={18}/><p><b>Gợi ý:</b> Nếu bạn mới bắt đầu, hãy ôn từng chủ đề trước khi làm bài thi thử.</p></div></main>;
}

function TopicsPage({ go, setQuizMode }) {
  const topicData = [['Chủ đề 1', 18, 'Nền tảng máy tính'], ['Chủ đề 2', 24, 'Ứng dụng văn phòng'], ['Chủ đề 3', 20, 'Cuộc sống trực tuyến']];
  return <main className="content-page page-shell"><PageIntro eyebrow="Ôn tập · Khối 6" title="Chọn chủ đề ôn tập" text="Mỗi chủ đề gồm toàn bộ câu hỏi thuộc phạm vi kiến thức tương ứng." action={<div className="grade-chip"><Layers3 size={17}/> Khối 6 <ChevronDown size={15}/></div>}/><div className="topics-grid">{topicData.map(([title, count, subtitle], i) => <button className="topic-card" key={title} onClick={() => {setQuizMode('Ôn tập'); go('quiz');}}><div className={`topic-art art-${i+1}`}><span>0{i+1}</span><div><BrainCircuit/><i/><i/></div></div><div className="topic-content"><span className="topic-subtitle">{subtitle}</span><h2>{title}</h2><div className="topic-bottom"><span><ListChecks size={17}/><b>{count}</b> câu hỏi</span><span className="round-arrow"><ChevronRight/></span></div></div></button>)}</div><div className="topics-tip"><Bot size={22}/><div><b>Mẹo học hiệu quả</b><p>Hoàn thành từng chủ đề và xem lại đáp án sai trước khi chuyển sang bài thi thử.</p></div></div></main>;
}

function QuizOption({ selected, multi, children, onClick, state }) {
  return <button className={cx('answer-option', selected && 'selected', state)} onClick={onClick}><span className={multi ? 'checkbox-ui' : 'radio-ui'}>{selected && <Check size={15}/>}</span><span>{children}</span></button>;
}

function QuestionContent({ q, answer, setAnswer, review = false }) {
  if (q.type === 'single') return <div className="options-list">{q.options.map((opt, i) => <QuizOption key={opt} selected={review ? i === answer || i === q.correct : answer === i} state={review ? (i === q.correct ? 'correct' : i === answer ? 'wrong' : '') : ''} onClick={() => !review && setAnswer(i)}>{opt}{review && i === q.correct && <em>Đáp án đúng</em>}{review && i === answer && i !== q.correct && <em>Bạn đã chọn</em>}</QuizOption>)}</div>;
  if (q.type === 'multiple') {
    const values = Array.isArray(answer) ? answer : [];
    return <div className="options-list">{q.options.map((opt, i) => { const selected = values.includes(i); const isCorrect = q.correct.includes(i); return <QuizOption multi key={opt} selected={review ? selected || isCorrect : selected} state={review ? (isCorrect ? 'correct' : selected ? 'wrong' : '') : ''} onClick={() => !review && setAnswer(selected ? values.filter(v => v !== i) : [...values, i])}>{opt}{review && isCorrect && <em>Đáp án đúng</em>}{review && selected && !isCorrect && <em>Bạn đã chọn</em>}</QuizOption>;})}</div>;
  }
  if (q.type === 'boolean') {
    const values = answer || {};
    return <div className="boolean-table"><div className="boolean-head"><span>Phát biểu</span><b>Đúng</b><b>Sai</b></div>{q.statements.map(([text, correct], i) => <div className="boolean-row" key={text}><span>{text}</span>{[true, false].map(v => <button key={String(v)} disabled={review} className={cx('boolean-choice', values[i] === v && 'selected', review && v === correct && 'correct', review && values[i] === v && v !== correct && 'wrong')} onClick={() => setAnswer({...values, [i]: v})}><i>{values[i] === v && <Check size={16}/>}</i><small>{v ? 'Đúng' : 'Sai'}</small></button>)}</div>)}</div>;
  }
  if (q.type === 'matching') {
    const values = answer || {};
    const used = Object.values(values);
    return <div className="matching-board"><div className="matching-pool">{q.pairs.map(([term]) => !used.includes(term) && <div draggable={!review} onDragStart={e => e.dataTransfer.setData('text/plain', term)} className="drag-token" key={term}><GripVertical size={18}/><b>{term}</b></div>)}</div><div className="matching-slots">{q.pairs.map(([, desc], i) => <React.Fragment key={desc}><button className={cx('drop-slot', values[i] && 'filled', review && values[i] === q.pairs[i][0] && 'correct', review && values[i] && values[i] !== q.pairs[i][0] && 'wrong')} onDragOver={e => e.preventDefault()} onDrop={e => !review && setAnswer({...values, [i]: e.dataTransfer.getData('text/plain')})}>{values[i] || ''}</button><div className="match-description">{desc}</div></React.Fragment>)}</div></div>;
  }
  if (q.type === 'reorder') {
    const values = Array.isArray(answer) && answer.length ? answer : q.items;
    const move = (from, to) => { if (review) return; const next = [...values]; const [item] = next.splice(from, 1); next.splice(to, 0, item); setAnswer(next); };
    return <div className="reorder-list">{values.map((item, i) => <div className={cx('reorder-item', review && item === q.correctOrder[i] ? 'correct' : review ? 'wrong' : '')} draggable={!review} onDragStart={e => e.dataTransfer.setData('text/plain', String(i))} onDragOver={e => e.preventDefault()} onDrop={e => move(Number(e.dataTransfer.getData('text/plain')), i)} key={item}><span>{i + 1}</span><GripVertical size={19}/><b>{item}</b></div>)}</div>;
  }
  if (q.type === 'hotspot') {
    const selected = answer;
    return <div className="hotspot-wrap"><div className="mock-window" onClick={(e) => { if (review) return; const r=e.currentTarget.getBoundingClientRect(); setAnswer({x:((e.clientX-r.left)/r.width)*100,y:((e.clientY-r.top)/r.height)*100});}}><div className="mock-titlebar"><span><i/><i/><i/></span><div>IC3 Practice Document</div><b>—　□　<span>×</span></b></div><div className="mock-toolbar"><span/><span/><span/><span/><span/></div><div className="mock-document"><div/><div/><div className="short"/><section><i/><i/><i/></section></div>{selected && <span className="hotspot-marker" style={{left:`${selected.x}%`,top:`${selected.y}%`}}><MousePointer2 size={20}/></span>}{review && <span className="correct-hotspot">Vùng đúng</span>}</div><p className="hotspot-hint"><MousePointer2 size={16}/> Bấm trực tiếp vào vùng bạn chọn trên hình.</p></div>;
  }
  return null;
}

function QuizPage({ go, quizMode, setResultData }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [drawer, setDrawer] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [seconds, setSeconds] = useState(quizMode === 'Thi thử' ? 50 * 60 : 30 * 60);
  const q = questions[index];
  const next = () => setIndex(i => Math.min(questions.length - 1, i + 1));
  const prev = () => setIndex(i => Math.max(0, i - 1));
  useEffect(() => { const id = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000); return () => clearInterval(id); }, []);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'PageUp') { e.preventDefault(); next(); } if (e.key === 'PageDown') { e.preventDefault(); prev(); } };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const finish = () => { setResultData({ score: 860, correct: 38, wrong: 7, time: quizMode === 'Thi thử' ? '32:18' : '18:42', mode: quizMode }); setConfirm(false); go('result'); };
  return <main className="quiz-page"><div className="quiz-topbar"><button className="quiz-logo" onClick={() => go('student')}><Logo compact/></button><div className="quiz-progress"><div><span>Câu {index + 1} / {questions.length}</span><b>{Math.round(((index+1)/questions.length)*100)}%</b></div><div className="progress-track"><i style={{width:`${((index+1)/questions.length)*100}%`}}/></div></div><div className="quiz-tools"><span className="timer-pill"><Clock3 size={18}/><div><small>Thời gian còn lại</small><b>{formatTime(seconds)}</b></div></span><button className="outline-button" onClick={() => setDrawer(true)}><PanelLeftOpen size={18}/><span>Mục lục</span></button></div></div>
    <div className="quiz-workspace"><section className="question-card"><div className="question-meta"><span className="question-number">Câu {index + 1}</span><span className="question-type">{q.label}</span><button><Flag size={16}/> Đánh dấu</button></div><h1>{q.text}</h1><QuestionContent q={q} answer={answers[q.id]} setAnswer={(value) => setAnswers(old => ({...old, [q.id]: value}))}/></section>
      <div className="quiz-bottom"><button className="reset-button" onClick={() => setAnswers(old => ({...old, [q.id]: undefined}))}><RotateCcw size={18}/> Đặt lại</button><div><button className="secondary-button" onClick={prev} disabled={index === 0}><ChevronLeft size={18}/> Trước</button>{index < questions.length - 1 ? <button className="primary-button" onClick={next}>Tiếp <ChevronRight size={18}/></button> : <button className="submit-button" onClick={() => setConfirm(true)}><ClipboardCheck size={18}/> Nộp bài</button>}</div></div>
      <div className="keyboard-hint"><span><kbd>PageDown</kbd> Trước</span><span><kbd>PageUp</kbd> Tiếp</span></div>
    </div>
    {drawer && <div className="overlay" onClick={() => setDrawer(false)}><aside className="question-drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">Tiến độ bài làm</span><h2>Mục lục câu hỏi</h2></div><button className="icon-button" onClick={() => setDrawer(false)}><X/></button></div><div className="drawer-legend"><span><i className="done"/>Đã trả lời</span><span><i/>Chưa trả lời</span></div><div className="question-grid">{questions.map((item, i) => <button key={item.id} className={cx(i === index && 'current', answers[item.id] !== undefined && 'answered')} onClick={() => {setIndex(i);setDrawer(false);}}>{i+1}</button>)}</div><div className="drawer-summary"><b>{Object.values(answers).filter(v => v !== undefined).length}/{questions.length}</b><span>Câu đã trả lời</span></div></aside></div>}
    {confirm && <div className="overlay modal-overlay"><div className="confirm-modal"><div className="modal-icon"><ClipboardCheck/></div><h2>Xác nhận nộp bài?</h2><p>Bạn đã trả lời <b>{Object.values(answers).filter(v => v !== undefined).length}/{questions.length}</b> câu. Sau khi nộp, bạn không thể thay đổi đáp án.</p><div className="modal-actions"><button className="secondary-button" onClick={() => setConfirm(false)}>Tiếp tục làm</button><button className="submit-button" onClick={finish}>Xác nhận nộp</button></div></div></div>}
  </main>;
}

function ScoreRing({ score }) {
  return <div className="score-ring"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="68"/><circle className="score-value" cx="80" cy="80" r="68"/></svg><div><span>Điểm số</span><strong>{score}</strong><small>/ 1000</small></div></div>;
}

function MiniLineChart() {
  return <div className="chart-wrap"><div className="chart-y"><span>1000</span><span>750</span><span>500</span></div><svg viewBox="0 0 600 180" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f6fed" stopOpacity=".24"/><stop offset="1" stopColor="#2f6fed" stopOpacity="0"/></linearGradient></defs><line x1="0" x2="600" y1="20" y2="20"/><line x1="0" x2="600" y1="90" y2="90"/><line x1="0" x2="600" y1="160" y2="160"/><path className="chart-area" d="M10 132 C80 122,105 132,150 105 S245 92,300 82 S390 100,445 62 S520 45,590 34 L590 170 L10 170Z"/><path className="chart-line" d="M10 132 C80 122,105 132,150 105 S245 92,300 82 S390 100,445 62 S520 45,590 34"/>{[[10,132],[150,105],[300,82],[445,62],[590,34]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5"/>)}</svg><div className="chart-x"><span>Lần 1</span><span>Lần 2</span><span>Lần 3</span><span>Lần 4</span><span>Lần 5</span></div></div>;
}

function ResultPage({ go, resultData }) {
  const r = resultData || { score: 860, correct: 38, wrong: 7, time: '32:18', mode: 'Thi thử' };
  const history = [
    ['16/07/2026', 'Thi thử', 'Toàn bộ Khối 6', 860, '32:18'], ['14/07/2026', 'Ôn tập', 'Chủ đề 2', 810, '21:05'],
    ['12/07/2026', 'Thi thử', 'Toàn bộ Khối 6', 780, '40:22'], ['09/07/2026', 'Ôn tập', 'Chủ đề 1', 720, '18:46'], ['07/07/2026', 'Thi thử', 'Toàn bộ Khối 6', 680, '45:10']
  ];
  return <main className="result-page page-shell"><section className="result-hero"><div className="result-message"><span className="eyebrow"><Sparkles size={14}/> Hoàn thành bài làm</span><h1>Tiến bộ rất tốt!</h1><p>Bạn đã nắm vững phần lớn kiến thức. Hãy xem lại các câu sai để bứt phá ở lần tiếp theo.</p><div className="result-actions"><button className="primary-button" onClick={() => go('quiz')}><RefreshCcw size={18}/> Làm lại</button><button className="secondary-button" onClick={() => go('review')}><ListChecks size={18}/> Xem lại đáp án</button><button className="text-button" onClick={() => go('student')}><Home size={17}/> Về Dashboard</button></div></div><ScoreRing score={r.score}/><div className="result-spark"><Bot size={34}/></div></section>
    <div className="result-metrics"><article><span className="metric-icon green"><CheckCircle2/></span><div><strong>{r.correct}</strong><small>Câu đúng</small></div></article><article><span className="metric-icon red"><XCircle/></span><div><strong>{r.wrong}</strong><small>Câu sai</small></div></article><article><span className="metric-icon blue"><Clock3/></span><div><strong>{r.time}</strong><small>Thời gian</small></div></article><article><span className="metric-icon violet"><FileQuestion/></span><div><strong>{r.mode}</strong><small>Toàn bộ Khối 6</small></div></article></div>
    <section className="history-section"><div className="section-heading"><div><span className="eyebrow">Phân tích tiến bộ</span><h2>5 lần làm bài gần nhất</h2></div><span className="growth-badge"><TrendingUp size={16}/> +180 điểm</span></div><MiniLineChart/><div className="history-table"><div className="table-head"><span>Ngày làm</span><span>Chế độ</span><span>Phạm vi</span><span>Điểm</span><span>Thời gian</span></div>{history.map((row,i)=><div className="table-row" key={row[0]}>{row.map((cell,j)=><span key={j} data-label={['Ngày làm','Chế độ','Phạm vi','Điểm','Thời gian'][j]} className={j===3?'score-cell':''}>{j===1?<b className={cell==='Thi thử'?'exam-pill':'practice-pill'}>{cell}</b>:cell}</span>)}</div>)}</div></section></main>;
}

function ReviewPage({ go }) {
  const [index, setIndex] = useState(0); const q = questions[index];
  const sampleAnswers = {1:1, 2:[0,2], 3:{0:true,1:true,2:true}, 4:{0:'CPU',1:'SSD',2:'RAM'}, 5:q?.items, 6:{x:82,y:10}};
  return <main className="review-page"><div className="review-topbar"><button className="back-button" onClick={() => go('result')}><ChevronLeft/> Quay lại kết quả</button><div><span className="eyebrow">Xem lại đáp án</span><h2>Câu {index+1} / {questions.length}</h2></div><div className="review-status"><span><i className={index===0?'wrong':'correct'}/>{index===0?'Trả lời sai':'Trả lời đúng'}</span></div></div><div className="review-workspace"><section className="question-card"><div className="question-meta"><span className="question-number">Câu {index+1}</span><span className="question-type">{q.label}</span></div><h1>{q.text}</h1><QuestionContent q={q} answer={sampleAnswers[q.id]} setAnswer={()=>{}} review/><div className="explanation-box"><span><BrainCircuit size={22}/></span><div><b>Giải thích đáp án</b><p>{q.explanation}</p></div></div></section><div className="review-bottom"><button className="secondary-button" onClick={()=>setIndex(i=>Math.max(0,i-1))} disabled={index===0}><ChevronLeft/> Trước</button><div className="review-dots">{questions.map((_,i)=><button key={i} className={cx(i===index&&'active', i===0?'wrong':'correct')} onClick={()=>setIndex(i)}>{i+1}</button>)}</div>{index<questions.length-1?<button className="primary-button" onClick={()=>setIndex(i=>i+1)}>Tiếp <ChevronRight/></button>:<button className="primary-button" onClick={()=>go('student')}>Hoàn tất <Check/></button>}</div></div></main>;
}

function Filters({ filters, setFilters }) {
  const set = (key, value) => setFilters({...filters, [key]:value});
  return <div className="filter-bar"><div className="filter-title"><Filter size={18}/><b>Bộ lọc</b></div><select value={filters.school} onChange={e=>set('school',e.target.value)}><option>Tất cả trường</option>{schools.map(x=><option key={x}>{x}</option>)}</select><select value={filters.grade} onChange={e=>set('grade',e.target.value)}><option>Tất cả khối</option>{grades.map(x=><option key={x}>{x}</option>)}</select><select value={filters.className} onChange={e=>set('className',e.target.value)}><option>Tất cả lớp</option>{Object.values(classMap).flat().map(x=><option key={x}>{x}</option>)}</select><select value={filters.period} onChange={e=>set('period',e.target.value)}><option>Tuần</option><option>Ngày</option><option>Tháng</option><option>Tất cả</option></select><select value={filters.mode} onChange={e=>set('mode',e.target.value)}><option>Thi thử</option><option>Ôn tập</option><option>Tất cả</option></select><button className="reset-filter" onClick={()=>setFilters({school:'Tất cả trường',grade:'Tất cả khối',className:'Tất cả lớp',period:'Tuần',mode:'Thi thử'})}><RotateCcw size={16}/> Đặt lại</button></div>;
}

function LeaderboardPage() {
  const [filters,setFilters]=useState({school:'Tất cả trường',grade:'Tất cả khối',className:'Tất cả lớp',period:'Tuần',mode:'Thi thử'});
  const rows=useMemo(()=>leaderboardRows.filter(r=>(filters.school==='Tất cả trường'||r.school===filters.school)&&(filters.grade==='Tất cả khối'||r.grade===filters.grade)&&(filters.className==='Tất cả lớp'||r.className===filters.className)&&(filters.mode==='Tất cả'||r.mode===filters.mode)).sort((a,b)=>b.score-a.score||a.time.localeCompare(b.time)),[filters]);
  return <main className="content-page leaderboard-page page-shell"><PageIntro eyebrow="Vinh danh thành tích" title="Bảng xếp hạng IC3" text="Điểm cao hơn được xếp trước; nếu bằng điểm, thời gian hoàn thành nhanh hơn sẽ xếp trên." action={<span className="live-dot">Cập nhật hôm nay</span>}/><section className="leaderboard-podium">{leaderboardRows.slice(0,3).map((r,i)=><article key={r.name} className={`podium-card podium-${i+1}`}><RankBadge rank={i+1}/><div className="podium-avatar">{r.name.split(' ').slice(-1)[0][0]}</div><div><b>{r.name}</b><small>{r.school} · {r.className}</small></div><strong>{r.score}<small> điểm</small></strong></article>)}</section><Filters filters={filters} setFilters={setFilters}/><section className="data-card rank-table"><div className="table-head"><span>Hạng</span><span>Học sinh</span><span>Trường</span><span>Khối / Lớp</span><span>Điểm</span><span>Thời gian</span><span>Ngày làm</span></div>{rows.map((r,i)=><div className={cx('table-row',i<3&&'top-row')} key={r.name}><span data-label="Hạng"><RankBadge rank={i+1}/></span><span data-label="Học sinh"><b>{r.name}</b><small>{r.mode}</small></span><span data-label="Trường">{r.school}</span><span data-label="Khối / Lớp">{r.grade} · {r.className}</span><span className="score-cell" data-label="Điểm">{r.score}</span><span data-label="Thời gian"><Clock3 size={14}/>{r.time}</span><span data-label="Ngày làm">{r.date}</span></div>)}</section></main>;
}

const teacherStudents = [
  ['Nguyễn Văn A','6A1','12','860','Đang hoạt động'],['Trần Thị B','6A1','10','940','Đang hoạt động'],['Lê Minh C','6A2','8','910','Đang hoạt động'],['Phạm Gia Hân','7A1','15','960','Đang hoạt động'],['Hoàng Đức Anh','8A2','11','940','Tạm nghỉ']
];

function downloadCsv(name, rows) {
  const content = '\uFEFF' + rows.map(r=>r.join(',')).join('\n');
  const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
}

function AdminShell({ role, active, setActive, go, children }) {
  const teacherMenu = [[LayoutDashboard,'Tổng quan'],[Users,'Lớp & học sinh'],[ClipboardCheck,'Kết quả học tập'],[BarChart3,'Thống kê'],[Download,'Xuất báo cáo']];
  const adminMenu = [[LayoutDashboard,'Tổng quan'],[FileQuestion,'Ngân hàng câu hỏi'],[UserCog,'Giáo viên'],[Users,'Học sinh'],[Building2,'Trường & lớp'],[BookOpen,'Chủ đề'],[Settings2,'Cấu hình bài thi'],[BarChart3,'Báo cáo']];
  const menu = role==='teacher'?teacherMenu:adminMenu;
  return <div className="admin-layout"><aside className="admin-sidebar"><Logo/><div className="role-card"><span>{role==='teacher'?<School/>:<ShieldCheck/>}</span><div><small>Đăng nhập với vai trò</small><b>{role==='teacher'?'Giáo viên':'Quản trị viên'}</b></div></div><nav>{menu.map(([Icon,label])=><button key={label} className={active===label?'active':''} onClick={()=>setActive(label)}><Icon size={19}/>{label}{active===label&&<i/>}</button>)}</nav><button className="logout-button" onClick={()=>go('home')}><LogOut size={18}/> Đăng xuất</button></aside><div className="admin-main">{children}</div></div>;
}

function AdminTop({ title, subtitle, name, onMenu }) {
  return <div className="admin-top"><div><button className="admin-mobile-menu" onClick={onMenu}><Menu/></button><span className="eyebrow">IC3 AI Learning</span><h1>{title}</h1><p>{subtitle}</p></div><div className="admin-user"><button className="icon-button"><CalendarDays size={19}/></button><span>{name[0]}</span><div><b>{name}</b><small>Hôm nay, 16/07/2026</small></div></div></div>;
}

function ManagementStats({ admin=false }) {
  const data=admin?[[Building2,'03','Trường','blue'],[Users,'528','Học sinh','violet'],[FileQuestion,'1.248','Câu hỏi','cyan'],[Target,'87%','Tỉ lệ đạt','green']]:[[School,'06','Lớp phụ trách','blue'],[Users,'186','Học sinh','violet'],[ClipboardCheck,'74','Bài làm tuần này','cyan'],[TrendingUp,'84%','Tỉ lệ đạt','green']];
  return <div className="management-stats">{data.map(([Icon,val,label,color])=><article key={label}><span className={`stat-icon ${color}`}><Icon/></span><div><strong>{val}</strong><small>{label}</small></div><TrendingUp size={16}/></article>)}</div>;
}

function TeacherDashboard({ go, setToast }) {
  const [active,setActive]=useState('Tổng quan'); const [search,setSearch]=useState('');
  const rows=teacherStudents.filter(r=>r[0].toLowerCase().includes(search.toLowerCase()));
  return <AdminShell role="teacher" active={active} setActive={setActive} go={go}><AdminTop title={active} subtitle="Theo dõi lớp học và tiến bộ của học sinh." name="Nguyễn Minh Anh"/><ManagementStats/>
    <div className="management-grid"><section className="data-card class-performance"><div className="section-heading"><div><span className="eyebrow">Hiệu suất lớp học</span><h2>Kết quả theo lớp</h2></div><select><option>Tuần này</option><option>Tháng này</option></select></div>{[['6A1',88,42],['6A2',82,40],['7A1',91,38],['7A2',76,36]].map(([c,p,n])=><div className="performance-row" key={c}><span className="class-icon"><School/></span><div><b>Lớp {c}</b><small>{n} học sinh</small></div><div className="bar"><i style={{width:`${p}%`}}/></div><strong>{p}%</strong></div>)}</section><section className="data-card quick-report"><div className="section-heading"><div><span className="eyebrow">Tổng quan</span><h2>Tiến bộ học tập</h2></div></div><div className="donut"><div><b>84%</b><small>Tỉ lệ đạt</small></div></div><div className="donut-legend"><span><i className="green"/>Đạt yêu cầu <b>156</b></span><span><i className="orange"/>Cần cố gắng <b>30</b></span></div></section></div>
    <section className="data-card students-table"><div className="section-heading"><div><span className="eyebrow">Quản lý lớp học</span><h2>Danh sách học sinh</h2></div><div className="table-actions"><label className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm học sinh..."/></label><button className="outline-button" onClick={()=>downloadCsv('bao-cao-hoc-sinh.csv',[['Họ tên','Lớp','Số bài','Điểm'],...teacherStudents])}><Download size={17}/> Xuất Excel</button></div></div><div className="table-head"><span>Học sinh</span><span>Lớp</span><span>Số bài đã làm</span><span>Điểm gần nhất</span><span>Trạng thái</span><span>Thao tác</span></div>{rows.map((r,i)=><div className="table-row" key={r[0]}><span data-label="Học sinh"><span className="tiny-avatar">{r[0].slice(-1)}</span><b>{r[0]}</b></span><span data-label="Lớp">{r[1]}</span><span data-label="Số bài">{r[2]}</span><span data-label="Điểm" className="score-cell">{r[3]}</span><span data-label="Trạng thái"><b className={r[4]==='Đang hoạt động'?'status-active':'status-pause'}>{r[4]}</b></span><span data-label="Thao tác"><button className="icon-button" title="Reset mật khẩu" onClick={()=>setToast({type:'success',text:`Đã đặt lại mật khẩu mẫu cho ${r[0]}.`})}><KeyRound size={17}/></button><button className="icon-button"><ChevronRight size={17}/></button></span></div>)}</section>
  </AdminShell>;
}

const questionBank=[
  ['IC3-001','Hệ điều hành có chức năng gì?','Single choice','Khối 6','Đang sử dụng'],['IC3-002','Hành động nào bảo vệ tài khoản?','Multiple choice','Khối 6','Đang sử dụng'],['IC3-003','Ghép thiết bị với chức năng','Matching','Khối 7','Cần chỉnh sửa'],['IC3-004','Chọn nút đóng cửa sổ','Hotspot','Khối 8','Tạm ẩn'],['IC3-005','Sắp xếp quy trình lưu tệp','Reorder','Khối 6','Đang sử dụng']
];

function AdminDashboard({ go, setToast }) {
  const [active,setActive]=useState('Tổng quan'); const [showForm,setShowForm]=useState(false);
  return <AdminShell role="admin" active={active} setActive={setActive} go={go}><AdminTop title={active} subtitle="Quản lý dữ liệu và vận hành toàn bộ hệ thống." name="Admin IC3"/><ManagementStats admin/>
    <div className="admin-overview-grid"><section className="data-card system-chart"><div className="section-heading"><div><span className="eyebrow">Hoạt động hệ thống</span><h2>Lượt làm bài trong tuần</h2></div><select><option>7 ngày qua</option><option>30 ngày qua</option></select></div><div className="bar-chart">{[54,72,60,88,76,94,68].map((v,i)=><div key={i}><span style={{height:`${v}%`}}><i>{v}</i></span><small>{['T2','T3','T4','T5','T6','T7','CN'][i]}</small></div>)}</div></section><section className="data-card system-health"><div className="section-heading"><div><span className="eyebrow">Chất lượng dữ liệu</span><h2>Trạng thái câu hỏi</h2></div></div>{[['Đang sử dụng',1135,91,'green'],['Cần chỉnh sửa',72,6,'orange'],['Tạm ẩn',41,3,'gray']].map(([l,n,p,c])=><div className="health-row" key={l}><div><span><i className={c}/>{l}</span><b>{n}</b></div><div className="bar"><i className={c} style={{width:`${p}%`}}/></div></div>)}</section></div>
    <section className="data-card question-table"><div className="section-heading"><div><span className="eyebrow">Ngân hàng dữ liệu</span><h2>Câu hỏi gần đây</h2></div><div className="table-actions"><button className="outline-button" onClick={()=>downloadCsv('ngan-hang-cau-hoi.csv',[['Mã','Câu hỏi','Dạng','Khối','Trạng thái'],...questionBank])}><Download size={17}/> Xuất dữ liệu</button><button className="primary-button small" onClick={()=>setShowForm(true)}><Plus size={17}/> Thêm câu hỏi</button></div></div><div className="table-head"><span>Mã</span><span>Nội dung câu hỏi</span><span>Dạng</span><span>Khối</span><span>Trạng thái</span><span>Thao tác</span></div>{questionBank.map(r=><div className="table-row" key={r[0]}>{r.map((cell,i)=><span key={i} data-label={['Mã','Nội dung','Dạng','Khối','Trạng thái'][i]}>{i===4?<b className={cell==='Đang sử dụng'?'status-active':cell==='Tạm ẩn'?'status-pause':'status-edit'}>{cell}</b>:i===0?<b>{cell}</b>:cell}</span>)}<span data-label="Thao tác"><button className="icon-button" onClick={()=>setShowForm(true)}><Pencil size={16}/></button><button className="icon-button"><ChevronRight size={16}/></button></span></div>)}</section>
    <section className="configuration-strip"><div><span className="config-icon"><Settings2/></span><div><b>Cấu hình bài làm</b><small>Thi thử: 45 câu · 50 phút　|　Ôn tập: 30 phút / chủ đề</small></div></div><button className="outline-button" onClick={()=>setActive('Cấu hình bài thi')}>Điều chỉnh cấu hình <ChevronRight size={17}/></button></section>
    {showForm&&<div className="overlay modal-overlay"><form className="admin-form" onSubmit={e=>{e.preventDefault();setShowForm(false);setToast({type:'success',text:'Đã lưu câu hỏi mẫu vào giao diện prototype.'});}}><div className="drawer-head"><div><span className="eyebrow">Ngân hàng câu hỏi</span><h2>Thêm câu hỏi mới</h2></div><button type="button" className="icon-button" onClick={()=>setShowForm(false)}><X/></button></div><label className="field"><span>Nội dung câu hỏi</span><textarea placeholder="Nhập nội dung câu hỏi..." required/></label><div className="form-grid"><label className="field"><span>Dạng câu hỏi</span><select><option>Single choice</option><option>Multiple choice</option><option>Matching</option><option>Reorder</option><option>Hotspot</option></select></label><label className="field"><span>Khối</span><select>{grades.map(x=><option key={x}>{x}</option>)}</select></label></div><label className="field"><span>Trạng thái</span><select><option>Đang sử dụng</option><option>Tạm ẩn</option><option>Cần chỉnh sửa</option></select></label><div className="upload-box"><Upload/><b>Tải ảnh minh họa hoặc Hotspot</b><small>PNG, JPG · tối đa 5 MB</small></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowForm(false)}>Hủy</button><button className="primary-button" type="submit"><Check/> Lưu câu hỏi</button></div></form></div>}
  </AdminShell>;
}

function Toast({ toast, close }) {
  useEffect(()=>{if(!toast)return;const id=setTimeout(close,3200);return()=>clearTimeout(id);},[toast]);
  if(!toast)return null; return <div className={cx('toast',toast.type)}>{toast.type==='error'?<XCircle/>:<CheckCircle2/>}<span>{toast.text}</span><button onClick={close}><X/></button></div>;
}

function App() {
  const [page, go] = useHashPage();
  const [student, setStudent] = useState({ name:'Nguyễn Văn A', school:'THCS Nguyễn Trãi', grade:'Khối 6', className:'6A1' });
  const [quizMode,setQuizMode]=useState('Thi thử');
  const [resultData,setResultData]=useState(null);
  const [toast,setToast]=useState(null);
  const bare=['quiz','review','teacher','admin'].includes(page);
  let content;
  if(page==='home')content=<HomePage go={go} onLogin={setStudent} setToast={setToast}/>;
  else if(page==='student')content=<StudentDashboard go={go} student={student}/>;
  else if(page==='mode')content=<ModePage go={go} setQuizMode={setQuizMode}/>;
  else if(page==='topics')content=<TopicsPage go={go} setQuizMode={setQuizMode}/>;
  else if(page==='quiz')content=<QuizPage go={go} quizMode={quizMode} setResultData={setResultData}/>;
  else if(page==='result')content=<ResultPage go={go} resultData={resultData}/>;
  else if(page==='review')content=<ReviewPage go={go}/>;
  else if(page==='leaderboard')content=<LeaderboardPage/>;
  else if(page==='teacher')content=<TeacherDashboard go={go} setToast={setToast}/>;
  else if(page==='admin')content=<AdminDashboard go={go} setToast={setToast}/>;
  return <div className="app">{!bare&&<AppHeader page={page} go={go} student={student}/>} {content}{!bare&&<footer><div><Logo/><p>© 2026 IC3 AI Learning · Kỹ năng số cho tương lai.</p></div><div><button onClick={()=>go('student')}>Học tập</button><button onClick={()=>go('leaderboard')}>Bảng xếp hạng</button><button onClick={()=>go('teacher')}>Giáo viên</button><button onClick={()=>go('admin')}>Quản trị viên</button></div></footer>}<Toast toast={toast} close={()=>setToast(null)}/></div>;
}

createRoot(document.getElementById('root')).render(<App />);
