import { Link } from 'react-router-dom';
import { football, trackRecord } from '../services';
import { useAsync } from '../hooks/useAsync';
import { useAppState } from '../hooks/AppState';
import { Icon, type IconName } from '../components/ui/Icon';
import { Badge, Button, Card, CardSkeleton, DemoTag, SectionHeader } from '../components/ui/primitives';
import { MatchCard } from '../components/match/MatchCard';
import { TeamCrest } from '../components/match/TeamCrest';
import { StatCompare } from '../components/match/StatCompare';
import { RiskList, SignalList } from '../components/match/Insights';
import { MatchPageStack } from '../components/marketing/MatchPageStack';
import { TelegramMock } from '../components/marketing/TelegramMock';
import { plans } from '../components/marketing/plans';
import { LAYERS, LayerTag, type LayerId } from '../components/layers/Layers';
import { CallCard, OutcomeBadge, RecordStrip, recordSummary } from '../components/trust/Trust';
import { cx, formatDateTime, formatKickoff } from '../utils';

const layerCopy: Record<LayerId, { is: string[]; isnt: string }> = {
  data: {
    is: ['Form, xG, goals, head-to-head', 'Team & player availability', 'Updated until kickoff'],
    isnt: 'No opinion. Just what happened.',
  },
  ai: {
    is: ['Synthesises the data layer', 'Ranks signals by strength', 'Timestamped when generated'],
    isnt: 'Never edited by hand, never a Vision X1 call.',
  },
  expert: {
    is: ['A named league analyst', 'One clear call + conviction level', 'Locked at publication'],
    isnt: 'Published before kickoff. Graded in public.',
  },
};

const pocket: { icon: IconName; title: string; body: string }[] = [
  { icon: 'clock', title: 'Briefings', body: "Every morning: today's match pages and the calls our analysts have locked." },
  { icon: 'bell', title: 'Alerts', body: 'Line-ups confirmed, late fitness news, a new expert call on a match you follow.' },
  { icon: 'users', title: 'Community', body: 'Where Vision X1 began. Discuss match pages with members and analysts.' },
];

