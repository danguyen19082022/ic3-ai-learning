export function ReviewAnswerDetails({ question, answer }) {
  if (question.type === 'matching') return <div className="review-comparison"><b>Đối chiếu cặp ghép</b>{question.pairs.map(([term, description], index)=><div key={term}><span>{description}</span><span>Bạn chọn: <strong>{answer?.[index] || 'Chưa trả lời'}</strong></span><span>Đáp án đúng: <strong>{term}</strong></span></div>)}</div>;
  if (question.type === 'reorder') return <div className="review-comparison"><b>Đối chiếu thứ tự</b><div><span>Bạn sắp xếp: <strong>{Array.isArray(answer) ? answer.join(' → ') : 'Chưa trả lời'}</strong></span><span>Đáp án đúng: <strong>{question.correctOrder.join(' → ')}</strong></span></div></div>;
  if (question.type === 'hotspot') return <div className="review-comparison"><b>Đối chiếu vị trí</b><div><span>Bạn chọn: <strong>{answer ? `x ${answer.x.toFixed(1)}%, y ${answer.y.toFixed(1)}%` : 'Chưa trả lời'}</strong></span><span>Vùng đúng: <strong>x {question.correctRegion.xMin}–{question.correctRegion.xMax}%, y {question.correctRegion.yMin}–{question.correctRegion.yMax}%</strong></span></div></div>;
  return null;
}
