import { useMemo } from 'react';
import { BookOpen, BrainCircuit, ChevronRight, FileQuestion, ListChecks } from 'lucide-react';
import { PageIntro } from '../../components/common/PageIntro.jsx';
import { cx } from '../../utils/classNames.js';

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


function formatTopicNumber(index) {
  return index < 9 ? `0${index + 1}` : String(index + 1);
}

export function TopicsPage({ go, setQuizMode, setQuizScope, student }) {
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
