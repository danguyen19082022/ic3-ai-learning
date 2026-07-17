import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Award, BarChart3, BookOpen, Bot, BrainCircuit, Building2, CalendarDays,
  Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  ClipboardCheck, Clock3, Download, FileQuestion, Filter, Flag, GraduationCap,
  GripVertical, Hash, Home, KeyRound, Layers3, LayoutDashboard, ListChecks, LockKeyhole,
  LogIn, LogOut, Medal, Menu, MousePointer2, PanelLeftOpen, Pencil, Play,
  Plus, RefreshCcw, RotateCcw, School, Search, Settings2, ShieldCheck, Sparkles,
  Swords, Target, TimerReset, TrendingUp, Trophy, Upload, UserCog, UserRound, Users,
  X, XCircle, Zap
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
    correctRegion: { xMin: 88, xMax: 100, yMin: 0, yMax: 14 },
    explanation: 'Nút có biểu tượng X ở góc trên bên phải dùng để đóng cửa sổ.'
  }
];

const pageNames = {
  home: 'Trang chủ', student: 'Dashboard học sinh', mode: 'Chọn chế độ', topics: 'Chủ đề ôn tập',
  quiz: 'Làm bài', result: 'Kết quả', review: 'Xem lại đáp án', leaderboard: 'Bảng xếp hạng',
  teacher: 'Giáo viên', admin: 'Quản trị viên'
};

const topicCatalog = [
  { id: 'topic-1', name: 'Nền tảng máy tính', questionCount: 18, grade: 'Khối 6', displayOrder: 1, status: 'active', theme: 'blue', description: 'Kiến thức cơ bản về hệ điều hành và thiết bị số.' },
  { id: 'topic-2', name: 'Ứng dụng văn phòng', questionCount: 24, grade: 'Khối 6', displayOrder: 2, status: 'active', theme: 'violet', description: 'Luyện tập soạn thảo văn bản và bảng tính.' },
  { id: 'topic-3', name: 'An toàn trực tuyến', questionCount: 20, grade: 'Khối 6', displayOrder: 3, status: 'active', theme: 'teal', description: 'Bảo vệ dữ liệu cá nhân và tài khoản.' },
  { id: 'topic-4', name: 'Mạng và kết nối', questionCount: 16, grade: 'Khối 6', displayOrder: 4, status: 'inactive', theme: 'amber', description: 'Hiểu cách kết nối thiết bị với mạng.' },
  { id: 'topic-5', name: 'Tư duy số và giải quyết vấn đề', questionCount: 22, grade: 'Khối 7', displayOrder: 1, status: 'active', theme: 'blue', description: 'Phân tích tình huống và chọn giải pháp phù hợp.' },
  { id: 'topic-6', name: 'Thông tin và dữ liệu', questionCount: 19, grade: 'Khối 7', displayOrder: 2, status: 'active', theme: 'violet', description: 'Quản lý dữ liệu và nhận diện thông tin đúng sai.' },
  { id: 'topic-7', name: 'Sáng tạo số', questionCount: 17, grade: 'Khối 8', displayOrder: 1, status: 'active', theme: 'teal', description: 'Ứng dụng công nghệ để sáng tạo và trình bày.' },
  { id: 'topic-8', name: 'Đạo đức số', questionCount: 21, grade: 'Khối 8', displayOrder: 2, status: 'active', theme: 'amber', description: 'Hiểu quyền riêng tư và trách nhiệm khi dùng công nghệ.' }
];

function cx(...classes) { return classes.filter(Boolean).join(' '); }

function formatTopicNumber(index) {
  return index < 9 ? `0${index + 1}` : String(index + 1);
}

const LAST_ATTEMPT_KEY = 'ic3_last_attempt';
const ATTEMPT_HISTORY_KEY = 'ic3_attempt_history';
const ATTEMPT_TTL = 7 * 24 * 60 * 60 * 1000;

function arraysEqual(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((value, index) => value === b[index]);
}

function isQuestionAnswered(question, answer) {
  if (!question || answer === undefined || answer === null) return false;
  if (question.type === 'single') return Number.isInteger(answer);
  if (question.type === 'multiple') return Array.isArray(answer) && answer.length > 0;
  if (question.type === 'boolean') return question.statements.every((_, index) => typeof answer[index] === 'boolean');
  if (question.type === 'matching') return question.pairs.every((_, index) => typeof answer[index] === 'string' && answer[index].length > 0);
  if (question.type === 'reorder') return Array.isArray(answer) && answer.length === question.items.length;
  if (question.type === 'hotspot') return Number.isFinite(answer.x) && Number.isFinite(answer.y);
  return false;
}

function isQuestionCorrect(question, answer) {
  if (!isQuestionAnswered(question, answer)) return false;
  if (question.type === 'single') return answer === question.correct;
  if (question.type === 'multiple') return arraysEqual([...answer].sort((a, b) => a - b), [...question.correct].sort((a, b) => a - b));
  if (question.type === 'boolean') return question.statements.every(([, correct], index) => answer[index] === correct);
  if (question.type === 'matching') return question.pairs.every(([term], index) => answer[index] === term);
  if (question.type === 'reorder') return arraysEqual(answer, question.correctOrder);
  if (question.type === 'hotspot') {
    const region = question.correctRegion;
    return answer.x >= region.xMin && answer.x <= region.xMax && answer.y >= region.yMin && answer.y <= region.yMax;
  }
  return false;
}

