/**
 * Acquisition landing page for traffic from Vision X1-owned social content.
 * Goal: explain the product in < 30 seconds and send people into a match page.
 *
 * Structure: match hero → Data / AI Summary / Vision X1 View → product preview
 * → transparency → Telegram companion → free product CTA.
 * Primary CTA everywhere: "Explore the match". Telegram is never primary.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { football, trackRecord } from '../services';
import { useAsync } from '../hooks/useAsync';
import { useAppState } from '../hooks/AppState';
import { readCampaign, setTrackingContext, track } from '../analytics/track';
import { TELEGRAM_URL } from '../config';
import { TrackDebug } from '../analytics/TrackDebug';
import { Icon, type IconName } from '../components/ui/Icon';
import { Button, Card, CardSkeleton, DemoTag } from '../components/ui/primitives';
import { Logo } from '../components/layout/Logo';
import { ResponsibleNote } from '../components/layout/Footer';
import { TeamCrest } from '../components/match/TeamCrest';
import { FormStrip } from '../components/match/FormStrip';
import { StatCompare } from '../components/match/StatCompare';
import { LayerTag, type LayerId } from '../components/layers/Layers';
import { ConvictionMeter, recordSummary } from '../components/trust/Trust';
import { cx, formatDateTime, formatKickoff, leadTime } from '../utils';

const MATCH_ID = 'psg-marseille';
const MATCH_PATH = `/match/${MATCH_ID}`;

function useCountdown(iso?: string) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  if (!iso) return '';
  const mins = Math.round((new Date(iso).getTime() - now) / 60_000);
  if (mins <= 0) return `Kickoff ${formatKickoff(iso)}`;
  const h = Math.floor(mins / 60);
  return `Kickoff in ${h ? `${h} h ` : ''}${mins % 60} min`;
}

const layerIntro: Record<LayerId, { label: string; one: string }> = {
  data: { label: 'Data', one: 'Form, xG, goals and head-to-head. Facts only.' },
  ai: { label: 'AI Summary', one: 'The data, synthesised into the signals that matter.' },
  expert: { label: 'Vision X1 View', one: 'A named analyst’s read of the match — published and locked before kickoff.' },
};

const method: { icon: IconName; title: string; body: string }[] = [
  { icon: 'clock', title: 'Published before kickoff', body: 'Every Vision X1 View carries its publication time.' },
  { icon: 'fingerprint', title: 'Locked, never edited', body: 'Each View is fingerprinted at publication and cannot change.' },
  { icon: 'ledger', title: 'Kept in public', body: 'Every View stays in the public Track Record, whatever happens.' },
];

export function LandingPage() {
  const [params] = useSearchParams();
  const { search } = useLocation();
  const debug = params.get('debug') === '1';
  const { data: d } = useAsync(() => football.getMatchDetail(MATCH_ID));
  const record = useAsync(() => trackRecord.getCalls());
  const { openMembership, openAccount } = useAppState();
  const countdown = useCountdown(d?.match.kickoff);
  const viewed = useRef(false);

  // landing_view — once per mount (guards against StrictMode double effects).
  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    setTrackingContext({ ...readCampaign(search), landing: 'match_v1' });
    track('landing_view', { match_id: MATCH_ID });
  }, [search]);

  const openMatch = (placement: string) => () => track('match_open', { match_id: MATCH_ID, placement });
  const startAccount = (placement: string) => () => {
    track('account_start', { placement });
    openAccount();
  };
  const openTelegram = () => track('telegram_open', { placement: 'telegram_band', destination: TELEGRAM_URL });

  const summary = recordSummary(record.data?.graded ?? [], record.data?.pending ?? []);
  const latest = [...(record.data?.pending ?? []), ...(record.data?.graded ?? [])].slice(0, 3);
  const H = d?.match.home.shortName ?? '';
  const A = d?.match.away.shortName ?? '';

  return (
    <div className="lp">
      {/* minimal header: no main nav, one CTA */}
      <header className="lp-header">
        <div className="container lp-header__inner">
          <Logo />
          <span className="lp-header__tag">Football Intelligence</span>
          <Button size="sm" to={MATCH_PATH} onClick={openMatch('header')} iconRight="arrowRight">
            Explore the match
          </Button>
        </div>
      </header>

      {/* ───── 1. MATCH HERO ───── */}
      <section className="lp-hero">
        <div className="hero__bg" />
        <div className="container lp-hero__inner">
          <div className="lp-hero__copy">
            <span className="lp-kicker">
              <span className="live-dot live-dot--calm" /> Tonight · {d ? `${d.match.competition.name} · ${countdown}` : '…'}
            </span>
            <h1 className="lp-hero__title">
              {d ? (
                <>
                  {H} vs {A}.
                  <br />
                  <span className="hero__title-accent">Read it before kickoff.</span>
                </>
              ) : (
                'Read the match before kickoff.'
              )}
            </h1>
            <p className="lp-hero__lede">
              One match page. The data, an AI summary and the Vision X1 View — clearly separated, and locked before a ball is kicked.
            </p>
            <div className="hero__ctas">
              <Button size="lg" to={MATCH_PATH} onClick={openMatch('hero')} iconRight="arrowRight">
                Explore the match
              </Button>
              <Button size="lg" variant="secondary" to="/">
                Discover Vision X1
              </Button>
            </div>
            <p className="lp-hero__fine">Free to explore · 18+ · Analysis, not betting advice</p>
          </div>

          {d ? (
            <Link to={MATCH_PATH} onClick={openMatch('hero_card')} className="lp-matchcard">
              <div className="lp-matchcard__top">
                <span>
                  {d.match.competition.name} · {d.match.round}
                </span>
                <DemoTag label="Demo data" />
              </div>
              <div className="lp-matchcard__teams">
                {(['home', 'away'] as const).map((s) => (
                  <div key={s} className="lp-matchcard__team">
                    <TeamCrest team={d.match[s]} size={64} />
                    <strong>{d.match[s].shortName}</strong>
                    <FormStrip results={d.match[s].recent} size="sm" />
                  </div>
                ))}
                <div className="lp-matchcard__ko">
                  <span>{formatKickoff(d.match.kickoff)}</span>
                  <small>{d.match.venue}</small>
                </div>
              </div>
              {d.call && (
                <div className="lp-matchcard__view">
                  <LayerTag layer="expert" size="sm" label="Vision X1 View" />
                  <strong>{d.call.view}</strong>
                  <span className="lp-matchcard__lock">
                    <Icon name="lock" size={12} /> Locked {leadTime(d.call.publishedAt, d.call.kickoff)} before kickoff
                  </span>
                </div>
              )}
              <span className="lp-matchcard__open">
                Open the match page <Icon name="arrowRight" size={14} />
              </span>
            </Link>
          ) : (
            <CardSkeleton lines={5} />
          )}
        </div>
      </section>

      {/* ───── 2. THREE LAYERS ───── */}
      {d && (
        <section className="lp-section">
          <div className="container">
            <div className="lp-head">
              <span className="eyebrow">How a match page works</span>
              <h2 className="section-title">Three layers. Never blended.</h2>
            </div>
            <div className="lp-layers">
              <Card className="lp-layer lp-layer--data">
                <div className="lp-layer__top">
                  <LayerTag layer="data" label={layerIntro.data.label} />
                  <DemoTag label="Demo" />
                </div>
                <p className="lp-layer__one">{layerIntro.data.one}</p>
                <div className="lp-layer__sample">
                  <StatCompare
                    stats={d.data.stats.filter((s) => ['Points per game', 'Expected goals (xG) / game'].includes(s.label))}
                    homeLabel={H}
                    awayLabel={A}
                  />
                </div>
              </Card>
              <Card className="lp-layer lp-layer--ai">
                <div className="lp-layer__top">
                  <LayerTag layer="ai" label={layerIntro.ai.label} />
                  <span className="lp-layer__time mono">{d.ai && formatKickoff(d.ai.generatedAt)}</span>
                </div>
                <p className="lp-layer__one">{layerIntro.ai.one}</p>
                <div className="lp-layer__sample">
                  <p className="lp-layer__quote">“{d.ai?.headline}”</p>
                </div>
              </Card>
              <Card className="lp-layer lp-layer--expert">
                <div className="lp-layer__top">
                  <LayerTag layer="expert" label={layerIntro.expert.label} />
                  <span className="lp-layer__time lp-layer__time--lock">
                    <Icon name="lock" size={12} /> Locked
                  </span>
                </div>
                <p className="lp-layer__one">{layerIntro.expert.one}</p>
                {d.call && (
                  <div className="lp-layer__sample lp-layer__call">
                    <strong>{d.call.view}</strong>
                    <ConvictionMeter value={d.call.conviction} />
                    <span className="muted small">
                      {d.call.analyst.name} · {formatDateTime(d.call.publishedAt)}
                    </span>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* ───── 3. PRODUCT PREVIEW ───── */}
      {d && (
        <section className="lp-section lp-section--tint">
          <div className="container lp-preview">
            <div className="lp-preview__copy">
              <span className="eyebrow">Product preview</span>
              <h2 className="section-title">Everything about the match, on one page</h2>
              <ul className="checklist">
                <li><Icon name="check" size={15} /> Recent form, goals and team statistics</li>
                <li><Icon name="check" size={15} /> The signals behind the AI summary</li>
                <li><Icon name="check" size={15} /> The analyst’s full reasoning</li>
                <li><Icon name="check" size={15} /> Key risks that could make any read wrong</li>
              </ul>
              <Button to={MATCH_PATH} onClick={openMatch('preview')} iconRight="arrowRight">
                Explore the match
              </Button>
            </div>
            <Link to={MATCH_PATH} onClick={openMatch('preview_frame')} className="device" aria-label="Preview of the match page">
              <div className="device__bar">
                <span />
                <span />
                <span />
                <em>visionx1.com/match/psg-marseille</em>
                <DemoTag label="Demo data" />
              </div>
              <div className="device__screen">
                <div className="device__match">
                  <TeamCrest team={d.match.home} size={30} />
                  <strong>
                    {H} <span className="muted">vs</span> {A}
                  </strong>
                  <TeamCrest team={d.match.away} size={30} />
                  <span className="device__ko mono">{formatKickoff(d.match.kickoff)}</span>
                </div>
                <div className="device__tabs">
                  <span className="is-data">01 Data</span>
                  <span className="is-ai">02 AI Summary</span>
                  <span className="is-expert">03 Vision X1 View</span>
                  <span>Risks</span>
                </div>
                <div className="device__grid">
                  <div className="device__panel">
                    <StatCompare stats={d.data.stats.slice(1, 5)} homeLabel={H} awayLabel={A} />
                  </div>
                  <div className="device__col">
                    <div className="device__risk">
                      <span className="device__risk-label">
                        <Icon name="alert" size={13} /> Key risk
                      </span>
                      <strong>{d.risks[0]?.title}</strong>
                      <p>{d.risks[0]?.detail}</p>
                    </div>
                    <div className="device__risk">
                      <span className="device__risk-label">
                        <Icon name="alert" size={13} /> Key risk
                      </span>
                      <strong>{d.risks[1]?.title}</strong>
                      <p>{d.risks[1]?.detail}</p>
                    </div>
                  </div>
                </div>
                <div className="device__fade">
                  <span className="btn btn--primary btn--sm">
                    Explore the match <Icon name="arrowRight" size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ───── 4. TRANSPARENCY / METHODOLOGY ───── */}
      <section className="lp-section">
        <div className="container">
          <div className="lp-head">
            <span className="eyebrow">Transparency</span>
            <h2 className="section-title">Accountability first. Performance second.</h2>
            <p className="section-desc">We publish before kickoff and we can’t edit afterwards. So you can check us.</p>
          </div>
          <div className="lp-method">
            {method.map((m, i) => (
              <div key={m.title} className="lp-method__step">
                <span className="lp-method__n mono">0{i + 1}</span>
                <span className="lp-method__icon">
                  <Icon name={m.icon} size={18} />
                </span>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </div>
            ))}
          </div>
          <Card className="lp-record">
            <div className="lp-record__stats">
              <div>
                <strong>{summary.published || '—'}</strong>
                <span>analyses published</span>
              </div>
              <div>
                <strong>{summary.published ? `${Math.round(summary.beforeKickoffPct * 100)}%` : '—'}</strong>
                <span>timestamped before kickoff</span>
              </div>
              <div>
                <strong>0</strong>
                <span>edits after publication</span>
              </div>
              <div>
                <strong>{summary.medianLeadHours ? `${summary.medianLeadHours.toFixed(1)} h` : '—'}</strong>
                <span>median publication lead time</span>
              </div>
            </div>
            <div className="lp-record__side">
              <span className="side-label" style={{ margin: 0 }}>Latest published Views</span>
              <div className="lp-record__latest">
                {latest.map((c) => (
                  <span key={c.id} className="lp-record__item">
                    <Icon name="lock" size={12} />
                    <span className="mono small">{c.id}</span>
                    <span className="lp-record__view">{c.view}</span>
                  </span>
                ))}
              </div>
              <div className="lp-record__foot">
                <DemoTag label="Demo data" />
                <Link to="/track-record" className="link-inline">
                  See the full Track Record <Icon name="arrowRight" size={13} />
                </Link>
              </div>
            </div>
          </Card>
          <p className="muted small lp-record__note">
            Accountability first, performance second: accuracy is published on the Track Record with its methodology. No odds, returns or
            staking advice.
          </p>
        </div>
      </section>

      {/* ───── 5. TELEGRAM COMPANION (secondary) ───── */}
      <section className="lp-section lp-section--tight">
        <div className="container">
          <div className="lp-pocket">
            <span className="lp-pocket__icon">
              <Icon name="pocket" size={22} />
            </span>
            <div className="lp-pocket__copy">
              <h3>Vision X1 in your pocket</h3>
              <p className="muted">Morning briefings, line-up alerts and the community on Telegram. The match page stays the source of truth.</p>
            </div>
            <Button variant="ghost" icon="telegram" href={TELEGRAM_URL} onClick={openTelegram}>
              Join Vision X1 on Telegram
            </Button>
          </div>
        </div>
      </section>

      {/* ───── 6. FREE PRODUCT CTA ───── */}
      <section className="lp-section lp-final">
        <div className="container">
          <Card className="lp-final__card">
            <span className="hero__brand">
              VISION X1 <span>—</span> Football Intelligence
            </span>
            <h2>Start with tonight’s match. It’s free.</h2>
            <p className="muted">
              Explore the full match page now. Create a free account to follow matches, get the morning briefing and see every View in
              the Track Record.
            </p>
            <div className="lp-final__ctas">
              <Button size="lg" to={MATCH_PATH} onClick={openMatch('final')} iconRight="arrowRight">
                Explore the match
              </Button>
              <Button size="lg" variant="secondary" onClick={startAccount('final')}>
                Create free account
              </Button>
            </div>
            <button className="link-btn" onClick={() => openMembership('landing_final')}>
              Compare membership plans
            </button>
          </Card>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="container">
          <ResponsibleNote />
          <p className="footer__legal">
            © {new Date().getFullYear()} Vision X1 · Prototype. All fixtures, statistics, Vision X1 Views and track-record entries are DEMO DATA. Club
            names are used for identification only; crests are generated placeholders.{' '}
            <Link to="/">Discover Vision X1</Link>
          </p>
        </div>
      </footer>

      {/* sticky mobile CTA */}
      <div className={cx('lp-sticky')}>
        <Button to={MATCH_PATH} onClick={openMatch('sticky_mobile')} className="w-full" iconRight="arrowRight">
          Explore the match
        </Button>
      </div>

      {debug && <TrackDebug />}
    </div>
  );
}
