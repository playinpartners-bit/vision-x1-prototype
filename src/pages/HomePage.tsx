import { Link } from 'react-router-dom';
import { football } from '../services';
import { useAsync } from '../hooks/useAsync';
import { useAppState } from '../hooks/AppState';
import { Icon, type IconName } from '../components/ui/Icon';
import { Badge, Button, Card, CardSkeleton, DemoTag, SectionHeader } from '../components/ui/primitives';
import { MatchCard } from '../components/match/MatchCard';
import { TeamCrest } from '../components/match/TeamCrest';
import { FormStrip } from '../components/match/FormStrip';
import { AiAnalysisCard, ExpertCard, SignalList } from '../components/match/Insights';
import { StatCompare } from '../components/match/StatCompare';
import { PitchVisual } from '../components/marketing/PitchVisual';
import { TelegramMock } from '../components/marketing/TelegramMock';
import { plans } from '../components/marketing/plans';
import { cx, formatKickoff } from '../utils';

const features: { icon: IconName; title: string; body: string }[] = [
  { icon: 'chart', title: 'Match intelligence', body: 'Form, xG, head-to-head and tactical context for every fixture, distilled into one clear view.' },
  { icon: 'spark', title: 'AI-assisted analysis', body: 'Models synthesise thousands of data points into signals — and tell you how strong each one really is.' },
  { icon: 'shield', title: 'Expert analysts', body: 'Vision X1 analysts add what data misses: line-up dynamics, motivation, tactical matchups.' },
  { icon: 'alert', title: 'Honest uncertainty', body: 'Every report surfaces the risks and unknowns. We never sell certainty that does not exist.' },
  { icon: 'telegram', title: 'Telegram companion', body: 'Briefings, line-up alerts and quick answers wherever you already are.' },
  { icon: 'history', title: 'Your research history', body: 'Save fixtures, revisit analysis and see how past reads compared with what happened.' },
];