export function HomePage() {
  const featured = useAsync(() => football.getMatchDetail('psg-marseille'));
  const matches = useAsync(() => football.getMatches(0));
  const record = useAsync(() => trackRecord.getCalls());
  const { openMembership } = useAppState();
  const fd = featured.data;
  const summary = recordSummary(record.data?.graded ?? []);

  return (
    <>
      {/* ───── HERO ───── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__pitch" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="hero__brand">
              VISION X1 <span>—</span> Football Intelligence
            </span>
            <h1 className="hero__title">
              Read the match
              <br />
              <span className="hero__title-accent">before kickoff.</span>
            </h1>
            <p className="hero__lede">
              Every match page brings together the data, an AI-assisted summary and a Vision X1 expert opinion — clearly separated, and
              timestamped before a ball is kicked.
            </p>
            <div className="hero__ctas">
              <Button size="lg" to="/match/psg-marseille" iconRight="arrowRight">
                Open tonight's match page
              </Button>
              <Button size="lg" variant="secondary" to="/track-record" icon="ledger">
                See the track record
              </Button>
            </div>
            <ul className="trust-row">
              <li><Icon name="lock" size={15} /> Published before kickoff</li>
              <li><Icon name="fingerprint" size={15} /> Never edited</li>
              <li><Icon name="check" size={15} /> Every call graded in public</li>
            </ul>
          </div>
          <div className="hero__visual">{fd ? <MatchPageStack d={fd} /> : <CardSkeleton lines={6} />}</div>
        </div>
      </section>

      {/* ───── TONIGHT'S MATCH PAGE ───── */}
      {fd && (
        <section className="section section--tint">
          <div className="container">
            <SectionHeader
              eyebrow="The match page"
              title="One match. Three layers. Never blended."
              description="This is the core of Vision X1. Here's tonight's match page for Le Classique — data, machine summary and human judgement, each in its own lane."
              action={
                <Button variant="ghost" to={`/match/${fd.match.id}`} iconRight="arrowRight">
                  Open full match page
                </Button>
              }
            />
            <div className="showcase card">
              <div className="showcase__head">
                <div className="showcase__teams">
                  <TeamCrest team={fd.match.home} size={44} />
                  <div>
                    <h3>
                      {fd.match.home.name} <span className="muted">vs</span> {fd.match.away.name}
                    </h3>
                    <span className="muted small">
                      {fd.match.competition.name} · {fd.match.round} · Kickoff {formatKickoff(fd.match.kickoff)}
                    </span>
                  </div>
                  <TeamCrest team={fd.match.away} size={44} />
                </div>
                <DemoTag label="Demo match page" />
              </div>

              <div className="showcase__layers">
                <div className="sc-col sc-col--data">
                  <LayerTag layer="data" />
                  <p className="sc-col__what">{LAYERS.data.what}</p>
                  <StatCompare
                    stats={fd.data.stats.filter((s) => ['Points per game', 'Expected goals (xG) / game', 'Goals conceded / game', 'Possession'].includes(s.label))}
                    homeLabel={fd.match.home.shortName}
                    awayLabel={fd.match.away.shortName}
                  />
                </div>
                {fd.ai && (
                  <div className="sc-col sc-col--ai">
                    <LayerTag layer="ai" />
                    <p className="sc-col__what">Generated {formatDateTime(fd.ai.generatedAt)}</p>
                    <h4 className="sc-col__headline">{fd.ai.headline}</h4>
                    <SignalList signals={fd.ai.signals.slice(0, 4)} match={fd.match} compact />
                  </div>
                )}
                {fd.call && (
                  <div className="sc-col sc-col--expert">
                    <LayerTag layer="expert" />
                    <p className="sc-col__what">{fd.call.analyst.role}</p>
                    <CallCard call={fd.call} />
                  </div>
                )}
              </div>

              <div className="showcase__risks">
                <span className="showcase__risks-label">
                  <Icon name="alert" size={15} /> Key risks
                </span>
                <RiskList risks={fd.risks.slice(0, 3)} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ───── THREE LAYERS ───── */}
      <section className="section">
        <div className="container">
          <SectionHeader align="center" eyebrow="How we read a match" title="Know exactly what you're reading" />
          <div className="grid grid--3">
            {(Object.keys(LAYERS) as LayerId[]).map((id) => (
              <Card key={id} className={cx('card--pad', 'layer-card', `layer-card--${id}`)}>
                <span className="layer-card__n">{LAYERS[id].n}</span>
                <h3>
                  <Icon name={LAYERS[id].icon} size={18} /> {LAYERS[id].label}
                </h3>
                <ul className="checklist">
                  {layerCopy[id].is.map((x) => (
                    <li key={x}>
                      <Icon name="check" size={15} /> {x}
                    </li>
                  ))}
                </ul>
                <p className="layer-card__isnt">{layerCopy[id].isnt}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TODAY'S MATCH PAGES ───── */}
      <section className="section section--tint">
        <div className="container">
          <SectionHeader
            eyebrow={<>Today <DemoTag label="Demo fixtures" /></>}
            title="Today's match pages"
            description="Every fixture has a data layer. The biggest matches get an AI summary and a locked expert call."
            action={
              <Button variant="ghost" to="/matches" iconRight="arrowRight">
                Match Center
              </Button>
            }
          />
          <div className="grid grid--3">
            {matches.loading
              ? [0, 1, 2].map((i) => <CardSkeleton key={i} />)
              : matches.data?.slice(0, 6).map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </div>
      </section>

      {/* ───── TRACK RECORD ───── */}
      <section className="section">
        <div className="container tr-teaser">
          <div>
            <span className="eyebrow">Public Track Record</span>
            <h2 className="section-title">We publish before kickoff. We can't edit after.</h2>
            <p className="section-desc">
              Every expert call is timestamped, fingerprinted and locked the moment it's published — then graded after full time, right or
              wrong. Trust should be checkable.
            </p>
            <div className="tr-teaser__kpis">
              <div>
                <strong>{summary.total || '—'}</strong>
                <span>calls graded</span>
              </div>
              <div>
                <strong>{summary.decided ? `${Math.round(summary.rate * 100)}%` : '—'}</strong>
                <span>correct reads</span>
              </div>
              <div>
                <strong>{summary.medianLeadHours ? `${summary.medianLeadHours.toFixed(1)} h` : '—'}</strong>
                <span>median lead time</span>
              </div>
              <div>
                <strong>0</strong>
                <span>edits after publication</span>
              </div>
            </div>
            <Button to="/track-record" variant="secondary" icon="ledger">
              Explore the full record
            </Button>
            <p className="muted small" style={{ marginTop: 12 }}>
              <DemoTag label="Demo record" /> Accuracy only — no odds, returns or profit figures.
            </p>
          </div>
          <Card className="card--pad tr-teaser__panel">
            <div className="block-head">
              <h3 className="sub-title" style={{ margin: 0 }}>Latest graded calls</h3>
              <RecordStrip calls={[...(record.data?.graded ?? [])].slice(0, 16).reverse()} />
            </div>
            <ul className="mini-ledger">
              {record.data?.graded.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <div>
                    <strong>{c.call}</strong>
                    <span className="muted small">
                      {c.home} vs {c.away} · {c.finalScore ?? 'postponed'}
                    </span>
                  </div>
                  <span className="mini-ledger__stamp mono small">
                    <Icon name="lock" size={11} /> {c.id}
                  </span>
                  <OutcomeBadge outcome={c.outcome} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* ───── TELEGRAM COMPANION ───── */}
      <section className="section section--tint">
        <div className="container telegram">
          <div className="telegram__copy">
            <Badge tone="accent" icon="telegram">Telegram companion</Badge>
            <h2 className="section-title">Vision X1 in your pocket</h2>
            <p className="section-desc">
              The match page is where you read the game. Telegram is how it finds you — wherever you are on matchday.
            </p>
            <div className="pocket-grid">
              {pocket.map((p) => (
                <div key={p.title} className="pocket-item">
                  <span className="feature__icon">
                    <Icon name={p.icon} size={18} />
                  </span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" icon="telegram" onClick={openMembership}>
              Connect Telegram (demo)
            </Button>
          </div>
          <TelegramMock />
        </div>
      </section>

      {/* ───── MEMBERSHIP ───── */}
      <section className="section" id="membership">
        <div className="container">
          <SectionHeader
            align="center"
            eyebrow="Membership"
            title="Read every match properly"
            description="For adults 18+. Football analysis — never guaranteed outcomes or betting advice. Indicative prototype pricing; no payment is taken."
          />
          <div className="grid grid--3 plans">
            {plans.map((p) => (
              <Card key={p.id} className={cx('card--pad plan', p.highlight && 'plan--highlight')}>
                {p.highlight && <Badge tone="accent">Most popular</Badge>}
                <h3 className="plan__name">{p.name}</h3>
                <p className="muted">{p.tagline}</p>
                <div className="plan__price">
                  {p.price}
                  <small>{p.period}</small>
                </div>
                <ul className="checklist">
                  {p.features.map((f) => (
                    <li key={f}>
                      <Icon name="check" size={16} /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={p.highlight ? 'primary' : 'secondary'} className="w-full" onClick={openMembership}>
                  {p.id === 'free' ? 'Start free' : `Choose ${p.name}`}
                </Button>
              </Card>
            ))}
          </div>
          <p className="muted small center-note">
            Coming later: <Link to="/assistant">Ask Vision X1</Link>, an AI research assistant for match pages (concept preview).
          </p>
        </div>
      </section>
    </>
  );
}
