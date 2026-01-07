import { useState } from 'react'
import { Search, Filter, MapPin, Smartphone, Monitor, Clock } from 'lucide-react'
import DataTable from '../../components/DataTable'
import { StatusBadge, FraudBadge } from '../../components/StatusBadge'
import { customers, accounts } from '../../data/mockData'
import { transactions } from '../../data/transactions'

export default function AdminTransactions() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [fraudFilter, setFraudFilter] = useState('all')

  // Enrich transactions
  const enrichedTransactions = transactions.map(t => {
    const customer = customers.find(c => c.customerId === t.customerId)
    const account = accounts.find(a => a.accountId === t.accountId)
    return {
      ...t,
      customerName: customer?.customerName || 'Unknown',
      accountNumber: account?.accountNumber || 'Unknown',
      accountType: account?.accountType || 'Unknown'
    }
  }).sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))

  // Filter transactions
  const filteredTransactions = enrichedTransactions.filter(t => {
    const matchesSearch = t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || t.statusId === parseInt(statusFilter)
    const matchesType = typeFilter === 'all' || t.transactionType === typeFilter
    const matchesFraud = fraudFilter === 'all' || 
                         (fraudFilter === 'fraud' && t.fraudFlag) ||
                         (fraudFilter === 'clean' && !t.fraudFlag)
    return matchesSearch && matchesStatus && matchesType && matchesFraud
  })

  const statusMap = { 1: 'Pending', 2: 'Posted', 3: 'Failed', 4: 'Reversed' }

  const columns = [
    { 
      header: 'Transaction', 
      render: (row) => (
        <div>
          <p className="font-mono text-sm font-medium text-gray-900">{row.transactionId}</p>
          <p className="text-xs text-gray-500">{row.customerName}</p>
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
    { header: 'Type', accessor: 'transactionType' },
    { 
      header: 'Amount', 
      render: (row) => (
        <span className={`font-bold ${row.fraudFlag ? 'text-red-600' : 'text-gray-900'}`}>
          ${row.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    { header: 'Channel', accessor: 'channel' },
    { 
      header: 'Status', 
      render: (row) => <StatusBadge status={statusMap[row.statusId]} type="transaction" />
    },
    { 
      header: 'Fraud', 
      render: (row) => row.fraudFlag ? <FraudBadge isFraud={true} /> : <span className="text-gray-400 text-xs">—</span>
    },
    { 
      header: 'Device', 
      render: (row) => {
        const Icon = row.deviceUsed === 'Mobile' ? Smartphone : Monitor
        return (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Icon className="w-4 h-4" />
            <span>{row.deviceUsed}</span>
          </div>
        )
      }
    },
    { 
      header: 'Location', 
      render: (row) => (
        <div className="flex items-center gap-1 text-xs text-gray-500 max-w-[120px]">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{row.geolocation}</span>
        </div>
      )
    },
    { 
      header: 'Date', 
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Clock className="w-3 h-3" />
          <span>{new Date(row.transactionDate).toLocaleDateString()}</span>
        </div>
      )
    },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-500 mt-1">Monitor all banking transactions</p>
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-secondary"
        >
          <option value="all">All Status</option>
          <option value="1">Pending</option>
          <option value="2">Posted</option>
          <option value="3">Failed</option>
          <option value="4">Reversed</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-secondary"
        >
          <option value="all">All Types</option>
          <option value="Deposit">Deposit</option>
          <option value="Withdrawal">Withdrawal</option>
          <option value="Transfer">Transfer</option>
          <option value="Purchase">Purchase</option>
          <option value="Disbursement">Disbursement</option>
        </select>
        <select
          value={fraudFilter}
          onChange={(e) => setFraudFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-secondary"
        >
          <option value="all">All Transactions</option>
          <option value="fraud">Fraud Flagged</option>
          <option value="clean">Clean</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {transactions.filter(t => t.statusId === 1).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Posted</p>
          <p className="text-2xl font-bold text-green-600">
            {transactions.filter(t => t.statusId === 2).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Failed</p>
          <p className="text-2xl font-bold text-red-600">
            {transactions.filter(t => t.statusId === 3).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Fraud Flags</p>
          <p className="text-2xl font-bold text-red-600">
            {transactions.filter(t => t.fraudFlag).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Volume</p>
          <p className="text-xl font-bold text-gray-900">
            ${(transactions.reduce((sum, t) => sum + t.totalAmount, 0) / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredTransactions}
        emptyMessage="No transactions found matching your criteria"
      />
    </div>
  )
}
