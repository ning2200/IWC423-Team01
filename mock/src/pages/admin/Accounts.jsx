import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import DataTable from '../../components/DataTable'
import { StatusBadge } from '../../components/StatusBadge'
import { customers, accounts, HIGH_BALANCE_THRESHOLD } from '../../data/mockData'
import { transactions } from '../../data/transactions'

export default function AdminAccounts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  // Enrich accounts with customer name and transaction count
  const enrichedAccounts = accounts.map(a => {
    const customer = customers.find(c => c.customerId === a.customerId)
    const accountTxns = transactions.filter(t => t.accountId === a.accountId)
    return {
      ...a,
      customerName: customer?.customerName || 'Unknown',
      transactionCount: accountTxns.length,
      isHighBalance: a.balance > HIGH_BALANCE_THRESHOLD
    }
  })

  // Filter accounts
  const filteredAccounts = enrichedAccounts.filter(a => {
    const matchesSearch = a.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || a.accountType === typeFilter
    return matchesSearch && matchesType
  })

  const columns = [
    { 
      header: 'Account Number', 
      render: (row) => (
        <div>
          <p className="font-mono font-medium text-gray-900">{row.accountNumber}</p>
          <p className="text-xs text-gray-500">ID: {row.accountId}</p>
        </div>
      )
    },
    { 
      header: 'Customer', 
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.customerName}</p>
          <p className="text-xs text-gray-500">CID: {row.customerId}</p>
        </div>
      )
    },
    { 
      header: 'Type', 
      render: (row) => {
        const colors = {
          Checking: 'bg-blue-100 text-blue-800',
          Savings: 'bg-green-100 text-green-800',
          Loan: 'bg-purple-100 text-purple-800',
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[row.accountType]}`}>
            {row.accountType}
          </span>
        )
      }
    },
    { 
      header: 'Balance', 
      render: (row) => (
        <div>
          <p className={`font-bold ${row.isHighBalance ? 'text-green-600' : 'text-gray-900'}`}>
            ${row.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          {row.isHighBalance && (
            <span className="text-xs text-green-600">⬆ High Balance</span>
          )}
        </div>
      )
    },
    { header: 'Currency', accessor: 'currency' },
    { 
      header: 'Status', 
      render: (row) => <StatusBadge status={row.accountStatus} type="account" />
    },
    { 
      header: 'Open Date', 
      render: (row) => new Date(row.openDate).toLocaleDateString()
    },
    { 
      header: 'Transactions', 
      render: (row) => (
        <span className="font-medium text-gray-900">{row.transactionCount}</span>
      )
    },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
        <p className="text-gray-500 mt-1">View and manage customer accounts</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by account number or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-secondary focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-secondary"
          >
            <option value="all">All Types</option>
            <option value="Checking">Checking</option>
            <option value="Savings">Savings</option>
            <option value="Loan">Loan</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Accounts</p>
          <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Checking</p>
          <p className="text-2xl font-bold text-blue-600">
            {accounts.filter(a => a.accountType === 'Checking').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Savings</p>
          <p className="text-2xl font-bold text-green-600">
            {accounts.filter(a => a.accountType === 'Savings').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Loan</p>
          <p className="text-2xl font-bold text-purple-600">
            {accounts.filter(a => a.accountType === 'Loan').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">High Balance</p>
          <p className="text-2xl font-bold text-green-600">
            {accounts.filter(a => a.balance > HIGH_BALANCE_THRESHOLD).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredAccounts}
        emptyMessage="No accounts found matching your criteria"
      />
    </div>
  )
}
