/**
 * Placeholder analytics layer.
 *
 * Every product event goes through `track()`. Today it:
 *   1. pushes to `window.dataLayer` (so GTM / GA4 can be dropped in later),
 *   2. logs to the console in development,
 *   3. notifies in-app listeners (the ?debug=1 overlay on the landing page).
 *
 * Nothing is sent to any server. To go live, add a vendor adapter in
 * `send()` (PostHog, Plausible, GA4, Segment…) — call sites don't change.
 */

export type TrackEventName = 'landing_view' | 'match_open' | 'account_start' | 'membership_view' | 'telegram_open';

export type TrackProps = Record<string, string | number | boolean | undefined>;

export interface TrackedEvent {
  event: TrackEventName;
  props: TrackProps;
  ts: string;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const log: TrackedEvent[] = [];
const listeners = new Set<(e: TrackedEvent) => void>();
let context: TrackProps = {};

/** Attributes attached to every subsequent event (e.g. UTM campaign, landing variant). */
export function setTrackingContext(props: TrackProps) {
  context = { ...context, ...props };
}

/** Reads UTM parameters from the real query string and the hash-router query string. */
export function readCampaign(search: string): TrackProps {
  const params = new URLSearchParams(window.location.search);
  new URLSearchParams(search).forEach((v, k) => params.set(k, v));
  const out: TrackProps = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
    const v = params.get(k);
    if (v) out[k] = v;
  });
  return out;
}

function send(e: TrackedEvent) {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: e.event, ...e.props, event_ts: e.ts });
  // Vendor adapter goes here, e.g. posthog.capture(e.event, e.props)
}

export function track(event: TrackEventName, props: TrackProps = {}) {
  const e: TrackedEvent = {
    event,
    props: { ...context, ...props, demo: true, path: window.location.hash.replace(/^#/, '').split('?')[0] || '/' },
    ts: new Date().toISOString(),
  };
  log.push(e);
  send(e);
  if (import.meta.env.DEV) console.info('[track]', event, e.props);
  listeners.forEach((l) => l(e));
}

export function onTrack(listener: (e: TrackedEvent) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getTrackLog(): readonly TrackedEvent[] {
  return log;
}
