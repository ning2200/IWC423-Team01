export function StatusBadge({ status, type = 'transaction' }) {
  const configs = {
    transaction: {
      Pending: 'bg-yellow-100 text-yellow-800',
      Posted: 'bg-green-100 text-green-800',
      Failed: 'bg-red-100 text-red-800',
      Reversed: 'bg-gray-100 text-gray-800',
    },
    kyc: {
      Verified: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Rejected: 'bg-red-100 text-red-800',
    },
    account: {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-gray-100 text-gray-800',
      Suspended: 'bg-red-100 text-red-800',
    },
    risk: {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-red-100 text-red-800',
    }
  }

  const colorClass = configs[type]?.[status] || 'bg-gray-100 text-gray-800'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  )
}

export function FraudBadge({ isFraud }) {
  if (!isFraud) return null
  
  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 fraud-alert">
      ⚠️ Fraud Alert
    </span>
  )
}

export function RiskIndicator({ rating }) {
  const percentage = Math.round(rating * 100)
  const getRiskLevel = (r) => {
    if (r < 0.3) return { level: 'Low', color: 'bg-green-500' }
    if (r < 0.6) return { level: 'Medium', color: 'bg-yellow-500' }
    return { level: 'High', color: 'bg-red-500' }
  }
  
  const { level, color } = getRiskLevel(rating)

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-600">{percentage}% ({level})</span>
    </div>
  )
}