function calculateAttemptResult({ attemptQuestions, answers, mode, scope, initialSeconds, remainingSeconds, submittedByTimeout = false }) {
  const totalQuestions = attemptQuestions.length;
  const correctCount = attemptQuestions.filter((question) => isQuestionCorrect(question, answers[question.id])).length;
  const unansweredCount = attemptQuestions.filter((question) => !isQuestionAnswered(question, answers[question.id])).length;
  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    mode, scope, questions: attemptQuestions, totalQuestions, answers, correctCount,
    wrongCount: totalQuestions - correctCount,
    unansweredCount,
    score: totalQuestions ? Math.round((correctCount / totalQuestions) * 1000) : 0,
    initialSeconds,
    remainingSeconds,
    elapsedSeconds: initialSeconds - remainingSeconds,
    completedAt: new Date().toISOString(),
    submittedByTimeout
  };
}

function formatTime(seconds = 0) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safeSeconds / 60)).padStart(2, '0')}:${String(safeSeconds % 60).padStart(2, '0')}`;
}

function readStoredAttempts() {
  try {
    const cutoff = Date.now() - ATTEMPT_TTL;
    const parsed = JSON.parse(localStorage.getItem(ATTEMPT_HISTORY_KEY) || '[]');
    const valid = Array.isArray(parsed) ? parsed.filter((attempt) => Date.parse(attempt.completedAt) >= cutoff) : [];
    if (valid.length !== parsed.length) localStorage.setItem(ATTEMPT_HISTORY_KEY, JSON.stringify(valid));
    return valid;
  } catch { return []; }
}

function readLastAttempt() {
  try {
    const attempt = JSON.parse(localStorage.getItem(LAST_ATTEMPT_KEY) || 'null');
    return attempt && Date.parse(attempt.completedAt) >= Date.now() - ATTEMPT_TTL ? attempt : null;
  } catch { return null; }
}

function saveAttempt(attempt) {
  const history = readStoredAttempts();
  const nextHistory = [attempt, ...history.filter((item) => item.id !== attempt.id)];
  localStorage.setItem(LAST_ATTEMPT_KEY, JSON.stringify(attempt));
  localStorage.setItem(ATTEMPT_HISTORY_KEY, JSON.stringify(nextHistory));
}

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

function StudentDashboard({ go, student, setToast }) {
  const s = student || { name: 'Nguyễn Văn A', school: schools[0], grade: 'Khối 6', className: '6A1' };
  const miniStats = [[Award, '860', 'Điểm gần nhất', 'blue'], [ClipboardCheck, '12', 'Bài đã làm', 'violet'], [BookOpen, '8/12', 'Chủ đề đã luyện', 'cyan'], [TrendingUp, '72%', 'Tiến độ học tập', 'green']];
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [challengeMode, setChallengeMode] = useState('quick');
  const [searching, setSearching] = useState(false);
  const [opponent, setOpponent] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [roomCopied, setRoomCopied] = useState(false);
  const [roomTopic, setRoomTopic] = useState('Chủ đề 1');
  const [roomQuestions, setRoomQuestions] = useState('10');
  const [roomTime, setRoomTime] = useState('10');
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(null);

  useEffect(() => {
    if (!challengeOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setChallengeOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [challengeOpen]);

  const closeChallenge = () => {
    setChallengeOpen(false);
    setChallengeMode('quick');
    setSearching(false);
    setOpponent(null);
    setRoomCode('');
    setRoomCopied(false);
    setRoomTopic('Chủ đề 1');
    setRoomQuestions('10');
    setRoomTime('10');
    setJoinCode('');
    setJoinError('');
    setJoinedRoom(null);
  };

  const startQuickMatch = () => {
    setChallengeMode('quick');
    setSearching(true);
    setOpponent(null);
    window.setTimeout(() => {
      setSearching(false);
      setOpponent({ name: 'Trần Thị B', className: 'Lớp 6A1' });
    }, 1100);
  };

  const createRoom = () => {
    setChallengeMode('create');
    const generatedCode = `IC3-${Math.floor(1000 + Math.random() * 9000)}`;
    setRoomCode(generatedCode);
    setRoomCopied(false);
    setToast({ type: 'success', text: `Đã tạo phòng mẫu ${generatedCode}.` });
  };

  const copyRoomCode = async () => {
    if (!roomCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setRoomCopied(true);
      setToast({ type: 'success', text: 'Đã sao chép mã phòng.' });
    } catch {
      setRoomCopied(true);
      setToast({ type: 'success', text: 'Mã phòng sẵn sàng để sao chép.' });
    }
  };

  const joinRoom = () => {
    if (!joinCode.trim()) {
      setJoinError('Vui lòng nhập mã phòng để tiếp tục.');
      setJoinedRoom(null);
      return;
    }
    setJoinError('');
    setJoinedRoom({ code: joinCode.trim(), host: 'Lê Minh C', topic: 'Chủ đề 2', questions: 20, time: 20 });
  };

  return (
    <main className="student-page page-shell">
      <section className="student-welcome">
        <div className="welcome-main"><span className="eyebrow"><Sparkles size={14}/> Xin chào</span><h1>{s.name}</h1><div className="student-meta"><span><Building2 size={16}/>{s.school}</span><span><Layers3 size={16}/>{s.grade}</span><span><School size={16}/>{s.className}</span></div></div>
        <div className="welcome-progress"><div className="progress-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"/><circle className="ring-value" cx="60" cy="60" r="50"/></svg><div><b>72%</b><small>Tiến độ</small></div></div><RobotBuddy small /></div>
      </section>
      <div className="dashboard-stats">{miniStats.map(([Icon, value, label, color]) => <article key={label} className="mini-stat"><span className={`stat-icon ${color}`}><Icon size={21}/></span><div><strong>{value}</strong><small>{label}</small></div></article>)}</div>
      <section className="learn-section"><div className="section-heading"><div><span className="eyebrow">Bắt đầu học</span><h2>Hôm nay bạn muốn làm gì?</h2></div><span className="streak-pill"><Sparkles size={15}/> Chuỗi 5 ngày</span></div>
        <div className="learning-actions">
          <button className="learning-card learning-card-vertical practice" type="button" onClick={() => go('topics')}>
            <div className="learning-card-head">
              <span className="learning-icon"><BookOpen size={22}/></span>
              <div>
                <span className="card-kicker">HỌC THEO CHỦ ĐỀ</span>
                <h3>Ôn tập</h3>
              </div>
            </div>
            <div className="learning-illustration" aria-hidden="true">
              <div className="learning-illustration-core">
                <div className="learning-illustration-robot"><RobotBuddy small /><span className="learning-illustration-badge"><BookOpen size={18}/></span></div>
              </div>
            </div>
            <div className="learning-card-body">
              <div className="learning-metrics practice-metrics">
                <div className="learning-metric">
                  <span className="metric-icon"><Target size={17}/></span>
                  <strong className="metric-value">8/12</strong>
                  <small className="metric-label">Chủ đề hoàn thành</small>
                </div>
                <div className="learning-metric">
                  <span className="metric-icon"><Trophy size={17}/></span>
                  <strong className="metric-value">#12</strong>
                  <small className="metric-label">Xếp hạng học tập</small>
                </div>
              </div>
              <p>Củng cố kiến thức và hoàn thành toàn bộ câu hỏi theo từng chủ đề.</p>
            </div>
            <div className="learning-card-footer"><button className="learning-action-button practice-action" type="button" onClick={(event) => { event.stopPropagation(); go('topics'); }}><span>Bắt đầu ôn tập</span><ChevronRight size={18}/></button></div>
            <span className="card-number">01</span>
          </button>
          <button className="learning-card learning-card-vertical exam" type="button" onClick={() => go('mode')}>
            <div className="learning-card-head">
              <span className="learning-icon"><TimerReset size={22}/></span>
              <div>
                <span className="card-kicker">MÔ PHỎNG KỲ THI</span>
                <h3>Thi thử</h3>
              </div>
            </div>
            <div className="learning-illustration" aria-hidden="true">
              <div className="learning-illustration-core">
                <div className="learning-illustration-robot"><RobotBuddy small /><span className="learning-illustration-badge"><TimerReset size={18}/></span></div>
              </div>
            </div>
            <div className="learning-card-body">
              <div className="learning-metrics exam-metrics">
                <div className="learning-metric">
                  <span className="metric-icon"><Award size={17}/></span>
                  <strong className="metric-value">860<span className="metric-subvalue">/1000</span></strong>
                  <small className="metric-label">Điểm gần nhất</small>
                </div>
                <div className="learning-metric">
                  <span className="metric-icon"><Trophy size={17}/></span>
                  <strong className="metric-value">#8</strong>
                  <small className="metric-label">Xếp hạng toàn khối</small>
                </div>
              </div>
              <p>Thử sức với đề thi mô phỏng, có giới hạn thời gian và câu hỏi ngẫu nhiên.</p>
            </div>
            <div className="learning-card-footer"><button className="learning-action-button exam-action" type="button" onClick={(event) => { event.stopPropagation(); go('mode'); }}><span>Vào phòng thi</span><ChevronRight size={18}/></button></div>
            <span className="card-number">02</span>
          </button>
          <button className="learning-card learning-card-vertical challenge" type="button" onClick={() => setChallengeOpen(true)}>
            <div className="learning-card-head">
              <span className="learning-icon"><Swords size={22}/></span>
              <div>
                <span className="card-kicker">THI ĐẤU CÙNG BẠN BÈ</span>
                <h3>Khiêu chiến</h3>
              </div>
            </div>
            <div className="learning-illustration" aria-hidden="true">
              <div className="learning-illustration-core">
                <div className="learning-illustration-robot challenge-robot-set"><RobotBuddy small /><RobotBuddy small /><span className="learning-illustration-badge challenge-badge"><Zap size={18}/></span></div>
              </div>
            </div>
            <div className="learning-card-body">
              <div className="learning-metrics challenge-metrics">
                <div className="learning-metric">
                  <span className="metric-icon"><Medal size={17}/></span>
                  <strong className="metric-value">Bạc II</strong>
                  <small className="metric-label">Hạng thi đấu</small>
                </div>
                <div className="learning-metric">
                  <span className="metric-icon"><ShieldCheck size={17}/></span>
                  <strong className="metric-value">7–3</strong>
                  <small className="metric-label">Thắng – Thua</small>
                </div>
              </div>
              <p>Thi đấu 1 đấu 1 với cùng bộ câu hỏi. Người trả lời đúng nhiều hơn và nhanh hơn sẽ chiến thắng.</p>
            </div>
            <div className="learning-card-footer"><button className="learning-action-button challenge-action" type="button" onClick={(event) => { event.stopPropagation(); setChallengeOpen(true); }}><span>Khiêu chiến ngay</span><ChevronRight size={18}/></button></div>
            <span className="card-number">03</span>
          </button>
        </div>
      </section>
      {challengeOpen && <div className="challenge-modal-backdrop" onClick={closeChallenge}><div className="challenge-modal" role="dialog" aria-modal="true" aria-label="Chọn cách khiêu chiến" onClick={(event) => event.stopPropagation()}>
        <div className="challenge-modal-header">
          <div>
            <span className="eyebrow"><Swords size={15}/> Khiêu chiến</span>
            <h2>Chọn cách khiêu chiến</h2>
            <p>Chọn đối thủ và cùng chinh phục bộ câu hỏi IC3.</p>
          </div>
          <button className="icon-button close-button" type="button" aria-label="Đóng modal khiêu chiến" onClick={closeChallenge}><X size={18}/></button>
        </div>
        <div className="challenge-options">
          <article className={cx('challenge-option', challengeMode === 'quick' && 'active')}>
            <div className="challenge-option-icon"><Zap size={18}/></div>
            <h3>Ghép nhanh</h3>
            <p>Hệ thống sẽ tìm một đối thủ có trình độ gần với bạn.</p>
            <button className="primary-button" type="button" onClick={startQuickMatch}>Tìm đối thủ</button>
            {searching && <p className="challenge-status">Đang tìm đối thủ…</p>}
            {opponent && <p className="challenge-status">Đối thủ mẫu: <b>{opponent.name}</b> · {opponent.className}</p>}
          </article>
          <article className={cx('challenge-option', challengeMode === 'create' && 'active')}>
            <div className="challenge-option-icon"><Plus size={18}/></div>
            <h3>Tạo phòng</h3>
            <p>Tạo phòng riêng và gửi mã cho bạn bè.</p>
            <div className="challenge-form-grid">
              <label className="challenge-field">
                <span>Chủ đề</span>
                <select value={roomTopic} onChange={(event) => setRoomTopic(event.target.value)}>
                  <option>Chủ đề 1</option>
                  <option>Chủ đề 2</option>
                  <option>Chủ đề 3</option>
                </select>
              </label>
              <label className="challenge-field">
                <span>Số câu</span>
                <select value={roomQuestions} onChange={(event) => setRoomQuestions(event.target.value)}>
                  <option value="10">10 câu</option>
                  <option value="20">20 câu</option>
                </select>
              </label>
              <label className="challenge-field">
                <span>Thời gian</span>
                <select value={roomTime} onChange={(event) => setRoomTime(event.target.value)}>
                  <option value="10">10 phút</option>
                  <option value="20">20 phút</option>
                </select>
              </label>
            </div>
            <button className="primary-button" type="button" onClick={createRoom}>Tạo phòng</button>
            {roomCode && <div className="challenge-room-code"><span><b>Mã phòng:</b> {roomCode}</span><button className="ghost-button" type="button" onClick={copyRoomCode}>{roomCopied ? 'Đã sao chép' : 'Sao chép mã'}</button></div>}
          </article>
          <article className={cx('challenge-option', challengeMode === 'join' && 'active')}>
            <div className="challenge-option-icon"><Hash size={18}/></div>
            <h3>Vào phòng</h3>
            <p>Nhập mã phòng được chia sẻ bởi bạn bè.</p>
            <label className="challenge-field">
              <span>Mã phòng</span>
              <input value={joinCode} onChange={(event) => { setJoinCode(event.target.value); if (joinError) setJoinError(''); }} placeholder="Ví dụ: IC3-7284" />
            </label>
            <button className="primary-button" type="button" onClick={joinRoom}>Vào phòng</button>
            {joinError && <p className="challenge-error">{joinError}</p>}
            {joinedRoom && <div className="challenge-status"><b>Đã tìm thấy phòng</b><br/>{joinedRoom.host} · {joinedRoom.topic} · {joinedRoom.questions} câu · {joinedRoom.time} phút</div>}
          </article>
        </div>
        <div className="challenge-rules">
          <h3>Quy tắc trận đấu</h3>
          <ul>
            <li>Hai học sinh nhận cùng một bộ câu hỏi.</li>
            <li>Câu đúng được tính điểm.</li>
            <li>Nếu bằng điểm, người hoàn thành nhanh hơn chiến thắng.</li>
            <li>Kết quả prototype chưa được lưu vào bảng xếp hạng thật.</li>
          </ul>
        </div>
      </div></div>}
      <section className="recent-panel"><div className="section-heading"><div><span className="eyebrow">Hoạt động gần đây</span><h2>Tiếp tục hành trình</h2></div><button className="text-button" onClick={() => go('result')}>Xem kết quả <ChevronRight size={16}/></button></div><div className="recent-row"><span className="recent-icon"><FileQuestion/></span><div><strong>Chủ đề 2 · Kỹ năng máy tính</strong><small>Hoàn thành hôm qua · 38/45 câu đúng</small></div><div className="recent-score"><b>860</b><small>điểm</small></div><button className="icon-button" onClick={() => go('topics')}><Play size={18}/></button></div></section>
    </main>
  );
}

function ModePage({ go, setQuizMode, setQuizScope }) {
  const choose = (mode) => { setQuizMode(mode); if (mode === 'Thi thử') setQuizScope('Toàn bộ Khối 6'); go(mode === 'Ôn tập' ? 'topics' : 'quiz'); };
  return <main className="content-page page-shell"><PageIntro eyebrow="Lộ trình học tập" title="Chọn chế độ phù hợp với bạn" text="Ôn chắc kiến thức theo chủ đề hoặc kiểm tra năng lực trong môi trường mô phỏng kỳ thi."/><div className="mode-grid">
    <button className="mode-card practice-mode" onClick={() => choose('Ôn tập')}><div className="mode-visual"><BookOpen size={44}/><span className="orbit-dot"/></div><span className="mode-tag">Linh hoạt theo chủ đề</span><h2>Chế độ Ôn tập</h2><p>Làm toàn bộ câu hỏi trong chủ đề bạn chọn. Kết quả được hiển thị sau khi hoàn thành.</p><ul><li><Check size={16}/> Tự chọn chủ đề</li><li><Check size={16}/> Có giới hạn thời gian</li><li><Check size={16}/> Theo dõi tiến bộ từng phần</li></ul><b className="mode-cta">Chọn Ôn tập <ChevronRight size={19}/></b></button>
    <button className="mode-card exam-mode" onClick={() => choose('Thi thử')}><div className="recommended"><Sparkles size={14}/> Khuyến nghị</div><div className="mode-visual"><TimerReset size={44}/><span className="orbit-dot"/></div><span className="mode-tag">Mô phỏng kỳ thi thật</span><h2>Chế độ Thi thử</h2><p>Câu hỏi ngẫu nhiên đúng khối, có đồng hồ đếm ngược và xếp hạng sau khi hoàn thành.</p><ul><li><Check size={16}/> 40–45 câu ngẫu nhiên</li><li><Check size={16}/> Thời gian 50 phút</li><li><Check size={16}/> Ghi nhận bảng xếp hạng</li></ul><b className="mode-cta">Bắt đầu Thi thử <ChevronRight size={19}/></b></button>
  </div><div className="mode-note"><CircleHelp size={18}/><p><b>Gợi ý:</b> Nếu bạn mới bắt đầu, hãy ôn từng chủ đề trước khi làm bài thi thử.</p></div></main>;
}

function TopicsPage({ go, setQuizMode, setQuizScope, student }) {
  const grade = student?.grade || 'Khối 6';
  const visibleTopics = useMemo(() => topicCatalog
    .filter((topic) => topic.grade === grade && topic.status === 'active')
    .sort((a, b) => a.displayOrder - b.displayOrder), [grade]);
  const totalQuestions = visibleTopics.reduce((sum, topic) => sum + topic.questionCount, 0);

  const openTopic = (topic) => {
    setQuizMode('Ôn tập');
    setQuizScope(topic.name);
    go('quiz');
  };

  const openSummary = () => {
    setQuizMode('Ôn tập');
    setQuizScope('Tổng hợp');
    go('quiz');
  };

  return (
    <main className="content-page page-shell topics-page">
      <PageIntro eyebrow={`Ôn tập • ${grade}`} title="Chọn chủ đề ôn tập" text="Chọn một chủ đề để luyện tập toàn bộ câu hỏi thuộc chủ đề đó." />
      <div className="topics-summary">
        <span><ListChecks size={15} /> {visibleTopics.length} chủ đề</span>
        <span><FileQuestion size={15} /> {totalQuestions} câu hỏi</span>
      </div>
      {visibleTopics.length ? (
        <>
          <div className="topics-grid">
            {visibleTopics.map((topic, index) => (
              <button className={cx('topic-card', `theme-${topic.theme}`)} key={topic.id} onClick={() => openTopic(topic)}>
                <span className="topic-number">{formatTopicNumber(index)}</span>
                <div className="topic-card__top">
                  <div className="topic-icon"><BrainCircuit size={20} /></div>
                </div>
                <div className="topic-card__body">
                  <p className="topic-card__eyebrow">{topic.description}</p>
                  <h3>{topic.name}</h3>
                  <div className="topic-meta">
                    <ListChecks size={16} />
                    <span>{topic.questionCount} câu hỏi</span>
                  </div>
                </div>
                <div className="topic-card__footer">
                  <span className="topic-start-button"><span>Bắt đầu ôn tập</span><ChevronRight size={17} /></span>
                </div>
              </button>
            ))}
          </div>
          <div className="topic-summary-card">
            <div>
              <span className="summary-pill">BỘ TỔNG HỢP</span>
              <h3>Ôn tập toàn bộ kiến thức {grade}</h3>
              <p>Luyện tập toàn bộ câu hỏi thuộc các chủ đề của khối trong cùng một bài.</p>
            </div>
            <div className="topic-summary-card__meta">
              <span><FileQuestion size={16} /> {totalQuestions} câu hỏi</span>
              <button className="topic-summary-action" type="button" onClick={openSummary}>Bắt đầu bài tổng hợp <ChevronRight size={17} /></button>
            </div>
          </div>
        </>
      ) : (
        <div className="topics-empty">
          <div className="topics-empty__icon"><BookOpen size={24} /></div>
          <h3>Chưa có chủ đề ôn tập</h3>
          <p>Các chủ đề dành cho khối của bạn đang được cập nhật.</p>
        </div>
      )}
    </main>
  );
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
    const region = q.correctRegion;
    return <div className="hotspot-wrap"><div className="mock-window" onClick={(e) => { if (review) return; const r=e.currentTarget.getBoundingClientRect(); setAnswer({x:((e.clientX-r.left)/r.width)*100,y:((e.clientY-r.top)/r.height)*100});}}><div className="mock-titlebar"><span><i/><i/><i/></span><div>IC3 Practice Document</div><b>—　□　<span>×</span></b></div><div className="mock-toolbar"><span/><span/><span/><span/><span/></div><div className="mock-document"><div/><div/><div className="short"/><section><i/><i/><i/></section></div>{selected && <span className="hotspot-marker" style={{left:`${selected.x}%`,top:`${selected.y}%`}}><MousePointer2 size={20}/></span>}{review && region && <span className="correct-hotspot" style={{left:`${region.xMin}%`,top:`${region.yMin}%`,width:`${region.xMax-region.xMin}%`,height:`${region.yMax-region.yMin}%`,right:'auto'}}>Vùng đúng</span>}</div><p className="hotspot-hint"><MousePointer2 size={16}/> {review ? 'Điểm màu đỏ là vị trí bạn đã chọn; khung xanh là vùng đáp án đúng.' : 'Bấm trực tiếp vào vùng bạn chọn trên hình.'}</p></div>;
  }
  return null;
}

function QuizPage({ go, quizMode, quizScope, setResultData }) {
  const initialSeconds = quizMode === 'Thi thử' ? 50 * 60 : 30 * 60;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [drawer, setDrawer] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [submitting, setSubmitting] = useState(false);
  const submitGuard = useRef(false);
  const submitLatest = useRef(null);
  const q = questions[index];
  const next = () => setIndex(i => Math.min(questions.length - 1, i + 1));
  const prev = () => setIndex(i => Math.max(0, i - 1));
  const answeredCount = questions.filter((question) => isQuestionAnswered(question, answers[question.id])).length;
  const unansweredCount = questions.length - answeredCount;

  const finish = (submittedByTimeout = false) => {
    if (submitGuard.current) return;
    submitGuard.current = true;
    setSubmitting(true);
    const attempt = calculateAttemptResult({ attemptQuestions: questions, answers, mode: quizMode, scope: quizScope, initialSeconds, remainingSeconds: seconds, submittedByTimeout });
    saveAttempt(attempt);
    setResultData(attempt);
    setConfirm(false);
    go('result');
  };
  submitLatest.current = finish;

  useEffect(() => {
    if (submitting) return undefined;
    const id = setInterval(() => setSeconds(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(id);
  }, [submitting]);
  useEffect(() => { if (seconds === 0) submitLatest.current?.(true); }, [seconds]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'PageUp') { e.preventDefault(); next(); } if (e.key === 'PageDown') { e.preventDefault(); prev(); } };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);

  return <main className="quiz-page"><div className="quiz-topbar"><button className="quiz-logo" onClick={() => go('student')}><Logo compact/></button><div className="quiz-progress"><div><span>Câu {index + 1} / {questions.length}</span><b>{Math.round(((index+1)/questions.length)*100)}%</b></div><div className="progress-track"><i style={{width:`${((index+1)/questions.length)*100}%`}}/></div></div><div className="quiz-tools"><span className="timer-pill"><Clock3 size={18}/><div><small>Thời gian còn lại</small><b>{formatTime(seconds)}</b></div></span><button className="outline-button" onClick={() => setDrawer(true)}><PanelLeftOpen size={18}/><span>Mục lục</span></button></div></div>
    <div className="quiz-workspace"><section className="question-card"><div className="question-meta"><span className="question-number">Câu {index + 1}</span><span className="question-type">{q.label}</span><button><Flag size={16}/> Đánh dấu</button></div><h1>{q.text}</h1><QuestionContent q={q} answer={answers[q.id]} setAnswer={(value) => setAnswers(old => ({...old, [q.id]: value}))}/></section>
      <div className="quiz-bottom"><button className="reset-button" onClick={() => setAnswers(old => { const nextAnswers = {...old}; delete nextAnswers[q.id]; return nextAnswers; })}><RotateCcw size={18}/> Đặt lại</button><div><button className="secondary-button" onClick={prev} disabled={index === 0}><ChevronLeft size={18}/> Trước</button>{index < questions.length - 1 ? <button className="primary-button" onClick={next}>Tiếp <ChevronRight size={18}/></button> : <button className="submit-button" disabled={submitting} onClick={() => setConfirm(true)}><ClipboardCheck size={18}/> {submitting ? 'Đang nộp...' : 'Nộp bài'}</button>}</div></div>
      <div className="keyboard-hint"><span><kbd>PageDown</kbd> Trước</span><span><kbd>PageUp</kbd> Tiếp</span></div>
    </div>
    {drawer && <div className="overlay" onClick={() => setDrawer(false)}><aside className="question-drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">Tiến độ bài làm</span><h2>Mục lục câu hỏi</h2></div><button className="icon-button" onClick={() => setDrawer(false)}><X/></button></div><div className="drawer-legend"><span><i className="done"/>Đã trả lời</span><span><i/>Chưa trả lời</span></div><div className="question-grid">{questions.map((item, i) => <button key={item.id} className={cx(i === index && 'current', isQuestionAnswered(item, answers[item.id]) && 'answered')} onClick={() => {setIndex(i);setDrawer(false);}}>{i+1}</button>)}</div><div className="drawer-summary"><b>{answeredCount}/{questions.length}</b><span>Câu đã trả lời</span></div></aside></div>}
    {confirm && <div className="overlay modal-overlay"><div className="confirm-modal"><div className="modal-icon"><ClipboardCheck/></div><h2>Xác nhận nộp bài?</h2><div className="submit-summary"><span>Đã trả lời <b>{answeredCount}/{questions.length} câu</b></span><span>Chưa trả lời <b>{unansweredCount} câu</b></span><span>Thời gian còn lại <b>{formatTime(seconds)}</b></span></div>{unansweredCount > 0 && <p className="modal-warning">Bạn vẫn còn câu chưa trả lời. Các câu này sẽ không được tính điểm.</p>}<div className="modal-actions"><button className="secondary-button" disabled={submitting} onClick={() => setConfirm(false)}>Tiếp tục làm</button><button className="submit-button" disabled={submitting} onClick={() => finish(false)}>{submitting ? 'Đang nộp...' : 'Xác nhận nộp'}</button></div></div></div>}
  </main>;
}

function ScoreRing({ score }) {
  const offset = 427 * (1 - Math.max(0, Math.min(1000, score)) / 1000);
  return <div className="score-ring"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="68"/><circle className="score-value" cx="80" cy="80" r="68" style={{strokeDashoffset:offset}}/></svg><div><span>Điểm số</span><strong>{score}</strong><small>/ 1000</small></div></div>;
}

function MiniLineChart({ history }) {
  const ordered = [...history].reverse();
  const points = ordered.map((attempt, index) => {
    const x = ordered.length === 1 ? 300 : 10 + (index * 580) / (ordered.length - 1);
    return [x, 160 - (attempt.score / 1000) * 140];
  });
  const line = points.map(([x,y], index) => `${index ? 'L' : 'M'}${x} ${y}`).join(' ');
  const area = points.length ? `${line} L${points.at(-1)[0]} 170 L${points[0][0]} 170Z` : '';
  return <div className="chart-wrap"><div className="chart-y"><span>1000</span><span>500</span><span>0</span></div><svg viewBox="0 0 600 180" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f6fed" stopOpacity=".24"/><stop offset="1" stopColor="#2f6fed" stopOpacity="0"/></linearGradient></defs><line x1="0" x2="600" y1="20" y2="20"/><line x1="0" x2="600" y1="90" y2="90"/><line x1="0" x2="600" y1="160" y2="160"/><path className="chart-area" d={area}/><path className="chart-line" d={line}/>{points.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5"/>)}</svg><div className="chart-x dynamic">{ordered.map((attempt, index)=><span key={attempt.id}>Lần {index+1}</span>)}</div></div>;
}

function ResultPage({ go, resultData, onRetry }) {
  const r = resultData || readLastAttempt();
  const history = readStoredAttempts().slice(0, 5);
  if (!r) return <EmptyAttempt go={go} title="Chưa có kết quả" text="Hãy hoàn thành một bài ôn tập hoặc thi thử để xem kết quả tại đây."/>;
  const growth = history.length > 1 ? history[0].score - history.at(-1).score : 0;
  return <main className="result-page page-shell"><section className="result-hero"><div className="result-message"><span className="eyebrow"><Sparkles size={14}/> Hoàn thành bài làm</span><h1>{r.submittedByTimeout ? 'Bài đã được nộp do hết giờ' : 'Đã chấm điểm bài làm!'}</h1><p>{r.submittedByTimeout ? 'Hệ thống đã tự động nộp và chấm bài một lần khi đồng hồ về 00:00.' : 'Kết quả được tính trực tiếp từ đáp án bạn vừa hoàn thành.'}</p><div className="result-actions"><button className="primary-button" onClick={() => onRetry(r)}><RefreshCcw size={18}/> Làm lại</button><button className="secondary-button" onClick={() => go('review')}><ListChecks size={18}/> Xem lại đáp án</button><button className="text-button" onClick={() => go('student')}><Home size={17}/> Về Dashboard</button></div></div><ScoreRing score={r.score}/><div className="result-spark"><Bot size={34}/></div></section>
    <div className="result-metrics"><article><span className="metric-icon green"><CheckCircle2/></span><div><strong>{r.correctCount}</strong><small>Câu đúng</small></div></article><article><span className="metric-icon red"><XCircle/></span><div><strong>{r.wrongCount}</strong><small>Sai / chưa trả lời ({r.unansweredCount})</small></div></article><article><span className="metric-icon blue"><Clock3/></span><div><strong>{formatTime(r.elapsedSeconds)}</strong><small>Thời gian hoàn thành</small></div></article><article><span className="metric-icon violet"><FileQuestion/></span><div><strong>{r.mode}</strong><small>{r.scope}</small></div></article></div>
    <section className="history-section"><div className="section-heading"><div><span className="eyebrow">Phân tích tiến bộ</span><h2>{history.length} lần làm bài gần nhất</h2></div>{history.length > 1 && <span className="growth-badge"><TrendingUp size={16}/> {growth >= 0 ? '+' : ''}{growth} điểm</span>}</div>{history.length ? <><MiniLineChart history={history}/><div className="history-table"><div className="table-head"><span>Ngày làm</span><span>Chế độ</span><span>Phạm vi</span><span>Điểm</span><span>Thời gian</span></div>{history.map((attempt)=><div className="table-row" key={attempt.id}><span data-label="Ngày làm">{new Date(attempt.completedAt).toLocaleDateString('vi-VN')}</span><span data-label="Chế độ"><b className={attempt.mode==='Thi thử'?'exam-pill':'practice-pill'}>{attempt.mode}</b></span><span data-label="Phạm vi">{attempt.scope}</span><span data-label="Điểm" className="score-cell">{attempt.score}</span><span data-label="Thời gian">{formatTime(attempt.elapsedSeconds)}</span></div>)}</div></> : <div className="history-empty">Chưa có dữ liệu lịch sử trong 7 ngày gần đây.</div>}</section></main>;
}

function EmptyAttempt({ go, title, text }) {
  return <main className="result-page page-shell"><section className="empty-attempt"><span className="modal-icon"><FileQuestion/></span><h1>{title}</h1><p>{text}</p><button className="primary-button" onClick={() => go('student')}><Home size={17}/> Về Dashboard</button></section></main>;
}

function ReviewAnswerDetails({ question, answer }) {
  if (question.type === 'matching') return <div className="review-comparison"><b>Đối chiếu cặp ghép</b>{question.pairs.map(([term, description], index)=><div key={term}><span>{description}</span><span>Bạn chọn: <strong>{answer?.[index] || 'Chưa trả lời'}</strong></span><span>Đáp án đúng: <strong>{term}</strong></span></div>)}</div>;
  if (question.type === 'reorder') return <div className="review-comparison"><b>Đối chiếu thứ tự</b><div><span>Bạn sắp xếp: <strong>{Array.isArray(answer) ? answer.join(' → ') : 'Chưa trả lời'}</strong></span><span>Đáp án đúng: <strong>{question.correctOrder.join(' → ')}</strong></span></div></div>;
  if (question.type === 'hotspot') return <div className="review-comparison"><b>Đối chiếu vị trí</b><div><span>Bạn chọn: <strong>{answer ? `x ${answer.x.toFixed(1)}%, y ${answer.y.toFixed(1)}%` : 'Chưa trả lời'}</strong></span><span>Vùng đúng: <strong>x {question.correctRegion.xMin}–{question.correctRegion.xMax}%, y {question.correctRegion.yMin}–{question.correctRegion.yMax}%</strong></span></div></div>;
  return null;
}

function ReviewPage({ go, resultData }) {
  const attempt = resultData || readLastAttempt();
  const [index, setIndex] = useState(0);
  if (!attempt?.questions?.length) return <EmptyAttempt go={go} title="Chưa có bài để xem lại" text="Hoàn thành một bài làm trước khi mở phần xem lại đáp án."/>;
  const attemptQuestions = attempt.questions;
  const q = attemptQuestions[index];
  const answer = attempt.answers[q.id];
  const answered = isQuestionAnswered(q, answer);
  const correct = isQuestionCorrect(q, answer);
  const status = !answered ? 'Chưa trả lời' : correct ? 'Trả lời đúng' : 'Trả lời sai';
  const statusClass = !answered ? 'unanswered' : correct ? 'correct' : 'wrong';
  return <main className="review-page"><div className="review-topbar"><button className="back-button" onClick={() => go('result')}><ChevronLeft/> Quay lại kết quả</button><div><span className="eyebrow">Xem lại đáp án</span><h2>Câu {index+1} / {attemptQuestions.length}</h2></div><div className="review-status"><span><i className={statusClass}/>{status}</span></div></div><div className="review-workspace"><section className="question-card"><div className="question-meta"><span className="question-number">Câu {index+1}</span><span className="question-type">{q.label}</span></div><h1>{q.text}</h1><QuestionContent q={q} answer={answer} setAnswer={()=>{}} review/><ReviewAnswerDetails question={q} answer={answer}/><div className="explanation-box"><span><BrainCircuit size={22}/></span><div><b>Giải thích đáp án</b><p>{q.explanation}</p></div></div></section><div className="review-bottom"><button className="secondary-button" onClick={()=>setIndex(i=>Math.max(0,i-1))} disabled={index===0}><ChevronLeft/> Trước</button><div className="review-dots">{attemptQuestions.map((question,i)=>{const itemAnswer=attempt.answers[question.id];const itemClass=!isQuestionAnswered(question,itemAnswer)?'unanswered':isQuestionCorrect(question,itemAnswer)?'correct':'wrong';return <button key={question.id} className={cx(i===index&&'active',itemClass)} onClick={()=>setIndex(i)}>{i+1}</button>;})}</div>{index<attemptQuestions.length-1?<button className="primary-button" onClick={()=>setIndex(i=>i+1)}>Tiếp <ChevronRight/></button>:<button className="primary-button" onClick={()=>go('student')}>Hoàn tất <Check/></button>}</div></div></main>;
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
  const [quizScope,setQuizScope]=useState('Toàn bộ Khối 6');
  const [resultData,setResultData]=useState(() => readLastAttempt());
  const [toast,setToast]=useState(null);
  const retryAttempt = (attempt) => { setQuizMode(attempt.mode); setQuizScope(attempt.scope); setResultData(null); go('quiz'); };
  const bare=['quiz','review','teacher','admin'].includes(page);
  let content;
  if(page==='home')content=<HomePage go={go} onLogin={setStudent} setToast={setToast}/>;
  else if(page==='student')content=<StudentDashboard go={go} student={student}/>;
  else if(page==='mode')content=<ModePage go={go} setQuizMode={setQuizMode} setQuizScope={setQuizScope}/>;
  else if(page==='topics')content=<TopicsPage go={go} setQuizMode={setQuizMode} setQuizScope={setQuizScope} student={student}/>;
  else if(page==='quiz')content=<QuizPage go={go} quizMode={quizMode} quizScope={quizScope} setResultData={setResultData}/>;
  else if(page==='result')content=<ResultPage go={go} resultData={resultData} onRetry={retryAttempt}/>;
  else if(page==='review')content=<ReviewPage go={go} resultData={resultData}/>;
  else if(page==='leaderboard')content=<LeaderboardPage/>;
  else if(page==='teacher')content=<TeacherDashboard go={go} setToast={setToast}/>;
  else if(page==='admin')content=<AdminDashboard go={go} setToast={setToast}/>;
  return <div className="app">{!bare&&<AppHeader page={page} go={go} student={student}/>} {content}{!bare&&<footer><div><Logo/><p>© 2026 IC3 AI Learning · Kỹ năng số cho tương lai.</p></div><div><button onClick={()=>go('student')}>Học tập</button><button onClick={()=>go('leaderboard')}>Bảng xếp hạng</button><button onClick={()=>go('teacher')}>Giáo viên</button><button onClick={()=>go('admin')}>Quản trị viên</button></div></footer>}<Toast toast={toast} close={()=>setToast(null)}/></div>;
}

createRoot(document.getElementById('root')).render(<App />);
