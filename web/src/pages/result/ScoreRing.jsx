export function ScoreRing({ score }) {
  const offset = 427 * (1 - Math.max(0, Math.min(1000, score)) / 1000);
  return <div className="score-ring"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="68"/><circle className="score-value" cx="80" cy="80" r="68" style={{strokeDashoffset:offset}}/></svg><div><span>Điểm số</span><strong>{score}</strong><small>/ 1000</small></div></div>;
}
