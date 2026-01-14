import { getCitationsData } from '@/lib/demo-data'

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export default async function CitationsPage() {
  const data = getCitationsData()
  const { byType, byDomain, topCitations } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Citations</h1>
        <p className="text-slate-500 dark:text-slate-400">Analyze sources cited in AI responses about your brand</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6" data-testid="card-citations-by-type">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Citations by Type</h3>
          <div className="space-y-4">
            {byType.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 capitalize">{item.type.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">{item.count}</span>
                  <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
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

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6" data-testid="card-citations-by-domain">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Domains</h3>
          <div className="space-y-3">
            {byDomain.map((item) => (
              <div key={item.domain} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 dark:text-slate-300">{item.domain}</span>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                    item.type === 'brand_owned' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    item.type === 'publisher' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                    'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400'
                  }`}>
                    {item.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">{item.count} citations</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {formatPercent(item.authorityScore)} authority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6" data-testid="card-top-citations">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Most Cited URLs</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 text-sm font-medium text-slate-500 dark:text-slate-400">URL</th>
                <th className="text-left py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Type</th>
                <th className="text-right py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Count</th>
                <th className="text-right py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Authority</th>
              </tr>
            </thead>
            <tbody>
              {topCitations.map((citation) => (
                <tr key={citation.url} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                  <td className="py-3">
                    <a 
                      href={citation.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      {citation.url}
                    </a>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                      {citation.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-slate-900 dark:text-white">
                    {citation.count}
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-slate-900 dark:text-white">
                    {formatPercent(citation.authorityScore)}
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