export function HomePage() {
  const matches = useAsync(() => football.getMatches(0));
  const featured = useAsync(() => football.getMatchDetail('psg-marseille'));
  const ai = useAsync(() => football.getAiAnalyses());
  const { openMembership } = useAppState();

  const fd = featured.data;

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="container hero__inner">
          <div className="hero__copy">
            <Badge tone="outline" icon="spark">AI-assisted football intelligence</Badge>
            <h1 className="hero__title">
              Football intelligence.
              <br />
              <span className="gradient-text">Powered by data.</span>
            </h1>
            <p className="hero__lede">
              Vision X1 combines match data, AI analysis and expert insight to help you understand every fixture more deeply —
              form, signals, risks and context, in one place.
            </p>
            <div className="hero__ctas">
              <Button size="lg" to="/match/psg-marseille" iconRight="arrowRight">
                Explore a match report
              </Button>
              <Button size="lg" variant="secondary" to="/assistant" icon="spark">
                Ask the AI assistant
              </Button>
            </div>
            <div className="hero__proof">
              <div><strong>5</strong> top European leagues</div>
              <div><strong>40+</strong> metrics per fixture</div>
              <div><strong>Human</strong> + AI analysis</div>
            </div>
          </div>
          <div className="hero__visual">
            <PitchVisual />
            {fd && (
              <Link to={`/match/${fd.match.id}`} className="hero__float card">
                <div className="hero__float-top">
                  <span className="eyebrow">Featured tonight</span>
                  <DemoTag label="Demo" />
                </div>
                <div className="hero__float-teams">
                  <TeamCrest team={fd.match.home} size={34} />
                  <div>
                    <strong>{fd.match.home.shortName}</strong> vs <strong>{fd.match.away.shortName}</strong>
                    <div className="muted small">
                      {fd.match.competition.name} · {formatKickoff(fd.match.kickoff)}
                    </div>
                  </div>
                  <TeamCrest team={fd.match.away} size={34} />
                </div>
                {fd.intel && <SignalList signals={fd.intel.aiSummary.signals.slice(0, 3)} match={fd.match} compact />}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* TODAY'S MATCHES */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow={<>Today's fixtures <DemoTag /></>}
            title="Today's featured matches"
            description="Every fixture comes with form, core statistics and an AI-generated read. Full analyst reports for the biggest games."
            action={
              <Button variant="ghost" to="/dashboard" iconRight="arrowRight">
                Open dashboard
              </Button>
            }
          />
          <div className="grid grid--3">
            {matches.loading
              ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
              : matches.data?.slice(0, 6).map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </div>
      </section>

      {/* MATCH INSIGHT PREVIEW */}
      {fd && fd.intel && (
        <section className="section section--tint">
          <div className="container">
            <SectionHeader
              eyebrow="Match insight preview"
              title={
                <>
                  {fd.match.home.shortName} vs {fd.match.away.shortName}: the full picture
                </>
              }
              description="A glimpse of a Vision X1 match report — data, AI synthesis and an expert view side by side."
            />
            <div className="preview-grid">
              <Card className="card--pad">
                <div className="preview-teams">
                  {(['home', 'away'] as const).map((s) => (
                    <div key={s} className="preview-team">
                      <TeamCrest team={fd.match[s]} size={44} />
                      <div>
                        <div className="preview-team__name">{fd.match[s].name}</div>
                        <FormStrip results={fd.match[s].recent} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
                <StatCompare stats={fd.stats.slice(1, 6)} homeLabel={fd.match.home.shortName} awayLabel={fd.match.away.shortName} />
                <div className="card-foot-row">
                  <DemoTag />
                  <Link to={`/match/${fd.match.id}`} className="link-inline">
                    View full report <Icon name="arrowRight" size={14} />
                  </Link>
                </div>
              </Card>
              <div className="stack">
                <AiAnalysisCard analysis={fd.intel.aiSummary} match={fd.match} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* AI + EXPERT */}
      <section className="section">
        <div className="container">
          <div className="split">
            <div>
              <SectionHeader
                eyebrow="AI analysis"
                title="Signals, not certainties"
                description="Our models read form, chance quality, tactical profiles and availability — then rank which signals matter and how strong they are."
              />
              <div className="stack">
                {ai.data?.slice(1, 3).map((a) => (
                  <AiAnalysisCard key={a.id} analysis={a} compact />
                ))}
              </div>
            </div>
            <div>
              <SectionHeader
                eyebrow="Vision X1 expert analysis"
                title="The human read"
                description="Specialist analysts for each league add tactical and contextual judgement that data alone can't capture."
              />
              {fd?.intel && <ExpertCard insight={fd.intel.expert} match={fd.match} />}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section section--tint">
        <div className="container">
          <SectionHeader align="center" eyebrow="The platform" title="Everything you need to read a match" />
          <div className="grid grid--3">
            {features.map((f) => (
              <Card key={f.title} className="card--pad feature">
                <span className="feature__icon">
                  <Icon name={f.icon} size={20} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TELEGRAM */}
      <section className="section">
        <div className="container telegram">
          <div className="telegram__copy">
            <Badge tone="accent" icon="telegram">Telegram companion</Badge>
            <h2 className="section-title">Where Vision X1 started. Now your companion.</h2>
            <p className="section-desc">
              Our community began on Telegram. It's still the fastest way to stay informed: a morning briefing, line-up and fitness
              alerts, and quick answers — with the full analysis one tap away in the platform.
            </p>
            <ul className="checklist">
              <li><Icon name="check" size={16} /> Daily briefing at 09:00 local time</li>
              <li><Icon name="check" size={16} /> Alerts when line-ups or key news change a read</li>
              <li><Icon name="check" size={16} /> Ask the assistant directly in chat</li>
            </ul>
            <Button variant="secondary" icon="telegram" onClick={openMembership}>
              Connect Telegram (demo)
            </Button>
          </div>
          <TelegramMock />
        </div>
      </section>

      {/* MEMBERSHIP */}
      <section className="section section--tint" id="membership">
        <div className="container">
          <SectionHeader
            align="center"
            eyebrow="Membership"
            title="Go deeper on every match"
            description="For adults 18+. Analysis and context — never guaranteed outcomes. Indicative prototype pricing; no payment is taken in this demo."
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
                    <li key={f}><Icon name="check" size={16} /> {f}</li>
                  ))}
                </ul>
                <Button variant={p.highlight ? 'primary' : 'secondary'} className="w-full" onClick={openMembership}>
                  {p.id === 'free' ? 'Start free' : `Choose ${p.name}`}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
