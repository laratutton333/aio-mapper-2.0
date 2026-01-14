import { getDashboardData } from '@/lib/demo-data'

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

function formatTrend(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${(value * 100).toFixed(1)}%`
}

function TrendBadge({ value }: { value: number }) {
  const isPositive = value >= 0
  return (
    <span className={`inline-flex items-center text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      <svg className={`w-3 h-3 mr-0.5 ${isPositive ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
      {formatTrend(value)}
    </span>
  )
}

export default async function DashboardPage() {
  const data = getDashboardData()
  const { summary, scoresByIntent, citationsByType, recentRuns } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Overview of your brand&apos;s AI visibility metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6" data-testid="card-composite-score">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Composite Score</h3>
            <TrendBadge value={summary.compositeScoreTrend} />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatPercent(summary.compositeScore)}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6" data-testid="card-presence-rate">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Presence Rate</h3>
            <TrendBadge value={summary.presenceRateTrend} />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatPercent(summary.presenceRate)}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6" data-testid="card-citation-rate">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Citation Rate</h3>
            <TrendBadge value={summary.citationRateTrend} />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatPercent(summary.citationRate)}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6" data-testid="card-recommendation-rate">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Recommendation Rate</h3>
            <TrendBadge value={summary.recommendationRateTrend} />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatPercent(summary.recommendationRate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6" data-testid="card-scores-by-intent">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Scores by Intent</h3>
          <div className="space-y-4">
            {scoresByIntent.map((item) => (
              <div key={item.intent} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="capitalize text-slate-700 dark:text-slate-300">{item.intent}</span>
                  <span className="text-xs text-slate-500">({item.count} prompts)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${item.score * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white w-12 text-right">
                    {formatPercent(item.score)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6" data-testid="card-citations-by-type">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Citations by Type</h3>
          <div className="space-y-4">
            {citationsByType.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 capitalize">{item.type.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">{item.count}</span>
                  <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${item.percentage * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white w-12 text-right">
                    {formatPercent(item.percentage)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6" data-testid="card-recent-runs">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Prompt Runs</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Prompt</th>
                <th className="text-left py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Intent</th>
                <th className="text-left py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Match</th>
                <th className="text-left py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Cited</th>
                <th className="text-right py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Score</th>
              </tr>
            </thead>
            <tbody>
              {recentRuns.map((run) => (
                <tr key={run.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                  <td className="py-3 text-sm text-slate-900 dark:text-white">{run.promptName}</td>
                  <td className="py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 capitalize">
                      {run.intent}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                      run.matchType === 'primary' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      run.matchType === 'secondary' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                      'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400'
                    }`}>
                      {run.matchType}
                    </span>
                  </td>
                  <td className="py-3">
                    {run.isCited ? (
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-300 dark:text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatPercent(run.compositeScore)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
