import { Building2, ClipboardCheck, FileQuestion, School, Target, TrendingUp, Users } from 'lucide-react';

export function ManagementStats({ admin=false }) {
  const data=admin?[[Building2,'03','Trường','blue'],[Users,'528','Học sinh','violet'],[FileQuestion,'1.248','Câu hỏi','cyan'],[Target,'87%','Tỉ lệ đạt','green']]:[[School,'06','Lớp phụ trách','blue'],[Users,'186','Học sinh','violet'],[ClipboardCheck,'74','Bài làm tuần này','cyan'],[TrendingUp,'84%','Tỉ lệ đạt','green']];
  return <div className="management-stats">{data.map(([Icon,val,label,color])=><article key={label}><span className={`stat-icon ${color}`}><Icon/></span><div><strong>{val}</strong><small>{label}</small></div><TrendingUp size={16}/></article>)}</div>;
}
