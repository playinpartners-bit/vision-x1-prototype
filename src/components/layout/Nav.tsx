import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppState } from '../../hooks/AppState';
import { cx } from '../../utils';
import { Icon, type IconName } from '../ui/Icon';
import { Avatar, Button } from '../ui/primitives';
import { Logo } from './Logo';

const links: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/dashboard', label: 'Dashboard', icon: 'grid' },
  { to: '/match/psg-marseille', label: 'Match Centre', icon: 'pitch' },
  { to: '/assistant', label: 'AI Assistant', icon: 'spark' },
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
                cx('nav__link', (isActive || (l.to.startsWith('/match') && pathname.startsWith('/match'))) && 'is-active')
              }
            >
              <Icon name={l.icon} size={16} />
              {l.label}
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
          <NavLink to="/dashboard" className="nav__avatar" aria-label="Demo account">
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
