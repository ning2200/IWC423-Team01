import { ShieldAlert, AlertTriangle, Info } from 'lucide-react'
import DataTable from '../../components/DataTable'
import CodeBlock from '../../components/CodeBlock'
import { StatusBadge } from '../../components/StatusBadge'
import { customers, accounts, FRAUD_THRESHOLDS } from '../../data/mockData'
import { transactions } from '../../data/transactions'

// Apply fraud detection logic (mirrors View_PotentialFraudTransactions)
const detectFraudTransactions = () => {
  return transactions.map(t => {
    const account = accounts.find(a => a.accountId === t.accountId)
    const customer = customers.find(c => c.customerId === t.customerId)
    const accountType = account?.accountType || 'Unknown'
    const threshold = FRAUD_THRESHOLDS[accountType]
    
    let statusCheck = 'Valid'
    let alertType = null
    
    if (threshold) {
      if (t.totalAmount > threshold.max) {
        statusCheck = `Exceeds ${accountType} Limit ($${threshold.max.toLocaleString()})`
        alertType = 'exceeds'
      } else if (t.totalAmount < threshold.min) {
        statusCheck = `Below ${accountType} Minimum ($${threshold.min})`
        alertType = 'below'
      }
    }
    
    return {
      ...t,
      accountType,
      accountNumber: account?.accountNumber || 'Unknown',
      customerName: customer?.customerName || 'Unknown',
      minThreshold: threshold?.min || 0.01,
      maxThreshold: threshold?.max || null,
      statusCheck,
      alertType,
      isFraud: alertType !== null
    }
  }).filter(t => t.isFraud)
}

const fraudTransactions = detectFraudTransactions()

const columns = [
  { 
    header: 'Transaction ID', 
    render: (row) => (
      <span className="font-mono text-sm font-medium text-red-600">{row.transactionId}</span>
    )
  },
  { 
    header: 'Customer', 
    accessor: 'customerName' 
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
    header: 'Amount', 
    render: (row) => (
      <span className="font-bold text-red-600">
        ${row.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    )
  },
  { 
    header: 'Threshold', 
    render: (row) => (
      <div className="text-sm">
        <p className="text-gray-600">Max: ${row.maxThreshold?.toLocaleString() || 'N/A'}</p>
        <p className="text-gray-400 text-xs">Min: ${row.minThreshold}</p>
      </div>
    )
  },
  { 
    header: 'Status Check', 
    render: (row) => (
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-600">{row.statusCheck}</span>
      </div>
    )
  },
  { 
    header: 'Date', 
    render: (row) => new Date(row.transactionDate).toLocaleString()
  },
]

// SQL View Code
const sqlViewCode = `CREATE OR REPLACE VIEW View_PotentialFraudTransactions AS
WITH TransactionThresholds AS (
    SELECT
        t.TransactionID,
        t.TransactionDate,
        t.TotalAmount,
        a.AccountType,
        c.CustomerName,
        CASE
            WHEN a.AccountType IN ('Checking', 'Savings', 'Loan') THEN 0.01
            ELSE 0.01
        END AS MinThreshold,
        CASE
            WHEN a.AccountType = 'Checking' THEN 10000
            WHEN a.AccountType = 'Savings' THEN 50000
            WHEN a.AccountType = 'Loan' THEN 100000
            ELSE NULL
        END AS MaxThreshold
    FROM Transactions t
    JOIN Accounts a ON t.AccountID = a.AccountID
    JOIN Customers c ON t.CustomerID = c.CustomerID
)
SELECT
    TransactionID,
    TransactionDate,
    TotalAmount,
    AccountType,
    CustomerName,
    MinThreshold,
    MaxThreshold,
    CASE
        WHEN MaxThreshold IS NOT NULL AND TotalAmount > MaxThreshold THEN
            CASE
                WHEN AccountType = 'Checking' THEN 'Exceeds Checking Limit ($10k)'
                WHEN AccountType = 'Savings' THEN 'Exceeds Savings Limit ($50k)'
                WHEN AccountType = 'Loan' THEN 'Exceeds Loan Limit ($100k)'
                ELSE 'Exceeds Maximum Threshold'
            END
        WHEN TotalAmount < MinThreshold THEN 'Below Minimum Threshold'
        ELSE 'Valid'
    END AS StatusCheck
FROM TransactionThresholds
WHERE
    (MaxThreshold IS NOT NULL AND TotalAmount > MaxThreshold)
    OR (TotalAmount < MinThreshold);`

export default function AdminFraudDetection() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fraud Detection</h1>
            <p className="text-gray-500">Module 3 Rule #1: Transaction threshold monitoring</p>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">
              {fraudTransactions.length} Potential Fraud Transaction{fraudTransactions.length !== 1 ? 's' : ''} Detected
            </h3>
            <p className="text-sm text-red-700 mt-1">
              These transactions exceed the maximum threshold limits for their account types.
            </p>
          </div>
        </div>
      </div>

      {/* Thresholds Reference */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">Transaction Thresholds</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(FRAUD_THRESHOLDS).map(([type, { min, max }]) => (
            <div key={type} className={`rounded-lg p-4 ${
              type === 'Checking' ? 'bg-blue-50 border border-blue-200' :
              type === 'Savings' ? 'bg-green-50 border border-green-200' :
              'bg-purple-50 border border-purple-200'
            }`}>
              <p className="font-medium text-gray-900">{type} Account</p>
              <p className="text-2xl font-bold mt-1">
                ${max.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Maximum per transaction</p>
            </div>
          ))}
        </div>
      </div>

      {/* Flagged Transactions Table */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Flagged Transactions</h3>
        <DataTable 
          columns={columns} 
          data={fraudTransactions}
          emptyMessage="No fraud alerts at this time"
        />
      </div>

      {/* PostgreSQL View */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">PostgreSQL View: View_PotentialFraudTransactions</h3>
        <CodeBlock 
          code={sqlViewCode}
          language="sql"
          title="module_3_fraud_detection.sql"
        />
      </div>
    </div>
  )
}
