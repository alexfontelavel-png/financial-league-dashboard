import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { PortfolioCard } from '@/components/dashboard/portfolio-card'
import { PnlChart } from '@/components/dashboard/pnl-chart'
import { TopAssets } from '@/components/dashboard/top-assets'
import { TradePanel } from '@/components/dashboard/trade-panel'
import { LeagueRanking } from '@/components/dashboard/league-ranking'
import { PrizePool } from '@/components/dashboard/prize-pool'

export default function Page() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <Topbar />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Left + center: portfolio, P&L, assets */}
            <div className="flex flex-col gap-6 xl:col-span-2">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <PortfolioCard />
                <PrizePool />
              </div>
              <PnlChart />
              <TopAssets />
            </div>

            {/* Right rail: trade + league */}
            <div className="flex flex-col gap-6">
              <TradePanel />
              <LeagueRanking />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
