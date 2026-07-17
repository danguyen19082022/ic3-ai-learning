import { BrainCircuit } from 'lucide-react';
import { cx } from '../../utils/classNames.js';

export function RobotBuddy({ small = false }) {
  return (
    <div className={cx('robot-buddy', small && 'robot-small')} aria-hidden="true">
      <div className="robot-antenna"><span /></div>
      <div className="robot-head">
        <div className="robot-face"><i /><i /></div>
        <div className="robot-mouth" />
      </div>
      <div className="robot-body"><BrainCircuit size={small ? 17 : 25} /></div>
      <div className="robot-shadow" />
    </div>
  );
}
