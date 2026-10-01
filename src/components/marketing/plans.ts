/** Indicative membership tiers for the prototype. Not connected to billing. */
export const plans = [
  {
    id: 'free',
    name: 'Starter',
    price: '€0',
    period: '/month',
    tagline: 'Follow the game',
    highlight: false,
    features: ['Data layer on every match page', 'Public Track Record', 'Telegram morning briefing', 'Community access'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€14.99',
    period: '/month',
    tagline: 'Every layer, every match page',
    highlight: true,
    features: [
      'AI summaries on all covered matches',
      'Every Vision X1 expert opinion & View',
      'Key risks on every match page',
      'Line-up & new-View alerts on Telegram',
      'My Vision X1: follow matches & teams',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '€39',
    period: '/month',
    tagline: 'Deepest data & analyst access',
    highlight: false,
    features: ['Everything in Pro', 'Advanced event data & xG detail', 'Weekly analyst briefings', 'Analyst Q&A in the Telegram community'],
  },
];
