import { Link } from 'react-router-dom';
import { football, user } from '../services';
import { useAsync } from '../hooks/useAsync';
import { useAppState } from '../hooks/AppState';
import { Icon, type IconName } from '../components/ui/Icon';
import { Avatar, Badge, Button, Card, CardSkeleton, DemoTag, Skeleton } from '../components/ui/primitives';
import { MatchRow } from '../components/match/MatchCard';
import { TeamCrest } from '../components/match/TeamCrest';
import { FormStrip } from '../components/match/FormStrip';
import { AiAnalysisCard, ExpertCard, SignalList } from '../components/match/Insights';
import { ResponsibleNote } from '../components/layout/Footer';
import type { CompanionNotification, Match } from '../types/football';
import { cx, formatDay, formatKickoff, timeAgo } from '../utils';

const notifIcon: Record<CompanionNotification['kind'], IconName> = {
  insight: 'shield',
  alert: 'alert',
  lineup: 'users',
  digest: 'layers',
};

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export function DashboardPage() {
  const today = useAsync(() => football.getMatches(0));
  const tomorrow = useAsync(() => football.getMatches(1));
  const featured = useAsync(() => football.getMatchDetail('psg-marseille'));
  const ai = useAsync(() => football.getAiAnalyses());
  const experts = useAsync(() => football.getExpertInsights());
  const me = useAsync(() => user.getCurrentUser());
  const history = useAsync(() => user.getHistory());
  const notifs = useAsync(() => user.getNotifications());
  const { savedMatchIds } = useAppState();

  const allMatches: Match[] = [...(today.data ?? []), ...(tomorrow.data ?? [])];
  const byId = (id: string) => allMatches.find((m) => m.id === id);
  const saved = savedMatchIds.map(byId).filter(Boolean) as Match[];
  const fd = featured.data;

  const kpis: { label: string; value: string | number; icon: IconName }[] = [
    { label: "Today's fixtures", value: today.data?.length ?? '—', icon: 'pitch' },
    { label: 'AI analyses ready', value: ai.data?.length ?? '—', icon: 'spark' },
    { label: 'Expert insights', value: experts.data?.length ?? '—', icon: 'shield' },
    { label: 'Saved matches', value: saved.length, icon: 'bookmark' },
  ];

  return (
    <div className="container page">
      <header className="dash-head">
        <div className="dash-head__user">
          <Avatar initials={me.data?.initials ?? '··'} size={48} />
          <div>
            <h1 className="page-title">
              {greeting()}, {me.data?.name.split(' ')[0] ?? '…'}
            </h1>
            <p className="muted">
              {new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })} · Your football intelligence
              briefing
            </p>
          </div>
        </div>
        <div className="dash-head__meta">
          {me.data && <Badge tone="accent">{me.data.plan} member</Badge>}
          <DemoTag label="Demo account" />
        </div>
      </header>

      <div className="kpis">
        {kpis.map((k) => (
          <Card key={k.label} className="kpi">
            <span className="kpi__icon">
              <Icon name={k.icon} size={18} />
            </span>
            <div>
              <div className="kpi__value">{k.value}</div>
              <div className="kpi__label">{k.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="dash-grid">
        <div className="dash-main">
          {/* Featured */}
          {fd && fd.intel ? (
            <Link to={`/match/${fd.match.id}`} className="card card--interactive featured">
              <div className="featured__head">
                <div>
                  <span className="eyebrow">Featured match</span>
                  <div className="muted small">
                    {fd.match.competition.name} · {fd.match.round} · {fd.match.venue}
                  </div>
                </div>
                <Badge tone="ai" icon="spark">Full report ready</Badge>
              </div>
              <div className="featured__teams">
                <div className="featured__team">
                  <TeamCrest team={fd.match.home} size={56} />
                  <strong>{fd.match.home.shortName}</strong>
                  <FormStrip results={fd.match.home.recent} size="sm" />
                </div>
                <div className="featured__ko">
                  <span className="featured__time">{formatKickoff(fd.match.kickoff)}</span>
                  <span className="muted small">{formatDay(fd.match.kickoff)}</span>
                </div>
                <div className="featured__team">
                  <TeamCrest team={fd.match.away} size={56} />
                  <strong>{fd.match.away.shortName}</strong>
                  <FormStrip results={fd.match.away.recent} size="sm" />
                </div>
              </div>
              <p className="featured__headline">{fd.intel.aiSummary.headline}</p>
              <SignalList signals={fd.intel.aiSummary.signals.slice(0, 4)} match={fd.match} compact />
              <div className="card-foot-row">
                <DemoTag />
                <span className="link-inline">
                  Open match report <Icon name="arrowRight" size={14} />
                </span>
              </div>
            </Link>
          ) : (
            <CardSkeleton lines={5} />
          )}

          {/* AI analyses */}
          <section>
            <div className="block-head">
              <h2 className="block-title">
                <Icon name="spark" size={18} /> AI analysis
              </h2>
              <DemoTag />
            </div>
            <div className="grid grid--2">
              {ai.loading
                ? [0, 1].map((i) => <CardSkeleton key={i} />)
                : ai.data?.slice(1).map((a) => <AiAnalysisCard key={a.id} analysis={a} match={byId(a.matchId)} compact />)}
            </div>
          </section>

          {/* Expert insights */}
          <section>
            <div className="block-head">
              <h2 className="block-title">
                <Icon name="shield" size={18} /> Vision X1 expert insights
              </h2>
            </div>
            <div className="grid grid--2">
              {experts.data?.slice(0, 4).map((e) => <ExpertCard key={e.id} insight={e} match={byId(e.matchId)} />)}
            </div>
          </section>

          {/* History */}
          <section>
            <div className="block-head">
              <h2 className="block-title">
                <Icon name="history" size={18} /> Recent analysis & history
              </h2>
              <span className="muted small">How past reads compared with the final result</span>
            </div>
            <Card className="table-card">
              <table className="table">
                <thead>
                  <tr>
                    <th>Match</th>
                    <th>Type</th>
                    <th className="hide-sm">Read</th>
                    <th>Result</th>
                    <th>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {history.loading && (
                    <tr>
                      <td colSpan={5}>
                        <Skeleton />
                      </td>
                    </tr>
                  )}
                  {history.data?.map((h) => (
                    <tr key={h.id}>
                      <td>
                        <div className="strong">{h.matchLabel}</div>
                        <div className="muted small">
                          {h.competition} · {formatDay(h.date)}
                        </div>
                      </td>
                      <td>
                        <Badge tone={h.type === 'AI analysis' ? 'ai' : h.type === 'Expert insight' ? 'accent' : 'neutral'}>{h.type}</Badge>
                      </td>
                      <td className="hide-sm muted">{h.title}</td>
                      <td className="mono">{h.finalScore ?? '—'}</td>
                      <td>
                        <span className={cx('outcome', h.outcome === 'Read aligned' ? 'outcome--yes' : h.outcome === 'Pending' ? 'outcome--pending' : 'outcome--no')}>
                          {h.outcome}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <p className="muted small table-note">
              “Read aligned” means the main analytical read was consistent with how the match played out. It is a learning tool, not a
              performance or profit claim. <DemoTag />
            </p>
          </section>
        </div>

        <aside className="dash-side">
          <Card className="side-card">
            <div className="side-card__head">
              <h3>Today's matches</h3>
              <DemoTag label="Demo" />
            </div>
            <div className="match-list">
              {today.loading
                ? [0, 1, 2, 3].map((i) => <Skeleton key={i} height={40} />)
                : today.data?.map((m) => <MatchRow key={m.id} match={m} active={m.featured} />)}
            </div>
            {!!tomorrow.data?.length && (
              <>
                <div className="side-card__sub">Tomorrow</div>
                <div className="match-list">
                  {tomorrow.data.map((m) => (
                    <MatchRow key={m.id} match={m} />
                  ))}
                </div>
              </>
            )}
          </Card>

          <Card className="side-card">
            <div className="side-card__head">
              <h3>Saved matches</h3>
              <span className="count">{saved.length}</span>
            </div>
            {saved.length === 0 ? (
              <p className="muted small">Tap the bookmark on any fixture to follow it here.</p>
            ) : (
              <div className="saved-list">
                {saved.map((m) => (
                  <Link key={m.id} to={`/match/${m.id}`} className="saved-item">
                    <span className="saved-item__crests">
                      <TeamCrest team={m.home} size={24} />
                      <TeamCrest team={m.away} size={24} />
                    </span>
                    <span className="saved-item__text">
                      <strong>
                        {m.home.shortName} vs {m.away.shortName}
                      </strong>
                      <span className="muted small">
                        {formatDay(m.kickoff)} · {formatKickoff(m.kickoff)}
                      </span>
                    </span>
                    <Icon name="arrowRight" size={14} />
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card className="side-card side-card--tg">
            <div className="side-card__head">
              <h3>
                <Icon name="telegram" size={17} /> Telegram companion
              </h3>
              <Badge tone="accent">Linked</Badge>
            </div>
            <ul className="notifs">
              {notifs.data?.map((n) => {
                const content = (
                  <>
                    <span className={cx('notif__icon', `notif__icon--${n.kind}`)}>
                      <Icon name={notifIcon[n.kind]} size={15} />
                    </span>
                    <span className="notif__body">
                      <span className="notif__title">
                        {n.title} <span className="muted small">· {timeAgo(n.minutesAgo)}</span>
                      </span>
                      <span className="notif__text">{n.body}</span>
                    </span>
                  </>
                );
                return (
                  <li key={n.id}>
                    {n.matchId ? (
                      <Link to={`/match/${n.matchId}`} className="notif">
                        {content}
                      </Link>
                    ) : (
                      <div className="notif">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <Button variant="secondary" size="sm" className="w-full" icon="bell">
              Notification settings (demo)
            </Button>
          </Card>

          <Card className="side-card side-card--assistant">
            <span className="feature__icon">
              <Icon name="spark" size={20} />
            </span>
            <h3>Ask about tonight's fixtures</h3>
            <p className="muted small">Research form, signals and risks with the Vision X1 assistant.</p>
            <Button to="/assistant" size="sm" iconRight="arrowRight">
              Open assistant
            </Button>
          </Card>

          <ResponsibleNote compact />
        </aside>
      </div>
    </div>
  );
}
