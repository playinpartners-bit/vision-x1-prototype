/** Indicative membership tiers for the prototype. Not connected to billing. */
export const plans = [
  {
    id: 'free',
    name: 'Starter',
    price: '€0',
    period: '/month',
    tagline: 'Explore the platform',
    highlight: false,
    features: ['Daily match overview', '1 AI analysis per day', 'Telegram morning digest', 'Basic team stats'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€14.99',
    period: '/month',
    tagline: 'For serious followers of the game',
    highlight: true,
    features: [
      'Unlimited AI match analysis',
      'Vision X1 expert insights',
      'AI Football Assistant',
      'Line-up & fitness alerts on Telegram',
      'Saved matches & history',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '€39',
    period: '/month',
    tagline: 'Deepest data & analyst access',
    highlight: false,
    features: ['Everything in Pro', 'Advanced event data & xG models', 'Weekly analyst briefings', 'Private analyst Q&A on Telegram'],
  },
];
