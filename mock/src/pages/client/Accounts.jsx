import { CreditCard, ArrowUpRight, ArrowDownLeft, Calendar, Hash } from 'lucide-react'
import { customers, accounts } from '../../data/mockData'
import { transactions } from '../../data/transactions'

// Mock logged-in user (Jane Smith - Customer ID 2)
const currentCustomer = customers.find(c => c.customerId === 2)
const customerAccounts = accounts.filter(a => a.customerId === 2)

export default function ClientAccounts() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Accounts</h1>
        <p className="text-gray-500 mt-1">Manage your bank accounts</p>
      </div>

      {/* Account Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Account Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              ${customerAccounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Number of Accounts</p>
            <p className="text-2xl font-bold text-gray-900">{customerAccounts.length}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Account Types</p>
            <p className="text-2xl font-bold text-gray-900">
              {[...new Set(customerAccounts.map(a => a.accountType))].length}
            </p>
          </div>
        </div>
      </div>

      {/* Account Cards */}
      <div className="space-y-4">
        {customerAccounts.map(account => {
          const accountTxns = transactions.filter(t => t.accountId === account.accountId)
          const lastTxn = accountTxns.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))[0]
          const totalDeposits = accountTxns.filter(t => t.transactionType === 'Deposit').reduce((sum, t) => sum + t.totalAmount, 0)
          const totalWithdrawals = accountTxns.filter(t => ['Withdrawal', 'Transfer', 'Purchase'].includes(t.transactionType)).reduce((sum, t) => sum + t.totalAmount, 0)

          return (
            <div key={account.accountId} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Account Header */}
              <div className={`p-6 ${
                account.accountType === 'Checking' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                account.accountType === 'Savings' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                'bg-gradient-to-r from-purple-500 to-purple-600'
              } text-white`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-white/80">{account.accountType} Account</p>
                    <p className="text-3xl font-bold mt-1">
                      ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <CreditCard className="w-10 h-10 text-white/50" />
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <Hash className="w-4 h-4" />
                    <span className="font-mono">{account.accountNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Opened {new Date(account.openDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Currency</p>
                    <p className="font-medium text-gray-900">{account.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {account.accountStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Deposits</p>
                    <p className="font-medium text-green-600">
                      +${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Withdrawals</p>
                    <p className="font-medium text-gray-900">
                      -${totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3">Recent Activity</p>
                  {lastTxn ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          lastTxn.transactionType === 'Deposit' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {lastTxn.transactionType === 'Deposit' ? (
                            <ArrowDownLeft className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{lastTxn.transactionType}</p>
                          <p className="text-xs text-gray-500">{lastTxn.channel}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          lastTxn.transactionType === 'Deposit' ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {lastTxn.transactionType === 'Deposit' ? '+' : '-'}
                          ${lastTxn.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(lastTxn.transactionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
