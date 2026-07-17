import { useEffect } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { cx } from '../../utils/classNames.js';

export function Toast({ toast, close }) {
  useEffect(()=>{if(!toast)return;const id=setTimeout(close,3200);return()=>clearTimeout(id);},[toast]);
  if(!toast)return null; return <div className={cx('toast',toast.type)}>{toast.type==='error'?<XCircle/>:<CheckCircle2/>}<span>{toast.text}</span><button onClick={close}><X/></button></div>;
}
