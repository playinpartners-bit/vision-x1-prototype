import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { assistant, football } from '../services';
import { useAsync } from '../hooks/useAsync';
import { Icon } from '../components/ui/Icon';
import { Avatar, Badge, Card, DemoTag } from '../components/ui/primitives';
import { TeamCrest } from '../components/match/TeamCrest';
import { FormStrip } from '../components/match/FormStrip';
import { ReplyBlocks } from '../components/assistant/ReplyBlocks';
import type { ChatMessage } from '../types/assistant';
import { cx, formatKickoff } from '../utils';

const thinkingSteps = ['Reading fixture & season data', 'Comparing form and xG', 'Checking analyst notes & availability', 'Writing summary'];

function Thinking() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, thinkingSteps.length - 1)), 220);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="thinking">
      {thinkingSteps.slice(0, step + 1).map((s, i) => (
        <div key={s} className={cx('thinking__step', i === step && 'is-current')}>
          {i < step ? <Icon name="check" size={14} /> : <span className="spinner" />} {s}
        </div>
      ))}
    </div>
  );
}

export function AssistantPage() {
  const [params] = useSearchParams();
  const matchId = params.get('match') ?? 'psg-marseille';
  const ctx = useAsync(() => football.getMatchDetail(matchId), [matchId]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const prompts = assistant.getSuggestedPrompts();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, busy]);

  async function ask(q: string) {
    const question = q.trim();
    if (!question || busy) return;
    setInput('');
    setBusy(true);
    setMessages((m) => [
      ...m.map((x) => ({ ...x, streaming: false })),
      { id: crypto.randomUUID(), role: 'user', text: question },
    ]);
    const reply = await assistant.ask(question, { matchId });
    setMessages((m) => [...m, { id: reply.id, role: 'assistant', reply, streaming: true }]);
    setBusy(false);
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  const match = ctx.data?.match;
  const empty = messages.length === 0;

  return (
    <div className="container page">
      <div className="concept-banner">
        <span className="pill-preview">Concept · future layer</span>
        <p>
          <strong>Ask Vision X1</strong> is a preview of a possible future layer: an AI research assistant that answers questions about a
          match page. It is not part of the MVP. Responses below are scripted demo content.
        </p>
        <Link to={`/match/${matchId}`} className="link-inline">
          Back to the match page <Icon name="arrowRight" size={13} />
        </Link>
      </div>
    <div className="assistant">
      <aside className="assistant__side">
        <Card className="card--pad">
          <div className="side-card__head">
            <h3>Research context</h3>
            <DemoTag label="Demo" />
          </div>
          {match ? (
            <Link to={`/match/${match.id}`} className="ctx-match">
              <div className="ctx-match__teams">
                <TeamCrest team={match.home} size={30} />
                <span>vs</span>
                <TeamCrest team={match.away} size={30} />
              </div>
              <strong>
                {match.home.shortName} vs {match.away.shortName}
              </strong>
              <span className="muted small">
                {match.competition.name} · {formatKickoff(match.kickoff)}
              </span>
              <div className="ctx-match__form">
                <FormStrip results={match.home.recent} size="sm" />
                <FormStrip results={match.away.recent} size="sm" />
              </div>
            </Link>
          ) : (
            <div className="muted small">Loading…</div>
          )}
          <h4 className="side-label">Data sources</h4>
          <ul className="source-list">
            <li><Icon name="chart" size={14} /> League & event data, 2026/27</li>
            <li><Icon name="history" size={14} /> Head-to-head archive</li>
            <li><Icon name="shield" size={14} /> Vision X1 analyst notes</li>
            <li><Icon name="users" size={14} /> Squad availability</li>
          </ul>
        </Card>
        <Card className="card--pad scope-card">
          <h4 className="side-label">What the assistant is for</h4>
          <ul className="scope-list scope-list--yes">
            <li><Icon name="check" size={14} /> Football research & context</li>
            <li><Icon name="check" size={14} /> Synthesising data into signals</li>
            <li><Icon name="check" size={14} /> Explaining uncertainty & risks</li>
          </ul>
          <h4 className="side-label">What it isn't</h4>
          <ul className="scope-list scope-list--no">
            <li><Icon name="close" size={14} /> Predicting results with certainty</li>
            <li><Icon name="close" size={14} /> Betting tips or staking advice</li>
            <li><Icon name="close" size={14} /> Replacing the expert opinion layer</li>
          </ul>
        </Card>
      </aside>

      <section className="chat card">
        <header className="chat__head">
          <div className="chat__title">
            <span className="chat__logo">
              <Icon name="spark" size={18} />
            </span>
            <div>
              <h1>Ask Vision X1</h1>
              <span className="muted small">Research questions about a match page · concept</span>
            </div>
          </div>
          <Badge tone="caution">Scripted demo responses</Badge>
        </header>

        <div className="chat__body" aria-live="polite">
          {empty && (
            <div className="chat__welcome">
              <span className="chat__welcome-icon">
                <Icon name="spark" size={26} />
              </span>
              <h2>What would you like to understand?</h2>
              <p className="muted">
                Ask about form, team statistics, tactical matchups or what makes a fixture hard to read. Answers cite the data they're
                based on.
              </p>
              <div className="prompt-grid">
                {prompts.map((p) => (
                  <button key={p} className="prompt-card" onClick={() => ask(p)}>
                    <Icon name="spark" size={15} />
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="msg msg--user">
                <div className="msg__bubble">{m.text}</div>
                <Avatar initials="AM" size={30} />
              </div>
            ) : (
              <div key={m.id} className="msg msg--ai">
                <span className="msg__ai-avatar">
                  <Icon name="spark" size={16} />
                </span>
                <div className="msg__content">
                  {m.reply && (
                    <ReplyBlocks
                      reply={m.reply}
                      animate={!!m.streaming}
                      onFollowUp={ask}
                      onDone={() => setMessages((all) => all.map((x) => (x.id === m.id ? { ...x, streaming: false } : x)))}
                    />
                  )}
                </div>
              </div>
            ),
          )}

          {busy && (
            <div className="msg msg--ai">
              <span className="msg__ai-avatar">
                <Icon name="spark" size={16} />
              </span>
              <div className="msg__content">
                <Thinking />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form className="composer" onSubmit={onSubmit}>
          {!empty && (
            <div className="composer__chips">
              {prompts.map((p) => (
                <button type="button" key={p} className="chip chip--sm" onClick={() => ask(p)} disabled={busy}>
                  {p}
                </button>
              ))}
            </div>
          )}
          <div className="composer__box">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${match ? `${match.home.shortName} vs ${match.away.shortName}` : 'a match'}…`}
              aria-label="Ask the assistant"
              disabled={busy}
            />
            <button className="composer__send" type="submit" disabled={busy || !input.trim()} aria-label="Send">
              <Icon name="send" size={18} />
            </button>
          </div>
          <p className="composer__note">
            AI responses may be inaccurate. Vision X1 provides analysis, not betting advice. 18+.
          </p>
        </form>
      </section>
    </div>
    </div>
  );
}
