import { FileQuestion, Home } from 'lucide-react';

export function EmptyAttempt({ go, title, text }) {
  return <main className="result-page page-shell"><section className="empty-attempt"><span className="modal-icon"><FileQuestion/></span><h1>{title}</h1><p>{text}</p><button className="primary-button" onClick={() => go('student')}><Home size={17}/> Về Dashboard</button></section></main>;
}
