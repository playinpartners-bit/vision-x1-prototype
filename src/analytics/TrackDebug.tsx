import { useEffect, useState } from 'react';
import { getTrackLog, onTrack, type TrackedEvent } from './track';

/** Floating event log, shown with ?debug=1 — lets you demo the tracking plan live. */
export function TrackDebug() {
  const [events, setEvents] = useState<TrackedEvent[]>(() => [...getTrackLog()]);
  const [open, setOpen] = useState(true);
  useEffect(() => onTrack((e) => setEvents((xs) => [...xs, e])), []);
  return (
    <div className="track-debug" role="log" aria-label="Tracking events (debug)">
      <button className="track-debug__head" onClick={() => setOpen((o) => !o)}>
        <span>Tracking · placeholder</span>
        <span className="mono">{events.length}</span>
      </button>
      {open && (
        <ol className="track-debug__list">
          {events.length === 0 && <li className="muted">No events yet</li>}
          {[...events].reverse().map((e, i) => (
            <li key={events.length - i}>
              <strong>{e.event}</strong>
              <span className="mono">
                {Object.entries(e.props)
                  .filter(([k]) => !['demo', 'path'].includes(k))
                  .map(([k, v]) => `${k}=${v}`)
                  .join(' · ')}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
