import { useEffect, useState, type FormEvent } from 'react';
import { useAppState } from '../../hooks/AppState';
import { Icon } from '../ui/Icon';
import { Badge, Button } from '../ui/primitives';

const FREE = ['Data layer on every match page', 'Public Track Record', 'Morning briefing on Telegram', 'Follow matches in My Vision X1'];

/** Demo-only free-account step. Nothing is stored or sent. */
export function AccountModal() {
  const { accountOpen, closeAccount, openMembership } = useAppState();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!accountOpen) return;
    setDone(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeAccount();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [accountOpen, closeAccount]);

  if (!accountOpen) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="account-title" onClick={closeAccount}>
      <div className="modal__panel modal__panel--narrow" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal__close" onClick={closeAccount} aria-label="Close">
          <Icon name="close" />
        </button>
        {done ? (
          <div className="modal__done">
            <span className="modal__check">
              <Icon name="check" size={28} />
            </span>
            <h3>Welcome to Vision X1</h3>
            <p>Prototype only: no account was created and nothing was stored. In the MVP this step creates a free account.</p>
            <Button to="/match/psg-marseille" onClick={closeAccount} iconRight="arrowRight">
              Explore the match
            </Button>
          </div>
        ) : (
          <>
            <Badge tone="caution" icon="lock">Prototype — accounts not connected</Badge>
            <h3 id="account-title" className="modal__title">Create your free account</h3>
            <p className="modal__sub">Free forever. No card needed. 18+ only.</p>
            <ul className="modal__features modal__features--single">
              {FREE.map((f) => (
                <li key={f}>
                  <Icon name="check" size={16} /> {f}
                </li>
              ))}
            </ul>
            <form onSubmit={submit} className="account-form">
              <label className="field">
                <span>Email</span>
                <input type="email" placeholder="you@example.com" required />
              </label>
              <label className="modal__confirm">
                <input type="checkbox" required /> I confirm I am 18 or older.
              </label>
              <Button size="lg" className="w-full" type="submit">
                Create free account (demo)
              </Button>
            </form>
            <p className="muted small account-form__alt">
              Want every layer?{' '}
              <button
                className="link-btn"
                onClick={() => {
                  closeAccount();
                  openMembership('account_modal');
                }}
              >
                See membership plans
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
