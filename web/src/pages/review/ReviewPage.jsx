import { useState } from 'react';
import { BrainCircuit, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyAttempt } from '../../components/common/EmptyAttempt.jsx';
import { QuestionContent } from '../../components/quiz/QuestionContent.jsx';
import { ReviewAnswerDetails } from './ReviewAnswerDetails.jsx';
import { readLastAttempt } from '../../utils/attemptStorage.js';
import { isQuestionAnswered, isQuestionCorrect } from '../../utils/quizScoring.js';
import { cx } from '../../utils/classNames.js';

export function ReviewPage({ go, resultData }) {
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
