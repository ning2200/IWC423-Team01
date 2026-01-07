import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral',
  subtitle,
  className = ''
}) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500'
  }

  const ChangeIcon = changeType === 'positive' 
    ? TrendingUp 
    : changeType === 'negative' 
      ? TrendingDown 
      : Minus

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm card-hover ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-bank-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-bank-primary" />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-3 text-sm ${changeColors[changeType]}`}>
          <ChangeIcon className="w-4 h-4" />
          <span>{change}</span>
        </div>
      )}
    </div>
  )
}
