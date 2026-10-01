import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { football, user } from '../services';
import { useAsync } from '../hooks/useAsync';
import { useAppState } from '../hooks/AppState';
import { Icon, type IconName } from '../components/ui/Icon';
import { Avatar, Badge, Button, Card, DemoTag } from '../components/ui/primitives';
import { TeamCrest } from '../components/match/TeamCrest';
import { CoveragePills } from '../components/layers/Layers';
import { OutcomeBadge } from '../components/trust/Trust';
import { ordinal } from '../components/match/MatchParts';
import type { AlertPref, CompanionNotification, Match } from '../types/football';
import { cx, formatDay, formatKickoff, leadTime, timeAgo } from '../utils';

const notifIcon: Record<CompanionNotification['kind'], IconName> = { insight: 'shield', alert: 'alert', lineup: 'users', digest: 'layers' };

function Toggle({ pref, onChange }: { pref: AlertPref; onChange: (on: boolean) => void }) {
  return (
    <label className="pref">
      <span className="pref__text">
        <strong>{pref.label}</strong>
        <span className="muted small">{pref.detail}</span>
      </span>
      <button type="button" role="switch" aria-checked={pref.on} className={cx('switch', pref.on && 'is-on')} onClick={() => onChange(!pref.on)}>
        <span />
      </button>
    </label>
  );
}

