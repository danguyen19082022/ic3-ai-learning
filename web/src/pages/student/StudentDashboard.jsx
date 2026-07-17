import { useEffect, useState } from 'react';
import { Award, BookOpen, Building2, ChevronRight, ClipboardCheck, FileQuestion, Hash, Layers3, Medal, Play, Plus, School, ShieldCheck, Sparkles, Swords, Target, TimerReset, TrendingUp, Trophy, X, Zap } from 'lucide-react';
import { schools } from '../../data/schools.js';
import { RobotBuddy } from '../../components/common/RobotBuddy.jsx';
import { cx } from '../../utils/classNames.js';

export function StudentDashboard({ go, student, setToast }) {
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
