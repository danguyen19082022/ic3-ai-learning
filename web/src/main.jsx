import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Check, ChevronRight,
  Download,
  KeyRound,
  Pencil,
  Plus, School, Search, Settings2,
  Upload,
  X
} from 'lucide-react';
import './styles.css';
import { grades } from './data/schools.js';
import { teacherStudents, questionBank } from './data/management.js';
import { useHashPage } from './hooks/useHashPage.js';
import { readLastAttempt } from './utils/attemptStorage.js';
import { downloadCsv } from './utils/exportCsv.js';
import { Toast } from './components/common/Toast.jsx';
import { AppHeader } from './components/layout/AppHeader.jsx';
import { AppFooter } from './components/layout/AppFooter.jsx';
import { AdminShell } from './components/management/AdminShell.jsx';
import { AdminTop } from './components/management/AdminTop.jsx';
import { ManagementStats } from './components/management/ManagementStats.jsx';
import { HomePage } from './pages/home/HomePage.jsx';
import { StudentDashboard } from './pages/student/StudentDashboard.jsx';
import { ModePage } from './pages/mode/ModePage.jsx';
import { TopicsPage } from './pages/topics/TopicsPage.jsx';
import { QuizPage } from './pages/quiz/QuizPage.jsx';
import { ResultPage } from './pages/result/ResultPage.jsx';
import { ReviewPage } from './pages/review/ReviewPage.jsx';
import { LeaderboardPage } from './pages/leaderboard/LeaderboardPage.jsx';


function TeacherDashboard({ go, setToast }) {
  const [active,setActive]=useState('Tổng quan'); const [search,setSearch]=useState('');
  const rows=teacherStudents.filter(r=>r[0].toLowerCase().includes(search.toLowerCase()));
  return <AdminShell role="teacher" active={active} setActive={setActive} go={go}><AdminTop title={active} subtitle="Theo dõi lớp học và tiến bộ của học sinh." name="Nguyễn Minh Anh"/><ManagementStats/>
    <div className="management-grid"><section className="data-card class-performance"><div className="section-heading"><div><span className="eyebrow">Hiệu suất lớp học</span><h2>Kết quả theo lớp</h2></div><select><option>Tuần này</option><option>Tháng này</option></select></div>{[['6A1',88,42],['6A2',82,40],['7A1',91,38],['7A2',76,36]].map(([c,p,n])=><div className="performance-row" key={c}><span className="class-icon"><School/></span><div><b>Lớp {c}</b><small>{n} học sinh</small></div><div className="bar"><i style={{width:`${p}%`}}/></div><strong>{p}%</strong></div>)}</section><section className="data-card quick-report"><div className="section-heading"><div><span className="eyebrow">Tổng quan</span><h2>Tiến bộ học tập</h2></div></div><div className="donut"><div><b>84%</b><small>Tỉ lệ đạt</small></div></div><div className="donut-legend"><span><i className="green"/>Đạt yêu cầu <b>156</b></span><span><i className="orange"/>Cần cố gắng <b>30</b></span></div></section></div>
    <section className="data-card students-table"><div className="section-heading"><div><span className="eyebrow">Quản lý lớp học</span><h2>Danh sách học sinh</h2></div><div className="table-actions"><label className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm học sinh..."/></label><button className="outline-button" onClick={()=>downloadCsv('bao-cao-hoc-sinh.csv',[['Họ tên','Lớp','Số bài','Điểm'],...teacherStudents])}><Download size={17}/> Xuất Excel</button></div></div><div className="table-head"><span>Học sinh</span><span>Lớp</span><span>Số bài đã làm</span><span>Điểm gần nhất</span><span>Trạng thái</span><span>Thao tác</span></div>{rows.map((r,i)=><div className="table-row" key={r[0]}><span data-label="Học sinh"><span className="tiny-avatar">{r[0].slice(-1)}</span><b>{r[0]}</b></span><span data-label="Lớp">{r[1]}</span><span data-label="Số bài">{r[2]}</span><span data-label="Điểm" className="score-cell">{r[3]}</span><span data-label="Trạng thái"><b className={r[4]==='Đang hoạt động'?'status-active':'status-pause'}>{r[4]}</b></span><span data-label="Thao tác"><button className="icon-button" title="Reset mật khẩu" onClick={()=>setToast({type:'success',text:`Đã đặt lại mật khẩu mẫu cho ${r[0]}.`})}><KeyRound size={17}/></button><button className="icon-button"><ChevronRight size={17}/></button></span></div>)}</section>
  </AdminShell>;
}


