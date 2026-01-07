import { useState } from 'react'
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Database,
  Server,
  FileJson
} from 'lucide-react'
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import CodeBlock from '../../components/CodeBlock'
import { customers, accounts, bankProducts } from '../../data/mockData'
import { transactions } from '../../data/transactions'

// Prepare analytics data
const transactionsByType = [
  { type: 'Deposit', count: transactions.filter(t => t.transactionType === 'Deposit').length, color: '#10b981' },
  { type: 'Withdrawal', count: transactions.filter(t => t.transactionType === 'Withdrawal').length, color: '#8B1538' },
  { type: 'Transfer', count: transactions.filter(t => t.transactionType === 'Transfer').length, color: '#A91D3A' },
  { type: 'Purchase', count: transactions.filter(t => t.transactionType === 'Purchase').length, color: '#C73659' },
  { type: 'Disbursement', count: transactions.filter(t => t.transactionType === 'Disbursement').length, color: '#5C0E24' },
]

const transactionsByStatus = [
  { status: 'Pending', count: transactions.filter(t => t.statusId === 1).length, color: '#f59e0b' },
  { status: 'Posted', count: transactions.filter(t => t.statusId === 2).length, color: '#10b981' },
  { status: 'Failed', count: transactions.filter(t => t.statusId === 3).length, color: '#ef4444' },
  { status: 'Reversed', count: transactions.filter(t => t.statusId === 4).length, color: '#6b7280' },
]

const accountsByType = [
  { type: 'Checking', count: accounts.filter(a => a.accountType === 'Checking').length, color: '#8B1538' },
  { type: 'Savings', count: accounts.filter(a => a.accountType === 'Savings').length, color: '#A91D3A' },
  { type: 'Loan', count: accounts.filter(a => a.accountType === 'Loan').length, color: '#C73659' },
]

const customersByRisk = [
  { risk: 'Low (<30%)', count: customers.filter(c => c.riskRating < 0.3).length, color: '#10b981' },
  { risk: 'Medium (30-60%)', count: customers.filter(c => c.riskRating >= 0.3 && c.riskRating < 0.6).length, color: '#f59e0b' },
  { risk: 'High (>60%)', count: customers.filter(c => c.riskRating >= 0.6).length, color: '#ef4444' },
]

const monthlyVolume = [
  { month: 'Sep', volume: 85000, transactions: 32 },
  { month: 'Oct', volume: 125000, transactions: 45 },
  { month: 'Nov', volume: 185000, transactions: 62 },
  { month: 'Dec', volume: 245000, transactions: 78 },
  { month: 'Jan', volume: 95000, transactions: 35 },
]

const channelDistribution = [
  { channel: 'Mobile', count: transactions.filter(t => t.channel === 'Mobile').length },
  { channel: 'ATM', count: transactions.filter(t => t.channel === 'ATM').length },
  { channel: 'Branch', count: transactions.filter(t => t.channel === 'Branch').length },
  { channel: 'Online', count: transactions.filter(t => t.channel === 'Online').length },
  { channel: 'POS', count: transactions.filter(t => t.channel === 'POS').length },
  { channel: 'System', count: transactions.filter(t => t.channel === 'System').length },
]

// PostgreSQL Analytics Query
const postgresAnalyticsQuery = `-- PostgreSQL: Analytics View for Transaction Summary
-- Used for operational reporting (OLTP)

CREATE OR REPLACE VIEW View_TransactionAnalytics AS
SELECT 
    DATE_TRUNC('month', t.TransactionDate) AS Month,
    t.TransactionType,
    a.AccountType,
    ts.StatusName,
    COUNT(*) AS TransactionCount,
    SUM(t.TotalAmount) AS TotalVolume,
    AVG(t.TotalAmount) AS AvgAmount,
    COUNT(CASE WHEN t.TotalAmount > 10000 THEN 1 END) AS LargeTransactions
FROM Transactions t
JOIN Accounts a ON t.AccountID = a.AccountID
JOIN TransactionStatus ts ON t.StatusID = ts.StatusID
GROUP BY 
    DATE_TRUNC('month', t.TransactionDate),
    t.TransactionType,
    a.AccountType,
    ts.StatusName
ORDER BY Month DESC, TotalVolume DESC;

-- Query the view
SELECT * FROM View_TransactionAnalytics
WHERE Month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 months');`

