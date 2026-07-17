import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardCheck, Clock3, Flag, PanelLeftOpen, RotateCcw, X } from 'lucide-react';
import { questions } from '../../data/questions.js';
import { QuestionContent } from '../../components/quiz/QuestionContent.jsx';
import { Logo } from '../../components/common/Logo.jsx';
import { cx } from '../../utils/classNames.js';
import { formatTime } from '../../utils/formatters.js';
import { calculateAttemptResult, isQuestionAnswered } from '../../utils/quizScoring.js';
import { saveAttempt } from '../../utils/attemptStorage.js';

export function QuizPage({ go, quizMode, quizScope, setResultData }) {
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
