import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bot, BrainCircuit,
  Check, CheckCircle2, ChevronLeft, ChevronRight,
  ClipboardCheck, Clock3, Download, FileQuestion, Filter, Flag,
  GripVertical, Home, KeyRound, ListChecks,
  MousePointer2, PanelLeftOpen, Pencil,
  Plus, RefreshCcw, RotateCcw, School, Search, Settings2, Sparkles,
  TrendingUp, Upload,
  X, XCircle
} from 'lucide-react';
import './styles.css';
import { schools, grades, classMap } from './data/schools.js';
import { leaderboardRows } from './data/leaderboard.js';
import { questions } from './data/questions.js';
import { teacherStudents, questionBank } from './data/management.js';
import { useHashPage } from './hooks/useHashPage.js';
import { calculateAttemptResult, isQuestionAnswered, isQuestionCorrect } from './utils/quizScoring.js';
import { readLastAttempt, readStoredAttempts, saveAttempt } from './utils/attemptStorage.js';
import { formatTime } from './utils/formatters.js';
import { cx } from './utils/classNames.js';
import { downloadCsv } from './utils/exportCsv.js';
import { Logo } from './components/common/Logo.jsx';
import { PageIntro } from './components/common/PageIntro.jsx';
import { RankBadge } from './components/common/RankBadge.jsx';
import { Toast } from './components/common/Toast.jsx';
import { AppHeader } from './components/layout/AppHeader.jsx';
import { AppFooter } from './components/layout/AppFooter.jsx';
import { AdminShell } from './components/management/AdminShell.jsx';
import { AdminTop } from './components/management/AdminTop.jsx';
import { ManagementStats } from './components/management/ManagementStats.jsx';
import { HomePage } from './pages/home/HomePage.jsx';
import { StudentDashboard } from './pages/student/StudentDashboard.jsx';
import { ModePage } from './pages/mode/ModePage.jsx';
import { TopicsPage } from './pages/topics/TopicsPage.jsx';


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



function TeacherDashboard({ go, setToast }) {
  const [active,setActive]=useState('Tổng quan'); const [search,setSearch]=useState('');
  const rows=teacherStudents.filter(r=>r[0].toLowerCase().includes(search.toLowerCase()));
  return <AdminShell role="teacher" active={active} setActive={setActive} go={go}><AdminTop title={active} subtitle="Theo dõi lớp học và tiến bộ của học sinh." name="Nguyễn Minh Anh"/><ManagementStats/>
    <div className="management-grid"><section className="data-card class-performance"><div className="section-heading"><div><span className="eyebrow">Hiệu suất lớp học</span><h2>Kết quả theo lớp</h2></div><select><option>Tuần này</option><option>Tháng này</option></select></div>{[['6A1',88,42],['6A2',82,40],['7A1',91,38],['7A2',76,36]].map(([c,p,n])=><div className="performance-row" key={c}><span className="class-icon"><School/></span><div><b>Lớp {c}</b><small>{n} học sinh</small></div><div className="bar"><i style={{width:`${p}%`}}/></div><strong>{p}%</strong></div>)}</section><section className="data-card quick-report"><div className="section-heading"><div><span className="eyebrow">Tổng quan</span><h2>Tiến bộ học tập</h2></div></div><div className="donut"><div><b>84%</b><small>Tỉ lệ đạt</small></div></div><div className="donut-legend"><span><i className="green"/>Đạt yêu cầu <b>156</b></span><span><i className="orange"/>Cần cố gắng <b>30</b></span></div></section></div>
    <section className="data-card students-table"><div className="section-heading"><div><span className="eyebrow">Quản lý lớp học</span><h2>Danh sách học sinh</h2></div><div className="table-actions"><label className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm học sinh..."/></label><button className="outline-button" onClick={()=>downloadCsv('bao-cao-hoc-sinh.csv',[['Họ tên','Lớp','Số bài','Điểm'],...teacherStudents])}><Download size={17}/> Xuất Excel</button></div></div><div className="table-head"><span>Học sinh</span><span>Lớp</span><span>Số bài đã làm</span><span>Điểm gần nhất</span><span>Trạng thái</span><span>Thao tác</span></div>{rows.map((r,i)=><div className="table-row" key={r[0]}><span data-label="Học sinh"><span className="tiny-avatar">{r[0].slice(-1)}</span><b>{r[0]}</b></span><span data-label="Lớp">{r[1]}</span><span data-label="Số bài">{r[2]}</span><span data-label="Điểm" className="score-cell">{r[3]}</span><span data-label="Trạng thái"><b className={r[4]==='Đang hoạt động'?'status-active':'status-pause'}>{r[4]}</b></span><span data-label="Thao tác"><button className="icon-button" title="Reset mật khẩu" onClick={()=>setToast({type:'success',text:`Đã đặt lại mật khẩu mẫu cho ${r[0]}.`})}><KeyRound size={17}/></button><button className="icon-button"><ChevronRight size={17}/></button></span></div>)}</section>
  </AdminShell>;
}


