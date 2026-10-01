import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '../../utils';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  iconRight?: IconName;
  to?: string;
}

export function Button({ variant = 'primary', size = 'md', icon, iconRight, to, className, children, ...rest }: ButtonProps) {
  const cls = cx('btn', `btn--${variant}`, `btn--${size}`, className);
  const inner = (
    <>
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 15 : 17} />}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}

export function Card({
  children,
  className,
  as: As = 'div',
  interactive,
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section' | 'aside';
  interactive?: boolean;
}) {
  return <As className={cx('card', interactive && 'card--interactive', className)}>{children}</As>;
}

export function Badge({
  children,
  tone = 'neutral',
  icon,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'accent' | 'ai' | 'caution' | 'live' | 'outline';
  icon?: IconName;
}) {
  return (
    <span className={cx('badge', `badge--${tone}`)}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}

/** The DEMO label. Use wherever data or outputs are illustrative. */
export function DemoTag({ label = 'Demo data' }: { label?: string }) {
  return (
    <span className="demo-tag" title="Illustrative data for the prototype — not real or live.">
      {label}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <header className={cx('section-header', align === 'center' && 'section-header--center')}>
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2 className="section-title">{title}</h2>
        {description && <p className="section-desc">{description}</p>}
      </div>
      {action && <div className="section-header__action">{action}</div>}
    </header>
  );
}

export function Avatar({ initials, size = 36, tone = 'accent' }: { initials: string; size?: number; tone?: 'accent' | 'ai' }) {
  return (
    <span className={cx('avatar', `avatar--${tone}`)} style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {initials}
    </span>
  );
}

export function Skeleton({ height = 16, width = '100%', radius = 8 }: { height?: number; width?: number | string; radius?: number }) {
  return <span className="skeleton" style={{ height, width, borderRadius: radius }} />;
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card card--pad" aria-busy="true">
      <Skeleton height={14} width="40%" />
      <div style={{ height: 14 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <Skeleton height={12} width={`${90 - i * 12}%`} />
        </div>
      ))}
    </div>
  );
}

export function StrengthDots({ value, max = 3 }: { value: number; max?: number }) {
  return (
    <span className="strength" aria-label={`Signal strength ${value} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={cx('strength__dot', i < value && 'is-on')} />
      ))}
    </span>
  );
}