function AdminDashboard({ go, setToast }) {
  const [active,setActive]=useState('Tổng quan'); const [showForm,setShowForm]=useState(false);
  return <AdminShell role="admin" active={active} setActive={setActive} go={go}><AdminTop title={active} subtitle="Quản lý dữ liệu và vận hành toàn bộ hệ thống." name="Admin IC3"/><ManagementStats admin/>
    <div className="admin-overview-grid"><section className="data-card system-chart"><div className="section-heading"><div><span className="eyebrow">Hoạt động hệ thống</span><h2>Lượt làm bài trong tuần</h2></div><select><option>7 ngày qua</option><option>30 ngày qua</option></select></div><div className="bar-chart">{[54,72,60,88,76,94,68].map((v,i)=><div key={i}><span style={{height:`${v}%`}}><i>{v}</i></span><small>{['T2','T3','T4','T5','T6','T7','CN'][i]}</small></div>)}</div></section><section className="data-card system-health"><div className="section-heading"><div><span className="eyebrow">Chất lượng dữ liệu</span><h2>Trạng thái câu hỏi</h2></div></div>{[['Đang sử dụng',1135,91,'green'],['Cần chỉnh sửa',72,6,'orange'],['Tạm ẩn',41,3,'gray']].map(([l,n,p,c])=><div className="health-row" key={l}><div><span><i className={c}/>{l}</span><b>{n}</b></div><div className="bar"><i className={c} style={{width:`${p}%`}}/></div></div>)}</section></div>
    <section className="data-card question-table"><div className="section-heading"><div><span className="eyebrow">Ngân hàng dữ liệu</span><h2>Câu hỏi gần đây</h2></div><div className="table-actions"><button className="outline-button" onClick={()=>downloadCsv('ngan-hang-cau-hoi.csv',[['Mã','Câu hỏi','Dạng','Khối','Trạng thái'],...questionBank])}><Download size={17}/> Xuất dữ liệu</button><button className="primary-button small" onClick={()=>setShowForm(true)}><Plus size={17}/> Thêm câu hỏi</button></div></div><div className="table-head"><span>Mã</span><span>Nội dung câu hỏi</span><span>Dạng</span><span>Khối</span><span>Trạng thái</span><span>Thao tác</span></div>{questionBank.map(r=><div className="table-row" key={r[0]}>{r.map((cell,i)=><span key={i} data-label={['Mã','Nội dung','Dạng','Khối','Trạng thái'][i]}>{i===4?<b className={cell==='Đang sử dụng'?'status-active':cell==='Tạm ẩn'?'status-pause':'status-edit'}>{cell}</b>:i===0?<b>{cell}</b>:cell}</span>)}<span data-label="Thao tác"><button className="icon-button" onClick={()=>setShowForm(true)}><Pencil size={16}/></button><button className="icon-button"><ChevronRight size={16}/></button></span></div>)}</section>
    <section className="configuration-strip"><div><span className="config-icon"><Settings2/></span><div><b>Cấu hình bài làm</b><small>Thi thử: 45 câu · 50 phút　|　Ôn tập: 30 phút / chủ đề</small></div></div><button className="outline-button" onClick={()=>setActive('Cấu hình bài thi')}>Điều chỉnh cấu hình <ChevronRight size={17}/></button></section>
    {showForm&&<div className="overlay modal-overlay"><form className="admin-form" onSubmit={e=>{e.preventDefault();setShowForm(false);setToast({type:'success',text:'Đã lưu câu hỏi mẫu vào giao diện prototype.'});}}><div className="drawer-head"><div><span className="eyebrow">Ngân hàng câu hỏi</span><h2>Thêm câu hỏi mới</h2></div><button type="button" className="icon-button" onClick={()=>setShowForm(false)}><X/></button></div><label className="field"><span>Nội dung câu hỏi</span><textarea placeholder="Nhập nội dung câu hỏi..." required/></label><div className="form-grid"><label className="field"><span>Dạng câu hỏi</span><select><option>Single choice</option><option>Multiple choice</option><option>Matching</option><option>Reorder</option><option>Hotspot</option></select></label><label className="field"><span>Khối</span><select>{grades.map(x=><option key={x}>{x}</option>)}</select></label></div><label className="field"><span>Trạng thái</span><select><option>Đang sử dụng</option><option>Tạm ẩn</option><option>Cần chỉnh sửa</option></select></label><div className="upload-box"><Upload/><b>Tải ảnh minh họa hoặc Hotspot</b><small>PNG, JPG · tối đa 5 MB</small></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowForm(false)}>Hủy</button><button className="primary-button" type="submit"><Check/> Lưu câu hỏi</button></div></form></div>}
  </AdminShell>;
}


function App() {
  const [page, go] = useHashPage();
  const [student, setStudent] = useState({ name:'Nguyễn Văn A', school:'THCS Nguyễn Trãi', grade:'Khối 6', className:'6A1' });
  const [quizMode,setQuizMode]=useState('Thi thử');
  const [quizScope,setQuizScope]=useState('Toàn bộ Khối 6');
  const [resultData,setResultData]=useState(() => readLastAttempt());
  const [toast,setToast]=useState(null);
  const retryAttempt = (attempt) => { setQuizMode(attempt.mode); setQuizScope(attempt.scope); setResultData(null); go('quiz'); };
  const bare=['quiz','review','teacher','admin'].includes(page);
  let content;
  if(page==='home')content=<HomePage go={go} onLogin={setStudent} setToast={setToast}/>;
  else if(page==='student')content=<StudentDashboard go={go} student={student}/>;
  else if(page==='mode')content=<ModePage go={go} setQuizMode={setQuizMode} setQuizScope={setQuizScope}/>;
  else if(page==='topics')content=<TopicsPage go={go} setQuizMode={setQuizMode} setQuizScope={setQuizScope} student={student}/>;
  else if(page==='quiz')content=<QuizPage go={go} quizMode={quizMode} quizScope={quizScope} setResultData={setResultData}/>;
  else if(page==='result')content=<ResultPage go={go} resultData={resultData} onRetry={retryAttempt}/>;
  else if(page==='review')content=<ReviewPage go={go} resultData={resultData}/>;
  else if(page==='leaderboard')content=<LeaderboardPage/>;
  else if(page==='teacher')content=<TeacherDashboard go={go} setToast={setToast}/>;
  else if(page==='admin')content=<AdminDashboard go={go} setToast={setToast}/>;
  return <div className="app">{!bare&&<AppHeader page={page} go={go} student={student}/>} {content}{!bare&&<AppFooter go={go} />}<Toast toast={toast} close={()=>setToast(null)}/></div>;
}

createRoot(document.getElementById('root')).render(<App />);
