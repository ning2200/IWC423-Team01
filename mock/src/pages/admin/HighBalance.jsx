import { TrendingUp, DollarSign, Package, Star } from 'lucide-react'
import DataTable from '../../components/DataTable'
import CodeBlock from '../../components/CodeBlock'
import { customers, accounts, bankProducts, HIGH_BALANCE_THRESHOLD } from '../../data/mockData'

// Calculate high balance accounts with product recommendations
const calculateHighBalanceRecommendations = () => {
  const investmentProducts = bankProducts.filter(p => p.productType === 'Investment' && p.activeFlag)
  
  return accounts
    .filter(a => a.balance > HIGH_BALANCE_THRESHOLD)
    .map(a => {
      const customer = customers.find(c => c.customerId === a.customerId)
      return {
        ...a,
        customerName: customer?.customerName || 'Unknown',
        customerEmail: customer?.email || 'N/A',
        recommendedProducts: investmentProducts
      }
    })
    .sort((a, b) => b.balance - a.balance)
}

const highBalanceAccounts = calculateHighBalanceRecommendations()
const investmentProducts = bankProducts.filter(p => p.productType === 'Investment' && p.activeFlag)

const columns = [
  { 
    header: 'Customer', 
    render: (row) => (
      <div>
        <p className="font-medium text-gray-900">{row.customerName}</p>
        <p className="text-xs text-gray-500">{row.customerEmail}</p>
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
    header: 'Balance', 
    render: (row) => (
      <div>
        <p className="text-lg font-bold text-green-600">
          ${row.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-green-500">
          +${(row.balance - HIGH_BALANCE_THRESHOLD).toLocaleString()} over threshold
        </p>
      </div>
    )
  },
  { 
    header: 'Recommended Products', 
    render: (row) => (
      <div className="space-y-1">
        {row.recommendedProducts.map(p => (
          <div key={p.productId} className="flex items-center gap-2 text-sm">
            <Star className="w-3 h-3 text-yellow-500" />
            <span className="text-gray-700">{p.productName}</span>
            <span className="text-xs text-green-600 font-medium">
              {(p.interestRate * 100).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    )
  },
  { 
    header: 'Action', 
    render: (row) => (
      <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        Send Offer
      </button>
    )
  },
]

// SQL Query Code
const sqlQueryCode = `SELECT 
    c.CustomerName,
    c.Email,
    a.AccountNumber,
    a.AccountType,
    a.Balance,
    p.ProductName AS RecommendedProduct,
    p.InterestRate AS ProposedRate
FROM Accounts a
JOIN Customers c ON a.CustomerID = c.CustomerID
CROSS JOIN BankProducts p -- Cartesian join to suggest all relevant products
WHERE 
    a.Balance > 100000.00 -- The "High Balance" threshold
    AND p.ProductType = 'Investment' -- Only suggesting relevant investment products
    AND p.ActiveFlag = TRUE
ORDER BY a.Balance DESC;`

export default function AdminHighBalance() {
  const totalHighBalanceValue = highBalanceAccounts.reduce((sum, a) => sum + a.balance, 0)
  const potentialRevenue = totalHighBalanceValue * 0.01 // 1% management fee potential

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">High Balance Recommendations</h1>
            <p className="text-gray-500">Module 3 Rule #2: Investment product upselling</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900">
              {highBalanceAccounts.length} High-Value Account{highBalanceAccounts.length !== 1 ? 's' : ''} Identified
            </h3>
            <p className="text-sm text-green-700 mt-1">
              These customers have balances exceeding ${HIGH_BALANCE_THRESHOLD.toLocaleString()} and are excellent candidates 
              for premium investment products with higher yields.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">High Balance Accounts</p>
          <p className="text-2xl font-bold text-green-600">{highBalanceAccounts.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-gray-900">
            ${(totalHighBalanceValue / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Potential Revenue (1% fee)</p>
          <p className="text-2xl font-bold text-green-600">
            ${potentialRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Investment Products</p>
          <p className="text-2xl font-bold text-gray-900">{investmentProducts.length}</p>
        </div>
      </div>

      {/* Available Investment Products */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Available Investment Products</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investmentProducts.map(p => (
            <div key={p.productId} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <h4 className="font-medium text-gray-900">{p.productName}</h4>
              </div>
              <p className="text-3xl font-bold text-green-600 mb-1">
                {(p.interestRate * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500">Annual Return</p>
              <p className="text-sm text-gray-600 mt-2">{p.feeSchedule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* High Balance Accounts Table */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">High Balance Accounts</h3>
        <DataTable 
          columns={columns} 
          data={highBalanceAccounts}
          emptyMessage="No high balance accounts at this time"
        />
      </div>

      {/* PostgreSQL Query */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">PostgreSQL Query: High Balance Recommendations</h3>
        <CodeBlock 
          code={sqlQueryCode}
          language="sql"
          title="module_3_high_account_balance.sql"
        />
      </div>
    </div>
  )
}
