import { useState } from 'react'
import { Search, Filter, Mail, Phone, MapPin } from 'lucide-react'
import DataTable from '../../components/DataTable'
import { StatusBadge, RiskIndicator } from '../../components/StatusBadge'
import { customers, accounts } from '../../data/mockData'

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [kycFilter, setKycFilter] = useState('all')

  // Enrich customers with account count
  const enrichedCustomers = customers.map(c => ({
    ...c,
    accountCount: accounts.filter(a => a.customerId === c.customerId).length,
    totalBalance: accounts
      .filter(a => a.customerId === c.customerId)
      .reduce((sum, a) => sum + a.balance, 0)
  }))

  // Filter customers
  const filteredCustomers = enrichedCustomers.filter(c => {
    const matchesSearch = c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesKyc = kycFilter === 'all' || c.kycStatus === kycFilter
    return matchesSearch && matchesKyc
  })

  const columns = [
    { 
      header: 'Customer', 
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.customerName}</p>
          <p className="text-xs text-gray-500">ID: {row.customerId}</p>
        </div>
      )
    },
    { 
      header: 'Contact', 
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Mail className="w-3 h-3" />
            <span>{row.email}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Phone className="w-3 h-3" />
            <span>{row.phone}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Address', 
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-gray-600 max-w-xs">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{row.address}</span>
        </div>
      )
    },
    { 
      header: 'KYC Status', 
      render: (row) => <StatusBadge status={row.kycStatus} type="kyc" />
    },
    { 
      header: 'Risk Rating', 
      render: (row) => <RiskIndicator rating={row.riskRating} />
    },
    { 
      header: 'Accounts', 
      render: (row) => (
        <div className="text-center">
          <span className="text-lg font-bold text-gray-900">{row.accountCount}</span>
        </div>
      )
    },
    { 
      header: 'Total Balance', 
      render: (row) => (
        <span className="font-medium text-gray-900">
          ${row.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      )
    },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-1">Manage customer profiles and KYC status</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-secondary focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-secondary"
          >
            <option value="all">All KYC Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Customers</p>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Verified</p>
          <p className="text-2xl font-bold text-green-600">
            {customers.filter(c => c.kycStatus === 'Verified').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending KYC</p>
          <p className="text-2xl font-bold text-yellow-600">
            {customers.filter(c => c.kycStatus === 'Pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">High Risk</p>
          <p className="text-2xl font-bold text-red-600">
            {customers.filter(c => c.riskRating >= 0.6).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredCustomers}
        emptyMessage="No customers found matching your criteria"
      />
    </div>
  )
}
