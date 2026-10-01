import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppState } from '../../hooks/AppState';
import { cx } from '../../utils';
import { Icon, type IconName } from '../ui/Icon';
import { Avatar, Button } from '../ui/primitives';
import { Logo } from './Logo';

const links: { to: string; label: string; icon: IconName; end?: boolean; preview?: boolean }[] = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/matches', label: 'Match Center', icon: 'pitch' },
  { to: '/track-record', label: 'Track Record', icon: 'ledger' },
  { to: '/me', label: 'My Vision X1', icon: 'user' },
  { to: '/assistant', label: 'Assistant', icon: 'spark', preview: true },
];

export function Nav() {
  const { theme, toggleTheme, openMembership } = useAppState();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="nav">
      <div className="nav__inner container">
        <Logo />
        <nav className={cx('nav__links', open && 'is-open')} aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cx('nav__link', l.preview && 'nav__link--preview', (isActive || (l.to === '/matches' && pathname.startsWith('/match/'))) && 'is-active')
              }
            >
              <Icon name={l.icon} size={16} />
              {l.label}
              {l.preview && <span className="pill-preview">Preview</span>}
            </NavLink>
          ))}
          <Button variant="primary" size="sm" className="nav__cta-mobile" onClick={openMembership}>
            Get membership
          </Button>
        </nav>
        <div className="nav__right">
          <button className="icon-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <Button variant="primary" size="sm" className="nav__cta" onClick={openMembership}>
            Get membership
          </Button>
          <NavLink to="/me" className="nav__avatar" aria-label="My Vision X1 (demo account)">
            <Avatar initials="AM" size={32} />
          </NavLink>
          <button className="icon-btn nav__burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  );
}
