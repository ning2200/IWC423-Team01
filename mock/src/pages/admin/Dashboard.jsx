import { Users, CreditCard, ArrowLeftRight, ShieldAlert, Clock, TrendingUp, DollarSign } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StatCard from '../../components/StatCard'
import DataTable from '../../components/DataTable'
import { StatusBadge, FraudBadge } from '../../components/StatusBadge'
import { customers, accounts, FRAUD_THRESHOLDS, HIGH_BALANCE_THRESHOLD, INACTIVE_DAYS_THRESHOLD } from '../../data/mockData'
import { transactions } from '../../data/transactions'

// Calculate stats
const totalCustomers = customers.length
const totalAccounts = accounts.length
const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
const totalTransactions = transactions.length
const fraudTransactions = transactions.filter(t => t.fraudFlag).length
const highBalanceAccounts = accounts.filter(a => a.balance > HIGH_BALANCE_THRESHOLD).length

// Prepare chart data
const monthlyData = [
  { month: 'Oct', transactions: 45, volume: 125000 },
  { month: 'Nov', transactions: 62, volume: 185000 },
  { month: 'Dec', transactions: 78, volume: 245000 },
  { month: 'Jan', transactions: 35, volume: 95000 },
]

const transactionTypeData = [
  { name: 'Deposit', value: 35, color: '#10b981' },
  { name: 'Withdrawal', value: 28, color: '#8B1538' },
  { name: 'Transfer', value: 25, color: '#A91D3A' },
  { name: 'Purchase', value: 8, color: '#C73659' },
  { name: 'Disbursement', value: 4, color: '#5C0E24' },
]

// Recent transactions
const recentTransactions = transactions
  .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
  .slice(0, 5)

const transactionColumns = [
  { header: 'ID', accessor: 'transactionId' },
  { header: 'Type', accessor: 'transactionType' },
  { 
    header: 'Amount', 
    render: (row) => (
      <span className="font-medium">
        ${row.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    )
  },
  { 
    header: 'Status', 
    render: (row) => {
      const statusMap = { 1: 'Pending', 2: 'Posted', 3: 'Failed', 4: 'Reversed' }
      return <StatusBadge status={statusMap[row.statusId]} type="transaction" />
    }
  },
  { 
    header: 'Fraud', 
    render: (row) => <FraudBadge isFraud={row.fraudFlag} />
  },
  { 
    header: 'Date', 
    render: (row) => new Date(row.transactionDate).toLocaleDateString()
  },
]

export default function AdminDashboard() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">IWC423-Team01-Bank-Pte-Ltd Operations Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={Users}
          change="+2 this month"
          changeType="positive"
        />
        <StatCard
          title="Total Accounts"
          value={totalAccounts}
          icon={CreditCard}
          change="+3 this month"
          changeType="positive"
        />
        <StatCard
          title="Total Balance"
          value={`$${(totalBalance / 1000).toFixed(0)}K`}
          icon={DollarSign}
          subtitle={`$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        />
        <StatCard
          title="Transactions"
          value={totalTransactions}
          icon={ArrowLeftRight}
          change={`${fraudTransactions} flagged`}
          changeType="negative"
        />
      </div>

      {/* Module 3 Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-900">Fraud Alerts</p>
              <p className="text-2xl font-bold text-red-600">{fraudTransactions}</p>
            </div>
          </div>
          <p className="text-xs text-red-600 mt-2">
            Transactions exceeding thresholds
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-900">Inactive Accounts</p>
              <p className="text-2xl font-bold text-yellow-600">2</p>
            </div>
          </div>
          <p className="text-xs text-yellow-600 mt-2">
            No activity for {INACTIVE_DAYS_THRESHOLD}+ days
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">High Balance</p>
              <p className="text-2xl font-bold text-green-600">{highBalanceAccounts}</p>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            Balance &gt; ${HIGH_BALANCE_THRESHOLD.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Transaction Volume Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Transaction Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#8B1538" 
                  fill="#A91D3A" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Type Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Transaction Types</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transactionTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {transactionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {transactionTypeData.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
          <a href="#/admin/transactions" className="text-sm text-bank-secondary hover:underline">
            View all →
          </a>
        </div>
        <DataTable columns={transactionColumns} data={recentTransactions} />
      </div>

      {/* Fraud Thresholds Reference */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Module 3: Fraud Detection Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(FRAUD_THRESHOLDS).map(([type, { max }]) => (
            <div key={type} className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">{type} Account</p>
              <p className="text-lg font-bold text-gray-900">
                Max: ${max.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Transactions exceeding this trigger fraud alert
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