// MongoDB Analytics Pipeline
const mongoAnalyticsPipeline = `// MongoDB: Real-time Analytics Pipeline
// Used for flexible analytics queries (OLAP)

// 1. Transaction Volume by Channel and Risk Score
db.transaction_events.aggregate([
  {
    $match: {
      timestamp: { $gte: ISODate("2025-10-01") }
    }
  },
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "customerId",
      as: "customerInfo"
    }
  },
  {
    $unwind: "$customerInfo"
  },
  {
    $group: {
      _id: {
        channel: "$transaction.channel",
        riskCategory: "$customerInfo.riskCategory"
      },
      transactionCount: { $sum: 1 },
      totalVolume: { $sum: "$transaction.amount" },
      avgLatency: { $avg: "$networkMetrics.latency" },
      fraudCount: {
        $sum: { $cond: ["$fraudAnalysis.flagged", 1, 0] }
      }
    }
  },
  {
    $project: {
      channel: "$_id.channel",
      riskCategory: "$_id.riskCategory",
      transactionCount: 1,
      totalVolume: { $round: ["$totalVolume", 2] },
      avgLatency: { $round: ["$avgLatency", 0] },
      fraudRate: {
        $round: [
          { $multiply: [
            { $divide: ["$fraudCount", "$transactionCount"] },
            100
          ]},
          2
        ]
      }
    }
  },
  {
    $sort: { totalVolume: -1 }
  }
]);

// 2. Customer Segmentation for Marketing
db.customers.aggregate([
  {
    $lookup: {
      from: "transaction_events",
      localField: "customerId",
      foreignField: "customerId",
      as: "transactions"
    }
  },
  {
    $addFields: {
      totalTransactions: { $size: "$transactions" },
      totalSpent: { $sum: "$transactions.transaction.amount" },
      avgTransactionValue: {
        $avg: "$transactions.transaction.amount"
      }
    }
  },
  {
    $bucket: {
      groupBy: "$totalSpent",
      boundaries: [0, 10000, 50000, 100000, 500000],
      default: "500000+",
      output: {
        customers: { $push: "$customerName" },
        count: { $sum: 1 },
        avgRiskRating: { $avg: "$riskRating" }
      }
    }
  }
]);`

export default function AdminAnalytics() {
  const [dbView, setDbView] = useState('combined')

  const totalVolume = transactions.reduce((sum, t) => sum + t.totalAmount, 0)
  const avgTransactionValue = totalVolume / transactions.length
  const fraudRate = (transactions.filter(t => t.fraudFlag).length / transactions.length * 100).toFixed(1)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500">PostgreSQL + MongoDB hybrid analytics pipeline</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Volume</p>
          <p className="text-2xl font-bold text-gray-900">
            ${(totalVolume / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Avg Transaction</p>
          <p className="text-2xl font-bold text-gray-900">
            ${avgTransactionValue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Fraud Rate</p>
          <p className="text-2xl font-bold text-red-600">{fraudRate}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Active Products</p>
          <p className="text-2xl font-bold text-gray-900">
            {bankProducts.filter(p => p.activeFlag).length}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Volume Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Transaction Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="volume" stroke="#8B1538" fill="#A91D3A" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction by Type */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Transactions by Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="type" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {transactionsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Transaction Status</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transactionsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {transactionsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Risk Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Customer Risk Distribution</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customersByRisk}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                  label={({ risk, count }) => `${count}`}
                >
                  {customersByRisk.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Channel Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Transactions by Channel</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis dataKey="channel" type="category" stroke="#64748b" fontSize={12} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Database View Toggle */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setDbView('combined')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dbView === 'combined' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Database className="w-4 h-4 inline mr-2" />
            Combined View
          </button>
          <button
            onClick={() => setDbView('postgresql')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dbView === 'postgresql' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Server className="w-4 h-4 inline mr-2" />
            PostgreSQL View
          </button>
          <button
            onClick={() => setDbView('mongodb')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dbView === 'mongodb' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FileJson className="w-4 h-4 inline mr-2" />
            MongoDB View
          </button>
        </div>
      </div>

      {/* Analytics Queries */}
      {(dbView === 'combined' || dbView === 'postgresql') && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            PostgreSQL Analytics Query
          </h3>
          <CodeBlock 
            code={postgresAnalyticsQuery} 
            language="sql" 
            title="View_TransactionAnalytics" 
          />
        </div>
      )}

      {(dbView === 'combined' || dbView === 'mongodb') && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileJson className="w-5 h-5 text-green-600" />
            MongoDB Analytics Pipeline
          </h3>
          <CodeBlock 
            code={mongoAnalyticsPipeline} 
            language="json" 
            title="Aggregation Pipelines" 
          />
        </div>
      )}
    </div>
  )
}
