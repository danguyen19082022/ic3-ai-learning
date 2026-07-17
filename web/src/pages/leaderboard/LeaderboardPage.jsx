import { useMemo, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { leaderboardRows } from '../../data/leaderboard.js';
import { PageIntro } from '../../components/common/PageIntro.jsx';
import { RankBadge } from '../../components/common/RankBadge.jsx';
import { LeaderboardFilters } from './LeaderboardFilters.jsx';
import { cx } from '../../utils/classNames.js';

export function LeaderboardPage() {
  const [filters,setFilters]=useState({school:'Tất cả trường',grade:'Tất cả khối',className:'Tất cả lớp',period:'Tuần',mode:'Thi thử'});
  const rows=useMemo(()=>leaderboardRows.filter(r=>(filters.school==='Tất cả trường'||r.school===filters.school)&&(filters.grade==='Tất cả khối'||r.grade===filters.grade)&&(filters.className==='Tất cả lớp'||r.className===filters.className)&&(filters.mode==='Tất cả'||r.mode===filters.mode)).sort((a,b)=>b.score-a.score||a.time.localeCompare(b.time)),[filters]);
  return <main className="content-page leaderboard-page page-shell"><PageIntro eyebrow="Vinh danh thành tích" title="Bảng xếp hạng IC3" text="Điểm cao hơn được xếp trước; nếu bằng điểm, thời gian hoàn thành nhanh hơn sẽ xếp trên." action={<span className="live-dot">Cập nhật hôm nay</span>}/><section className="leaderboard-podium">{leaderboardRows.slice(0,3).map((r,i)=><article key={r.name} className={`podium-card podium-${i+1}`}><RankBadge rank={i+1}/><div className="podium-avatar">{r.name.split(' ').slice(-1)[0][0]}</div><div><b>{r.name}</b><small>{r.school} · {r.className}</small></div><strong>{r.score}<small> điểm</small></strong></article>)}</section><LeaderboardFilters filters={filters} setFilters={setFilters}/><section className="data-card rank-table"><div className="table-head"><span>Hạng</span><span>Học sinh</span><span>Trường</span><span>Khối / Lớp</span><span>Điểm</span><span>Thời gian</span><span>Ngày làm</span></div>{rows.map((r,i)=><div className={cx('table-row',i<3&&'top-row')} key={r.name}><span data-label="Hạng"><RankBadge rank={i+1}/></span><span data-label="Học sinh"><b>{r.name}</b><small>{r.mode}</small></span><span data-label="Trường">{r.school}</span><span data-label="Khối / Lớp">{r.grade} · {r.className}</span><span className="score-cell" data-label="Điểm">{r.score}</span><span data-label="Thời gian"><Clock3 size={14}/>{r.time}</span><span data-label="Ngày làm">{r.date}</span></div>)}</section></main>;
}
