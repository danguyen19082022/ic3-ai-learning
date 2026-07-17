import { Award, Medal, Trophy } from 'lucide-react';
import { cx } from '../../utils/classNames.js';

export function RankBadge({ rank }) {
  const icons = [<Trophy size={16} />, <Medal size={16} />, <Award size={16} />];
  return <span className={cx('rank-badge', rank <= 3 && `top-${rank}`)}>{icons[rank - 1] || rank}</span>;
}
