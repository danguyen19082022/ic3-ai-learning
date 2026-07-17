import React from 'react';
import { Check, GripVertical, MousePointer2 } from 'lucide-react';
import { QuizOption } from './QuizOption.jsx';
import { cx } from '../../utils/classNames.js';

export function QuestionContent({ q, answer, setAnswer, review = false }) {
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
