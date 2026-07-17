import { BookOpen, Check, ChevronRight, CircleHelp, Sparkles, TimerReset } from 'lucide-react';
import { PageIntro } from '../../components/common/PageIntro.jsx';

export function ModePage({ go, setQuizMode, setQuizScope }) {
  const choose = (mode) => { setQuizMode(mode); if (mode === 'Thi thử') setQuizScope('Toàn bộ Khối 6'); go(mode === 'Ôn tập' ? 'topics' : 'quiz'); };
  return <main className="content-page page-shell"><PageIntro eyebrow="Lộ trình học tập" title="Chọn chế độ phù hợp với bạn" text="Ôn chắc kiến thức theo chủ đề hoặc kiểm tra năng lực trong môi trường mô phỏng kỳ thi."/><div className="mode-grid">
    <button className="mode-card practice-mode" onClick={() => choose('Ôn tập')}><div className="mode-visual"><BookOpen size={44}/><span className="orbit-dot"/></div><span className="mode-tag">Linh hoạt theo chủ đề</span><h2>Chế độ Ôn tập</h2><p>Làm toàn bộ câu hỏi trong chủ đề bạn chọn. Kết quả được hiển thị sau khi hoàn thành.</p><ul><li><Check size={16}/> Tự chọn chủ đề</li><li><Check size={16}/> Có giới hạn thời gian</li><li><Check size={16}/> Theo dõi tiến bộ từng phần</li></ul><b className="mode-cta">Chọn Ôn tập <ChevronRight size={19}/></b></button>
    <button className="mode-card exam-mode" onClick={() => choose('Thi thử')}><div className="recommended"><Sparkles size={14}/> Khuyến nghị</div><div className="mode-visual"><TimerReset size={44}/><span className="orbit-dot"/></div><span className="mode-tag">Mô phỏng kỳ thi thật</span><h2>Chế độ Thi thử</h2><p>Câu hỏi ngẫu nhiên đúng khối, có đồng hồ đếm ngược và xếp hạng sau khi hoàn thành.</p><ul><li><Check size={16}/> 40–45 câu ngẫu nhiên</li><li><Check size={16}/> Thời gian 50 phút</li><li><Check size={16}/> Ghi nhận bảng xếp hạng</li></ul><b className="mode-cta">Bắt đầu Thi thử <ChevronRight size={19}/></b></button>
  </div><div className="mode-note"><CircleHelp size={18}/><p><b>Gợi ý:</b> Nếu bạn mới bắt đầu, hãy ôn từng chủ đề trước khi làm bài thi thử.</p></div></main>;
}