export function MyVisionPage() {
  const me = useAsync(() => user.getCurrentUser());
  const today = useAsync(() => football.getMatches(0));
  const tomorrow = useAsync(() => football.getMatches(1));
  const history = useAsync(() => user.getReadingHistory());
  const notifs = useAsync(() => user.getNotifications());
  const prefsRes = useAsync(() => user.getAlertPrefs());
  const [prefs, setPrefs] = useState<AlertPref[]>([]);
  useEffect(() => prefsRes.data && setPrefs(prefsRes.data), [prefsRes.data]);
  const { savedMatchIds, openMembership } = useAppState();

  const all: Match[] = [...(today.data ?? []), ...(tomorrow.data ?? [])];
  const saved = savedMatchIds.map((id) => all.find((m) => m.id === id)).filter(Boolean) as Match[];
  const knownTeams = all.flatMap((m) => [m.home, m.away]);
  const teams = (me.data?.favouriteTeamIds ?? []).map((id) => knownTeams.find((t) => t.id === id)).filter((t) => t !== undefined);

  return (
    <div className="container page">
      <header className="dash-head">
        <div className="dash-head__user">
          <Avatar initials={me.data?.initials ?? '··'} size={52} />
          <div>
            <span className="eyebrow">My Vision X1</span>
            <h1 className="page-title">{me.data ? `Welcome back, ${me.data.name.split(' ')[0]}` : '…'}</h1>
            <p className="muted small">
              {new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })} · {saved.length} matches followed
            </p>
          </div>
        </div>
        <div className="dash-head__meta">
          {me.data && <Badge tone="accent">{me.data.plan} member</Badge>}
          <DemoTag label="Demo account" />
        </div>
      </header>

      <div className="my-grid">
        <div className="my-main">
          <section>
            <div className="block-head">
              <h2 className="block-title">
                <Icon name="bookmark" size={18} /> Your match pages
              </h2>
              <Link to="/matches" className="link-inline">
                Match Center <Icon name="arrowRight" size={13} />
              </Link>
            </div>
            {saved.length === 0 ? (
              <Card className="card--pad muted">Follow a match from the Match Center and it will appear here.</Card>
            ) : (
              <div className="my-matches">
                {saved.map((m) => (
                  <Link key={m.id} to={`/match/${m.id}`} className="card card--interactive my-match">
                    <div className="my-match__teams">
                      <TeamCrest team={m.home} size={30} />
                      <TeamCrest team={m.away} size={30} />
                      <div>
                        <strong>
                          {m.home.shortName} vs {m.away.shortName}
                        </strong>
                        <div className="muted small">
                          {m.competition.name} · {formatDay(m.kickoff)} {formatKickoff(m.kickoff)}
                        </div>
                      </div>
                    </div>
                    <CoveragePills coverage={m.coverage} />
                    <div className="my-match__call">
                      {m.call ? (
                        <>
                          <span className="muted small">
                            <Icon name="lock" size={12} /> Vision X1 View
                          </span>
                          <strong>{m.call.view}</strong>
                        </>
                      ) : (
                        <span className="muted small">No Vision X1 View</span>
                      )}
                    </div>
                    <Icon name="chevronRight" size={18} />
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="block-head">
              <h2 className="block-title">
                <Icon name="history" size={18} /> Reading history
              </h2>
              <span className="muted small">Match pages you read, and how each View was graded</span>
            </div>
            <Card className="table-card">
              <table className="table">
                <thead>
                  <tr>
                    <th>Match</th>
                    <th className="hide-sm">You read it</th>
                    <th>Vision X1 View</th>
                    <th>Result</th>
                    <th>Graded</th>
                  </tr>
                </thead>
                <tbody>
                  {history.data?.map((h) => (
                    <tr key={h.id}>
                      <td>
                        <div className="strong">
                          {h.call.home} vs {h.call.away}
                        </div>
                        <div className="muted small">
                          {h.call.competition} · {formatDay(h.call.kickoff)}
                        </div>
                      </td>
                      <td className="hide-sm muted small">{leadTime(h.openedAt, h.call.kickoff)} before KO</td>
                      <td>{h.call.view}</td>
                      <td className="mono">{h.call.finalScore ?? '—'}</td>
                      <td>
                        <OutcomeBadge outcome={h.call.outcome} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>

          <section>
            <div className="block-head">
              <h2 className="block-title">
                <Icon name="users" size={18} /> Teams you follow
              </h2>
            </div>
            <div className="team-chips">
              {teams.map((t) => (
                <span key={t.id} className="team-chip">
                  <TeamCrest team={t} size={24} /> {t.name}
                  <span className="muted small">· {ordinal(t.season.position)}</span>
                </span>
              ))}
              <button className="team-chip team-chip--add">+ Follow a team</button>
            </div>
          </section>
        </div>

        <aside className="my-side">
          <Card className="side-card pocket">
            <div className="side-card__head">
              <h3>
                <Icon name="pocket" size={17} /> Vision X1 in your pocket
              </h3>
              <Badge tone="accent" icon="telegram">Linked</Badge>
            </div>
            <p className="muted small">Briefings, alerts and community on Telegram. The match page stays the source of truth.</p>
            <div className="prefs">
              {prefs.map((p) => (
                <Toggle key={p.id} pref={p} onChange={(on) => setPrefs((ps) => ps.map((x) => (x.id === p.id ? { ...x, on } : x)))} />
              ))}
            </div>
            <h4 className="side-label">Latest on Telegram</h4>
            <ul className="notifs">
              {notifs.data?.slice(0, 3).map((n) => (
                <li key={n.id}>
                  <Link to={n.matchId ? `/match/${n.matchId}` : '/matches'} className="notif">
                    <span className={cx('notif__icon', `notif__icon--${n.kind}`)}>
                      <Icon name={notifIcon[n.kind]} size={15} />
                    </span>
                    <span className="notif__body">
                      <span className="notif__title">
                        {n.title} <span className="muted small">· {timeAgo(n.minutesAgo)}</span>
                      </span>
                      <span className="notif__text">{n.body}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="side-card membership-card">
            <div className="side-card__head">
              <h3>Membership</h3>
              <Badge tone="accent">{me.data?.plan ?? '—'}</Badge>
            </div>
            <p className="muted small">
              Member since {me.data ? new Date(me.data.memberSince).toLocaleDateString([], { month: 'long', year: 'numeric' }) : '—'}. Full
              match pages, every Vision X1 View and Telegram alerts.
            </p>
            <Button variant="secondary" size="sm" onClick={() => openMembership('my_vision')}>
              Manage plan (demo)
            </Button>
          </Card>

          <Card className="side-card side-card--assistant">
            <span className="pill-preview">Preview · future layer</span>
            <h3>Ask Vision X1</h3>
            <p className="muted small">An AI research assistant that answers questions about a match page. In concept stage.</p>
            <Button to="/assistant" size="sm" variant="secondary" iconRight="arrowRight">
              See the concept
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
