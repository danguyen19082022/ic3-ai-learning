import { BrainCircuit } from 'lucide-react';

export function Logo({ compact = false }) {
  return (
    <div className="brand">
      <div className="brand-mark"><BrainCircuit size={25} /></div>
      {!compact && <div><strong>IC3 <span>AI</span> Learning</strong><small>Học thông minh · Vững kỹ năng số</small></div>}
    </div>
  );
}
