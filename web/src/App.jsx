import { useState } from 'react';
import { useHashPage } from './hooks/useHashPage.js';
import { readLastAttempt } from './utils/attemptStorage.js';
import { Toast } from './components/common/Toast.jsx';
import { AppHeader } from './components/layout/AppHeader.jsx';
import { AppFooter } from './components/layout/AppFooter.jsx';
import { HomePage } from './pages/home/HomePage.jsx';
import { StudentDashboard } from './pages/student/StudentDashboard.jsx';
import { ModePage } from './pages/mode/ModePage.jsx';
import { TopicsPage } from './pages/topics/TopicsPage.jsx';
import { QuizPage } from './pages/quiz/QuizPage.jsx';
import { ResultPage } from './pages/result/ResultPage.jsx';
import { ReviewPage } from './pages/review/ReviewPage.jsx';
import { LeaderboardPage } from './pages/leaderboard/LeaderboardPage.jsx';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';


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

export default App;
