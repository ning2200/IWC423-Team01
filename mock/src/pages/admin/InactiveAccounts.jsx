import { Clock, Phone, Mail, AlertCircle, Calendar } from 'lucide-react'
import DataTable from '../../components/DataTable'
import CodeBlock from '../../components/CodeBlock'
import { customers, accounts, INACTIVE_DAYS_THRESHOLD } from '../../data/mockData'
import { transactions } from '../../data/transactions'

// Calculate inactive accounts (mirrors module_3_inactive_account_followup.sql)
const calculateInactiveAccounts = () => {
  const now = new Date('2026-01-07') // Current mock date
  
  return accounts.map(a => {
    const customer = customers.find(c => c.customerId === a.customerId)
    const accountTxns = transactions.filter(t => t.accountId === a.accountId)
    
    const lastTransaction = accountTxns.length > 0
      ? new Date(Math.max(...accountTxns.map(t => new Date(t.transactionDate))))
      : null
    
    const daysInactive = lastTransaction
      ? Math.floor((now - lastTransaction) / (1000 * 60 * 60 * 24))
      : Math.floor((now - new Date(a.openDate)) / (1000 * 60 * 60 * 24))
    
    return {
      ...a,
      customerName: customer?.customerName || 'Unknown',
      customerPhone: customer?.phone || 'N/A',
      customerEmail: customer?.email || 'N/A',
      lastTransactionDate: lastTransaction?.toISOString() || null,
      daysInactive,
      isInactive: lastTransaction === null || daysInactive > INACTIVE_DAYS_THRESHOLD
    }
  }).filter(a => a.isInactive).sort((a, b) => b.daysInactive - a.daysInactive)
}

const inactiveAccounts = calculateInactiveAccounts()

const columns = [
  { 
    header: 'Customer', 
    render: (row) => (
      <div>
        <p className="font-medium text-gray-900">{row.customerName}</p>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <Phone className="w-3 h-3" />
          <span>{row.customerPhone}</span>
        </div>
      </div>
    )
  },
  { 
    header: 'Account', 
    render: (row) => (
      <div>
        <p className="font-mono text-sm">{row.accountNumber}</p>
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
    header: 'Open Date', 
    render: (row) => (
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>{new Date(row.openDate).toLocaleDateString()}</span>
      </div>
    )
  },
  { 
    header: 'Last Transaction', 
    render: (row) => (
      <span className="text-sm text-gray-600">
        {row.lastTransactionDate 
          ? new Date(row.lastTransactionDate).toLocaleDateString()
          : <span className="text-red-500 italic">Never</span>
        }
      </span>
    )
  },
  { 
    header: 'Days Inactive', 
    render: (row) => (
      <div className="flex items-center gap-2">
        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
          row.daysInactive > 180 ? 'bg-red-100 text-red-700' :
          row.daysInactive > 120 ? 'bg-orange-100 text-orange-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {row.daysInactive} days
        </div>
      </div>
    )
  },
  { 
    header: 'Balance', 
    render: (row) => (
      <span className="font-medium text-gray-900">
        ${row.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    )
  },
  { 
    header: 'Action', 
    render: (row) => (
      <div className="flex gap-2">
        <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1">
          <Phone className="w-3 h-3" />
          Call
        </button>
        <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1">
          <Mail className="w-3 h-3" />
          Email
        </button>
      </div>
    )
  },
]

// SQL Query Code
const sqlQueryCode = `SELECT 
    c.CustomerName,
    c.Phone,
    a.AccountNumber,
    a.OpenDate,
    MAX(t.TransactionDate) AS LastTransactionDate,
    CURRENT_DATE - MAX(t.TransactionDate)::DATE AS DaysInactive
FROM Accounts a
JOIN Customers c ON a.CustomerID = c.CustomerID
LEFT JOIN Transactions t ON a.AccountID = t.AccountID
GROUP BY c.CustomerName, c.Phone, a.AccountNumber, a.OpenDate
HAVING 
    MAX(t.TransactionDate) < CURRENT_DATE - INTERVAL '90 days'
    OR MAX(t.TransactionDate) IS NULL -- Catch accounts that NEVER had a transaction
ORDER BY DaysInactive DESC;`

export default function AdminInactiveAccounts() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inactive Account Follow-up</h1>
            <p className="text-gray-500">Module 3 Rule #3: Customer retention outreach</p>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">
              {inactiveAccounts.length} Inactive Account{inactiveAccounts.length !== 1 ? 's' : ''} Require Follow-up
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              These accounts have had no activity for more than {INACTIVE_DAYS_THRESHOLD} days. 
              Consider reaching out with attractive product offers to reduce churn.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Inactive</p>
          <p className="text-2xl font-bold text-yellow-600">{inactiveAccounts.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Never Transacted</p>
          <p className="text-2xl font-bold text-red-600">
            {inactiveAccounts.filter(a => !a.lastTransactionDate).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Avg Days Inactive</p>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(inactiveAccounts.reduce((sum, a) => sum + a.daysInactive, 0) / inactiveAccounts.length) || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">At-Risk Balance</p>
          <p className="text-2xl font-bold text-gray-900">
            ${inactiveAccounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Inactive Accounts Table */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Accounts Requiring Follow-up</h3>
        <DataTable 
          columns={columns} 
          data={inactiveAccounts}
          emptyMessage="No inactive accounts at this time"
        />
      </div>

      {/* PostgreSQL Query */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">PostgreSQL Query: Inactive Account Detection</h3>
        <CodeBlock 
          code={sqlQueryCode}
          language="sql"
          title="module_3_inactive_account_followup.sql"
        />
      </div>
    </div>
  )
}
