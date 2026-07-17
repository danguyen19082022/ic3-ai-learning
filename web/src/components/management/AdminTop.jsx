import { CalendarDays, Menu } from 'lucide-react';

export function AdminTop({ title, subtitle, name, onMenu }) {
  return <div className="admin-top"><div><button className="admin-mobile-menu" onClick={onMenu}><Menu/></button><span className="eyebrow">IC3 AI Learning</span><h1>{title}</h1><p>{subtitle}</p></div><div className="admin-user"><button className="icon-button"><CalendarDays size={19}/></button><span>{name[0]}</span><div><b>{name}</b><small>Hôm nay, 16/07/2026</small></div></div></div>;
}
