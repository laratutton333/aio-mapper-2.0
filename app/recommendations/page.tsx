import { getRecommendationsData } from '@/lib/demo-data'

export default async function RecommendationsPage() {
  const data = getRecommendationsData()
  const { recommendations, stats } = data

  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    in_progress: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    dismissed: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recommendations</h1>
        <p className="text-slate-500 dark:text-slate-400">Actionable insights to improve your AI visibility</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4" data-testid="stat-total">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4" data-testid="stat-high-priority">
          <p className="text-sm text-slate-500 dark:text-slate-400">High Priority</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.byPriority.high}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4" data-testid="stat-in-progress">
          <p className="text-sm text-slate-500 dark:text-slate-400">In Progress</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.byStatus.in_progress}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4" data-testid="stat-completed">
          <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.byStatus.completed}</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div 
            key={rec.id} 
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
            data-testid={`card-recommendation-${rec.id}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${priorityColors[rec.priority]}`}>
                    {rec.priority}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${statusColors[rec.status]}`}>
                    {rec.status.replace('_', ' ')}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 capitalize">
                    {rec.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{rec.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{rec.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Impact: </span>
                    <span className="text-slate-900 dark:text-white font-medium">{rec.impact}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Effort: </span>
                    <span className="text-slate-900 dark:text-white font-medium capitalize">{rec.effort}</span>
                  </div>
                </div>
              </div>
              {rec.status === 'pending' && (
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  data-testid={`button-start-${rec.id}`}
                >
                  Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
