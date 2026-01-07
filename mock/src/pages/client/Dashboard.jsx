import { CreditCard, ArrowUpRight, ArrowDownLeft, TrendingUp, Bell } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../../components/StatCard'
import { StatusBadge } from '../../components/StatusBadge'
import { customers, accounts, bankProducts, HIGH_BALANCE_THRESHOLD } from '../../data/mockData'
import { transactions } from '../../data/transactions'

// Mock logged-in user (Jane Smith - Customer ID 2)
const currentCustomer = customers.find(c => c.customerId === 2)
const customerAccounts = accounts.filter(a => a.customerId === 2)
const customerTransactions = transactions
  .filter(t => t.customerId === 2)
  .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
  .slice(0, 5)

const totalBalance = customerAccounts.reduce((sum, a) => sum + a.balance, 0)
const hasHighBalance = totalBalance > HIGH_BALANCE_THRESHOLD

// Monthly spending data
const monthlySpending = [
  { month: 'Sep', amount: 2500 },
  { month: 'Oct', amount: 3200 },
  { month: 'Nov', amount: 4100 },
  { month: 'Dec', amount: 5800 },
  { month: 'Jan', amount: 1200 },
]

export default function ClientDashboard() {
  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-bank-primary to-bank-secondary rounded-2xl p-6 text-white mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {currentCustomer.customerName.split(' ')[0]}!</h1>
            <p className="text-white/80 mt-1">Here's your financial overview</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/70">Total Balance</p>
            <p className="text-3xl font-bold">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* High Balance Recommendation */}
      {hasHighBalance && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">Investment Opportunity</h3>
              <p className="text-sm text-green-700 mt-1">
                With your balance exceeding ${HIGH_BALANCE_THRESHOLD.toLocaleString()}, you qualify for our premium 
                <strong> Platinum Investment</strong> account with up to <strong>5.00% APY</strong>!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Account Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerAccounts.map(account => (
            <div 
              key={account.accountId}
              className={`rounded-xl p-5 shadow-sm card-hover ${
                account.accountType === 'Checking' ? 'bg-gradient-to-br from-ku-crimson to-ku-crimson-dark' :
                account.accountType === 'Savings' ? 'bg-gradient-to-br from-ku-crimson-light to-ku-crimson' :
                'bg-gradient-to-br from-ku-crimson-dark to-gray-800'
              } text-white`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-white/80">{account.accountType}</p>
                  <p className="font-mono text-sm mt-1">{account.accountNumber}</p>
                </div>
                <CreditCard className="w-8 h-8 text-white/50" />
              </div>
              <p className="text-2xl font-bold">
                ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-white/60 mt-2">{account.currency}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Activity</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#8B1538" fill="#A91D3A" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ArrowDownLeft className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Deposits (30d)</p>
              <p className="text-xl font-bold text-gray-900">$58,933.24</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-bank-light rounded-lg">
              <ArrowUpRight className="w-6 h-6 text-ku-crimson" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spending (30d)</p>
              <p className="text-xl font-bold text-gray-900">$9,604.06</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-bank-light rounded-lg">
              <CreditCard className="w-6 h-6 text-ku-crimson" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Accounts</p>
              <p className="text-xl font-bold text-gray-900">{customerAccounts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
          <a href="#/client/transactions" className="text-sm text-bank-secondary hover:underline">
            View all →
          </a>
        </div>
        <div className="space-y-3">
          {customerTransactions.map(txn => {
            const isCredit = ['Deposit'].includes(txn.transactionType)
            return (
              <div key={txn.transactionId} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isCredit ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {isCredit ? (
                      <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{txn.transactionType}</p>
                    <p className="text-xs text-gray-500">{txn.notes || txn.channel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${isCredit ? 'text-green-600' : 'text-gray-900'}`}>
                    {isCredit ? '+' : '-'}${txn.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(txn.transactionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
