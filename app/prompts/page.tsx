import Link from 'next/link'
import { getPromptRunsData } from '@/lib/demo-data'

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`
}

export default async function PromptsPage() {
  const data = getPromptRunsData()
  const { runs } = data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Prompt Runs</h1>
          <p className="text-slate-500 dark:text-slate-400">View all prompt executions and their results</p>
        </div>
        <Link 
          href="/dashboard" 
          className="text-sm text-blue-600 hover:text-blue-700"
          data-testid="link-back-dashboard"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Prompt</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Intent</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Mentions</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Citations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {runs.map((item) => {
              const targetMention = item.mentions.find(m => m.isTargetBrand)
              return (
                <tr key={item.run.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30" data-testid={`row-prompt-${item.run.id}`}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{item.template.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-md">{item.template.template}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 capitalize">
                      {item.template.intent}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {targetMention ? (
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                          targetMention.matchType === 'primary' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          targetMention.matchType === 'secondary' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                          'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400'
                        }`}>
                          {targetMention.matchType}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatPercent(targetMention.confidence)} confidence
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400">No mention</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-900 dark:text-white">
                      {item.citations.length} citations
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
