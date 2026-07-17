import { BarChart3, BookOpen, Building2, ClipboardCheck, Download, FileQuestion, LayoutDashboard, LogOut, School, Settings2, ShieldCheck, UserCog, Users } from 'lucide-react';
import { Logo } from '../common/Logo.jsx';

export function AdminShell({ role, active, setActive, go, children }) {
  const teacherMenu = [[LayoutDashboard,'Tổng quan'],[Users,'Lớp & học sinh'],[ClipboardCheck,'Kết quả học tập'],[BarChart3,'Thống kê'],[Download,'Xuất báo cáo']];
  const adminMenu = [[LayoutDashboard,'Tổng quan'],[FileQuestion,'Ngân hàng câu hỏi'],[UserCog,'Giáo viên'],[Users,'Học sinh'],[Building2,'Trường & lớp'],[BookOpen,'Chủ đề'],[Settings2,'Cấu hình bài thi'],[BarChart3,'Báo cáo']];
  const menu = role==='teacher'?teacherMenu:adminMenu;
  return <div className="admin-layout"><aside className="admin-sidebar"><Logo/><div className="role-card"><span>{role==='teacher'?<School/>:<ShieldCheck/>}</span><div><small>Đăng nhập với vai trò</small><b>{role==='teacher'?'Giáo viên':'Quản trị viên'}</b></div></div><nav>{menu.map(([Icon,label])=><button key={label} className={active===label?'active':''} onClick={()=>setActive(label)}><Icon size={19}/>{label}{active===label&&<i/>}</button>)}</nav><button className="logout-button" onClick={()=>go('home')}><LogOut size={18}/> Đăng xuất</button></aside><div className="admin-main">{children}</div></div>;
}
