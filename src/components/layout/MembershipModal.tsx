import { useEffect, useState } from 'react';
import { useAppState } from '../../hooks/AppState';
import { cx } from '../../utils';
import { Icon } from '../ui/Icon';
import { Badge, Button } from '../ui/primitives';
import { plans } from '../marketing/plans';
import { track } from '../../analytics/track';

export function MembershipModal() {
  const { membershipOpen, membershipSource, closeMembership } = useAppState();
  const [selected, setSelected] = useState('pro');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!membershipOpen) return;
    setDone(false);
    track('membership_view', { source: membershipSource });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMembership();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [membershipOpen, membershipSource, closeMembership]);

  if (!membershipOpen) return null;
  const plan = plans.find((p) => p.id === selected)!;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="membership-title" onClick={closeMembership}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal__close" onClick={closeMembership} aria-label="Close">
          <Icon name="close" />
        </button>
        {done ? (
          <div className="modal__done">
            <span className="modal__check">
              <Icon name="check" size={28} />
            </span>
            <h3>You're on the list</h3>
            <p>
              This is a prototype, so nothing was charged and no account was created. In the MVP this step hands off to a secure
              payment provider and links your Telegram companion.
            </p>
            <Button onClick={closeMembership}>Back to the demo</Button>
          </div>
        ) : (
          <>
            <Badge tone="caution" icon="lock">Prototype — payments not connected</Badge>
            <h3 id="membership-title" className="modal__title">Choose your membership</h3>
            <p className="modal__sub">Indicative pricing for the prototype. Cancel anytime. 18+ only.</p>
            <div className="modal__plans">
              {plans.map((p) => (
                <button key={p.id} className={cx('plan-option', selected === p.id && 'is-selected')} onClick={() => setSelected(p.id)}>
                  <span className="plan-option__name">
                    {p.name} {p.highlight && <Badge tone="accent">Most popular</Badge>}
                  </span>
                  <span className="plan-option__price">
                    {p.price}
                    <small>{p.period}</small>
                  </span>
                  <span className="plan-option__desc">{p.tagline}</span>
                </button>
              ))}
            </div>
            <ul className="modal__features">
              {plan.features.map((f) => (
                <li key={f}>
                  <Icon name="check" size={16} /> {f}
                </li>
              ))}
            </ul>
            <label className="modal__confirm">
              <input type="checkbox" defaultChecked /> I confirm I am 18 or older.
            </label>
            <Button size="lg" className="w-full" onClick={() => setDone(true)}>
              Continue with {plan.name} (demo)
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
