import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { PortfolioCard } from '@/components/dashboard/portfolio-card'
import { PnlChart } from '@/components/dashboard/pnl-chart'
import { TopAssets } from '@/components/dashboard/top-assets'
import { TradePanel } from '@/components/dashboard/trade-panel'
import { LeagueRanking } from '@/components/dashboard/league-ranking'
import { PrizePool } from '@/components/dashboard/prize-pool'
import { AnimatedLayout } from '@/components/dashboard/animated-layout'

export default async function Page() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <AnimatedLayout.Reveal direction="bottom" delay={0}>
            <Topbar />
          </AnimatedLayout.Reveal>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="flex flex-col gap-6 xl:col-span-2">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <AnimatedLayout.Reveal direction="left" delay={1}>
                  <PortfolioCard />
                </AnimatedLayout.Reveal>
                <AnimatedLayout.Reveal direction="right" delay={2}>
                  <PrizePool />
                </AnimatedLayout.Reveal>
              </div>
              <AnimatedLayout.Reveal direction="bottom" delay={2}>
                <PnlChart />
              </AnimatedLayout.Reveal>
              <AnimatedLayout.Reveal direction="bottom" delay={3}>
                <TopAssets />
              </AnimatedLayout.Reveal>
            </div>
            <div className="flex flex-col gap-6">
              <AnimatedLayout.Reveal direction="right" delay={3}>
                <TradePanel />
              </AnimatedLayout.Reveal>
              <AnimatedLayout.Reveal direction="right" delay={4}>
                <LeagueRanking />
              </AnimatedLayout.Reveal>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
