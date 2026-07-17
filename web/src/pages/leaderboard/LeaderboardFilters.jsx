import { Filter, RotateCcw } from 'lucide-react';
import { schools, grades, classMap } from '../../data/schools.js';

export function LeaderboardFilters({ filters, setFilters }) {
  const set = (key, value) => setFilters({...filters, [key]:value});
  return <div className="filter-bar"><div className="filter-title"><Filter size={18}/><b>Bộ lọc</b></div><select value={filters.school} onChange={e=>set('school',e.target.value)}><option>Tất cả trường</option>{schools.map(x=><option key={x}>{x}</option>)}</select><select value={filters.grade} onChange={e=>set('grade',e.target.value)}><option>Tất cả khối</option>{grades.map(x=><option key={x}>{x}</option>)}</select><select value={filters.className} onChange={e=>set('className',e.target.value)}><option>Tất cả lớp</option>{Object.values(classMap).flat().map(x=><option key={x}>{x}</option>)}</select><select value={filters.period} onChange={e=>set('period',e.target.value)}><option>Tuần</option><option>Ngày</option><option>Tháng</option><option>Tất cả</option></select><select value={filters.mode} onChange={e=>set('mode',e.target.value)}><option>Thi thử</option><option>Ôn tập</option><option>Tất cả</option></select><button className="reset-filter" onClick={()=>setFilters({school:'Tất cả trường',grade:'Tất cả khối',className:'Tất cả lớp',period:'Tuần',mode:'Thi thử'})}><RotateCcw size={16}/> Đặt lại</button></div>;
}
