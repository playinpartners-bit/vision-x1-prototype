import { useEffect, useState } from 'react';
import type { AssistantBlock, AssistantReply } from '../../types/assistant';
import { cx } from '../../utils';
import { FormStrip } from '../match/FormStrip';
import { Icon } from '../ui/Icon';

/** Reveals text progressively to mimic a streamed LLM response. */
function TypeText({ text, animate, onDone }: { text: string; animate: boolean; onDone?: () => void }) {
  const [n, setN] = useState(animate ? 0 : text.length);
  useEffect(() => {
    if (!animate) return;
    const step = Math.max(2, Math.round(text.length / 60));
    const id = setInterval(() => setN((v) => Math.min(text.length, v + step)), 16);
    return () => clearInterval(id);
  }, [animate, text]);
  useEffect(() => {
    if (animate && n >= text.length) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n >= text.length]);
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <span className="caret" />}
    </>
  );
}

function Block({ block }: { block: AssistantBlock }) {
  switch (block.type) {
    case 'text':
      return <p>{block.text}</p>;
    case 'bullets':
      return (
        <ul className="reply-list">
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <figure className="reply-table">
          {block.caption && <figcaption>{block.caption}</figcaption>}
          <div className="table-scroll">
            <table className="table table--compact">
              <thead>
                <tr>
                  {block.columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j} className={j > 0 ? 'mono' : undefined}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );
    case 'compare': {
      return (
        <figure className="reply-compare">
          {block.caption && <figcaption>{block.caption}</figcaption>}
          <div className="stat-compare__legend">
            <span className="legend legend--home">{block.homeLabel}</span>
            <span className="legend legend--away">{block.awayLabel}</span>
          </div>
          {block.rows.map((r) => {
            const max = Math.max(r.home, r.away) || 1;
            return (
              <div key={r.label} className="rc-row">
                <span className="rc-row__label">{r.label}</span>
                <div className="rc-row__bars">
                  <div className="rc-bar">
                    <span className="rc-bar__fill rc-bar__fill--home" style={{ width: `${(r.home / max) * 100}%` }} />
                    <span className="mono">{r.home}</span>
                  </div>
                  <div className="rc-bar">
                    <span className="rc-bar__fill rc-bar__fill--away" style={{ width: `${(r.away / max) * 100}%` }} />
                    <span className="mono">{r.away}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </figure>
      );
    }
    case 'form':
      return (
        <div className="reply-form">
          {block.rows.map((r) => (
            <div key={r.team} className="reply-form__row">
              <span>{r.team}</span>
              <FormStrip results={r.results} size="sm" />
            </div>
          ))}
          <span className="muted small">Most recent first</span>
        </div>
      );
    case 'callout':
      return (
        <p className={cx('callout', `callout--${block.tone}`)}>
          <Icon name={block.tone === 'caution' ? 'alert' : 'info'} size={15} /> {block.text}
        </p>
      );
  }
}

export function ReplyBlocks({
  reply,
  animate,
  onFollowUp,
  onDone,
}: {
  reply: AssistantReply;
  animate: boolean;
  onFollowUp: (q: string) => void;
  onDone?: () => void;
}) {
  // Stream the first paragraph, then reveal the remaining blocks one by one.
  const [visible, setVisible] = useState(animate ? 0 : reply.blocks.length);
  const firstIsText = reply.blocks[0]?.type === 'text';

  useEffect(() => {
    if (!animate) return;
    if (!firstIsText) setVisible(1);
  }, [animate, firstIsText]);

  useEffect(() => {
    if (!animate || visible === 0) return;
    if (visible >= reply.blocks.length) {
      onDone?.();
      return;
    }
    const id = setTimeout(() => setVisible((v) => v + 1), 260);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, animate, reply.blocks.length]);

  const done = visible >= reply.blocks.length;

  return (
    <div className="reply">
      {reply.blocks.map((b, i) => {
        if (i === 0 && b.type === 'text')
          return (
            <p key={i}>
              <TypeText text={b.text} animate={animate} onDone={() => setVisible((v) => Math.max(v, 1))} />
            </p>
          );
        if (i >= Math.max(visible, 1) && animate) return null;
        return (
          <div key={i} className="reply__block">
            <Block block={b} />
          </div>
        );
      })}
      {done && reply.sources.length > 0 && (
        <div className="reply__sources">
          <Icon name="layers" size={14} />
          <span>Sources:</span>
          {reply.sources.map((s) => (
            <span key={s} className="source-chip">
              {s}
            </span>
          ))}
        </div>
      )}
      {done && reply.followUps.length > 0 && (
        <div className="reply__followups">
          {reply.followUps.map((f) => (
            <button key={f} className="chip" onClick={() => onFollowUp(f)}>
              {f} <Icon name="arrowRight" size={13} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
