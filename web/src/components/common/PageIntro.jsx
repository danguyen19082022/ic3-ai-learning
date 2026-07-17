export function PageIntro({ eyebrow, title, text, action }) {
  return <div className="page-intro"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{text && <p>{text}</p>}</div>{action}</div>;
}
