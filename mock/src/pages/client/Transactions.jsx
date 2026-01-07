import { useState } from 'react'
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Download } from 'lucide-react'
import DataTable from '../../components/DataTable'
import { StatusBadge } from '../../components/StatusBadge'
import { customers, accounts } from '../../data/mockData'
import { transactions } from '../../data/transactions'

// Mock logged-in user (Jane Smith - Customer ID 2)
const currentCustomer = customers.find(c => c.customerId === 2)
const customerAccounts = accounts.filter(a => a.customerId === 2)
const customerTransactions = transactions
  .filter(t => t.customerId === 2)
  .map(t => {
    const account = customerAccounts.find(a => a.accountId === t.accountId)
    return {
      ...t,
      accountNumber: account?.accountNumber || 'Unknown',
      accountType: account?.accountType || 'Unknown'
    }
  })
  .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))

export default function ClientTransactions() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [accountFilter, setAccountFilter] = useState('all')

  const filteredTransactions = customerTransactions.filter(t => {
    const matchesSearch = t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || t.transactionType === typeFilter
    const matchesAccount = accountFilter === 'all' || t.accountId === parseInt(accountFilter)
    return matchesSearch && matchesType && matchesAccount
  })

  const statusMap = { 1: 'Pending', 2: 'Posted', 3: 'Failed', 4: 'Reversed' }

  const columns = [
    {
      header: 'Type',
      render: (row) => {
        const isCredit = ['Deposit', 'Disbursement'].includes(row.transactionType)
        return (
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded ${isCredit ? 'bg-green-100' : 'bg-gray-100'}`}>
              {isCredit ? (
                <ArrowDownLeft className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowUpRight className="w-4 h-4 text-gray-600" />
              )}
            </div>
            <span className="font-medium text-gray-900">{row.transactionType}</span>
          </div>
        )
      }
    },
    {
      header: 'Description',
      render: (row) => (
        <div>
          <p className="text-gray-900">{row.notes || row.channel}</p>
          <p className="text-xs text-gray-500 font-mono">{row.transactionId}</p>
        </div>
      )
    },
    {
      header: 'Account',
      render: (row) => (
        <div>
          <p className="font-mono text-sm text-gray-900">{row.accountNumber}</p>
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            row.accountType === 'Checking' ? 'bg-blue-50 text-blue-600' :
            row.accountType === 'Savings' ? 'bg-green-50 text-green-600' :
            'bg-purple-50 text-purple-600'
          }`}>
            {row.accountType}
          </span>
        </div>
      )
    },
    {
      header: 'Amount',
      render: (row) => {
        const isCredit = ['Deposit', 'Disbursement'].includes(row.transactionType)
        return (
          <span className={`font-bold ${isCredit ? 'text-green-600' : 'text-gray-900'}`}>
            {isCredit ? '+' : '-'}${row.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        )
      }
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={statusMap[row.statusId]} type="transaction" />
    },
    {
      header: 'Date',
      render: (row) => (
        <div>
          <p className="text-gray-900">{new Date(row.transactionDate).toLocaleDateString()}</p>
          <p className="text-xs text-gray-500">{new Date(row.transactionDate).toLocaleTimeString()}</p>
        </div>
      )
    }
  ]

  const totalDeposits = filteredTransactions
    .filter(t => ['Deposit', 'Disbursement'].includes(t.transactionType))
    .reduce((sum, t) => sum + t.totalAmount, 0)
  
  const totalSpending = filteredTransactions
    .filter(t => !['Deposit', 'Disbursement'].includes(t.transactionType))
    .reduce((sum, t) => sum + t.totalAmount, 0)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">View your transaction history</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-bank-primary text-white rounded-lg hover:bg-bank-primary/90 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Deposits</p>
          <p className="text-2xl font-bold text-green-600">
            +${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Spending</p>
          <p className="text-2xl font-bold text-gray-900">
            -${totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-secondary focus:border-transparent"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-secondary"
        >
          <option value="all">All Types</option>
          <option value="Deposit">Deposits</option>
          <option value="Withdrawal">Withdrawals</option>
          <option value="Transfer">Transfers</option>
          <option value="Purchase">Purchases</option>
        </select>
        <select
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-secondary"
        >
          <option value="all">All Accounts</option>
          {customerAccounts.map(a => (
            <option key={a.accountId} value={a.accountId}>
              {a.accountNumber} ({a.accountType})
            </option>
          ))}
        </select>
      </div>

      {/* Transactions Table */}
      <DataTable 
        columns={columns} 
        data={filteredTransactions}
        emptyMessage="No transactions found"
      />
    </div>
  )
}