function AdminDashboard({ go, setToast }) {
  const [active,setActive]=useState('Tổng quan'); const [showForm,setShowForm]=useState(false);
  return <AdminShell role="admin" active={active} setActive={setActive} go={go}><AdminTop title={active} subtitle="Quản lý dữ liệu và vận hành toàn bộ hệ thống." name="Admin IC3"/><ManagementStats admin/>
    <div className="admin-overview-grid"><section className="data-card system-chart"><div className="section-heading"><div><span className="eyebrow">Hoạt động hệ thống</span><h2>Lượt làm bài trong tuần</h2></div><select><option>7 ngày qua</option><option>30 ngày qua</option></select></div><div className="bar-chart">{[54,72,60,88,76,94,68].map((v,i)=><div key={i}><span style={{height:`${v}%`}}><i>{v}</i></span><small>{['T2','T3','T4','T5','T6','T7','CN'][i]}</small></div>)}</div></section><section className="data-card system-health"><div className="section-heading"><div><span className="eyebrow">Chất lượng dữ liệu</span><h2>Trạng thái câu hỏi</h2></div></div>{[['Đang sử dụng',1135,91,'green'],['Cần chỉnh sửa',72,6,'orange'],['Tạm ẩn',41,3,'gray']].map(([l,n,p,c])=><div className="health-row" key={l}><div><span><i className={c}/>{l}</span><b>{n}</b></div><div className="bar"><i className={c} style={{width:`${p}%`}}/></div></div>)}</section></div>
    <section className="data-card question-table"><div className="section-heading"><div><span className="eyebrow">Ngân hàng dữ liệu</span><h2>Câu hỏi gần đây</h2></div><div className="table-actions"><button className="outline-button" onClick={()=>downloadCsv('ngan-hang-cau-hoi.csv',[['Mã','Câu hỏi','Dạng','Khối','Trạng thái'],...questionBank])}><Download size={17}/> Xuất dữ liệu</button><button className="primary-button small" onClick={()=>setShowForm(true)}><Plus size={17}/> Thêm câu hỏi</button></div></div><div className="table-head"><span>Mã</span><span>Nội dung câu hỏi</span><span>Dạng</span><span>Khối</span><span>Trạng thái</span><span>Thao tác</span></div>{questionBank.map(r=><div className="table-row" key={r[0]}>{r.map((cell,i)=><span key={i} data-label={['Mã','Nội dung','Dạng','Khối','Trạng thái'][i]}>{i===4?<b className={cell==='Đang sử dụng'?'status-active':cell==='Tạm ẩn'?'status-pause':'status-edit'}>{cell}</b>:i===0?<b>{cell}</b>:cell}</span>)}<span data-label="Thao tác"><button className="icon-button" onClick={()=>setShowForm(true)}><Pencil size={16}/></button><button className="icon-button"><ChevronRight size={16}/></button></span></div>)}</section>
    <section className="configuration-strip"><div><span className="config-icon"><Settings2/></span><div><b>Cấu hình bài làm</b><small>Thi thử: 45 câu · 50 phút　|　Ôn tập: 30 phút / chủ đề</small></div></div><button className="outline-button" onClick={()=>setActive('Cấu hình bài thi')}>Điều chỉnh cấu hình <ChevronRight size={17}/></button></section>
    {showForm&&<div className="overlay modal-overlay"><form className="admin-form" onSubmit={e=>{e.preventDefault();setShowForm(false);setToast({type:'success',text:'Đã lưu câu hỏi mẫu vào giao diện prototype.'});}}><div className="drawer-head"><div><span className="eyebrow">Ngân hàng câu hỏi</span><h2>Thêm câu hỏi mới</h2></div><button type="button" className="icon-button" onClick={()=>setShowForm(false)}><X/></button></div><label className="field"><span>Nội dung câu hỏi</span><textarea placeholder="Nhập nội dung câu hỏi..." required/></label><div className="form-grid"><label className="field"><span>Dạng câu hỏi</span><select><option>Single choice</option><option>Multiple choice</option><option>Matching</option><option>Reorder</option><option>Hotspot</option></select></label><label className="field"><span>Khối</span><select>{grades.map(x=><option key={x}>{x}</option>)}</select></label></div><label className="field"><span>Trạng thái</span><select><option>Đang sử dụng</option><option>Tạm ẩn</option><option>Cần chỉnh sửa</option></select></label><div className="upload-box"><Upload/><b>Tải ảnh minh họa hoặc Hotspot</b><small>PNG, JPG · tối đa 5 MB</small></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowForm(false)}>Hủy</button><button className="primary-button" type="submit"><Check/> Lưu câu hỏi</button></div></form></div>}
  </AdminShell>;
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
  return <div className="app">{!bare&&<AppHeader page={page} go={go} student={student}/>} {content}{!bare&&<AppFooter go={go} />}<Toast toast={toast} close={()=>setToast(null)}/></div>;
}

createRoot(document.getElementById('root')).render(<App />);
