import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Vision X1 home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" className="logo__bg" />
        <path d="M8 9l5.5 14h1L20 9" fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 15l5 8M24 15l-5 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span className="logo__word">
        VISION <span>X1</span>
      </span>
    </Link>
  );
}
