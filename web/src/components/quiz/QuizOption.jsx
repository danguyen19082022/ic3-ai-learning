import { Check } from 'lucide-react';
import { cx } from '../../utils/classNames.js';

export function QuizOption({ selected, multi, children, onClick, state }) {
  return <button className={cx('answer-option', selected && 'selected', state)} onClick={onClick}><span className={multi ? 'checkbox-ui' : 'radio-ui'}>{selected && <Check size={15}/>}</span><span>{children}</span></button>;
}
