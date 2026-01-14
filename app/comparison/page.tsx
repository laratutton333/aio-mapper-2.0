import { getComparisonData } from '@/lib/demo-data'

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export default async function ComparisonPage() {
  const data = getComparisonData()
  const { brands, byIntent } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Competitive Comparison</h1>
        <p className="text-slate-500 dark:text-slate-400">Compare your brand visibility against competitors</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6" data-testid="card-overall-comparison">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Overall Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Brand</th>
                <th className="text-right py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Presence Rate</th>
                <th className="text-right py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Citation Rate</th>
                <th className="text-right py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Recommendation Rate</th>
                <th className="text-right py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Composite Score</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand, index) => (
                <tr 
                  key={brand.brand} 
                  className={`border-b border-slate-100 dark:border-slate-700/50 last:border-0 ${index === 0 ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  data-testid={`row-brand-${brand.brand.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <td className="py-3">
                    <span className={`font-medium ${index === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                      {brand.brand}
                      {index === 0 && <span className="ml-2 text-xs">(Your Brand)</span>}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm text-slate-900 dark:text-white">{formatPercent(brand.presenceRate)}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm text-slate-900 dark:text-white">{formatPercent(brand.citationRate)}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm text-slate-900 dark:text-white">{formatPercent(brand.recommendationRate)}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatPercent(brand.compositeScore)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {byIntent.map((intentData) => (
          <div 
            key={intentData.intent} 
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
            data-testid={`card-intent-${intentData.intent}`}
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 capitalize">
              {intentData.intent} Intent
            </h3>
            <div className="space-y-4">
              {intentData.data.map((brand, index) => (
                <div key={brand.brand} className="flex items-center justify-between">
                  <span className={`${index === 0 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>
                    {brand.brand}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-slate-400'}`}
                        style={{ width: `${brand.compositeScore * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white w-12 text-right">
                      {formatPercent(brand.compositeScore)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
