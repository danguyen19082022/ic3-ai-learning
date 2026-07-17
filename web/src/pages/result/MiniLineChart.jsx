export function MiniLineChart({ history }) {
  const ordered = [...history].reverse();
  const points = ordered.map((attempt, index) => {
    const x = ordered.length === 1 ? 300 : 10 + (index * 580) / (ordered.length - 1);
    return [x, 160 - (attempt.score / 1000) * 140];
  });
  const line = points.map(([x,y], index) => `${index ? 'L' : 'M'}${x} ${y}`).join(' ');
  const area = points.length ? `${line} L${points.at(-1)[0]} 170 L${points[0][0]} 170Z` : '';
  return <div className="chart-wrap"><div className="chart-y"><span>1000</span><span>500</span><span>0</span></div><svg viewBox="0 0 600 180" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f6fed" stopOpacity=".24"/><stop offset="1" stopColor="#2f6fed" stopOpacity="0"/></linearGradient></defs><line x1="0" x2="600" y1="20" y2="20"/><line x1="0" x2="600" y1="90" y2="90"/><line x1="0" x2="600" y1="160" y2="160"/><path className="chart-area" d={area}/><path className="chart-line" d={line}/>{points.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5"/>)}</svg><div className="chart-x dynamic">{ordered.map((attempt, index)=><span key={attempt.id}>Lần {index+1}</span>)}</div></div>;
}
