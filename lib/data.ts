export type Stock = {
  ticker: string
  name: string
  price: number
  change: number // percent
  holding: number // value held in EUR
  shares: number
  color: string // brand-ish color for the monogram badge
}

export type PnlMonth = {
  month: string
  value: number // EUR profit (positive) or loss (negative)
}

export type LeagueMember = {
  rank: number
  name: string
  handle: string
  roi: number // percent
  value: number
  you?: boolean
}

export const portfolio = {
  value: 107218,
  currency: '€',
  changePct: 12.4,
  changeAbs: 11842,
  invested: 95376,
  cash: 8420,
  // monthly equity curve used by the area sparkline
  equity: [
    62000, 64500, 63200, 68900, 72400, 71100, 78300, 83600, 81200, 92400,
    99800, 107218,
  ],
}

export const pnl: PnlMonth[] = [
  { month: 'Jan', value: 3200 },
  { month: 'Feb', value: -1400 },
  { month: 'Mar', value: 4800 },
  { month: 'Apr', value: 2100 },
  { month: 'May', value: -2600 },
  { month: 'Jun', value: 5200 },
  { month: 'Jul', value: 3900 },
  { month: 'Aug', value: -900 },
  { month: 'Sep', value: 6100 },
  { month: 'Oct', value: 4400 },
  { month: 'Nov', value: 7300 },
  { month: 'Dec', value: 5600 },
]

export const topAssets: Stock[] = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 229.87,
    change: 1.84,
    holding: 28940,
    shares: 126,
    color: '#1d1d1f',
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 138.42,
    change: 4.21,
    holding: 24180,
    shares: 175,
    color: '#76b900',
  },
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    price: 412.05,
    change: -2.13,
    holding: 18650,
    shares: 45,
    color: '#e82127',
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    price: 438.11,
    change: 0.92,
    holding: 16320,
    shares: 37,
    color: '#0078d4',
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 201.34,
    change: 2.67,
    holding: 11280,
    shares: 56,
    color: '#ff9900',
  },
]

export const tradeable: Stock[] = [
  ...topAssets,
  {
    ticker: 'META',
    name: 'Meta Platforms',
    price: 596.18,
    change: 1.12,
    holding: 0,
    shares: 0,
    color: '#0866ff',
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 178.55,
    change: -0.45,
    holding: 0,
    shares: 0,
    color: '#ea4335',
  },
]

export const league: LeagueMember[] = [
  { rank: 1, name: 'Mara Volkov', handle: '@mara', roi: 38.6, value: 138420 },
  { rank: 2, name: 'Diego Fuentes', handle: '@dief', roi: 31.2, value: 129870 },
  {
    rank: 3,
    name: 'You',
    handle: '@you',
    roi: 24.4,
    value: 107218,
    you: true,
  },
  { rank: 4, name: 'Anya Petrova', handle: '@anya', roi: 19.8, value: 98640 },
  { rank: 5, name: 'Sam Okoye', handle: '@sammo', roi: 14.1, value: 91200 },
  { rank: 6, name: 'Liu Wei', handle: '@liuw', roi: 9.7, value: 84510 },
]

export const prizePool = {
  total: 50000,
  currency: '€',
  participants: 1280,
  endsIn: '6d 14h',
  yourRank: 3,
  payouts: [
    { place: '1st', amount: 25000 },
    { place: '2nd', amount: 12500 },
    { place: '3rd', amount: 6250 },
  ],
}
