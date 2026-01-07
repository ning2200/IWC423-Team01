import { Star, TrendingUp, Percent, Info, CheckCircle } from 'lucide-react'
import { bankProducts, HIGH_BALANCE_THRESHOLD, accounts } from '../../data/mockData'

// Mock logged-in user (Jane Smith - Customer ID 2)
const customerAccounts = accounts.filter(a => a.customerId === 2)
const totalBalance = customerAccounts.reduce((sum, a) => sum + a.balance, 0)
const hasHighBalance = totalBalance > HIGH_BALANCE_THRESHOLD

const productCategories = [
  { type: 'Investment', icon: TrendingUp, color: 'crimson' },
  { type: 'Savings', icon: Star, color: 'crimson-light' },
  { type: 'Loan', icon: Percent, color: 'crimson-dark' },
  { type: 'Checking', icon: CheckCircle, color: 'gray' },
]

export default function ClientProducts() {
  const investmentProducts = bankProducts.filter(p => p.productType === 'Investment' && p.activeFlag)
  const savingsProducts = bankProducts.filter(p => p.productType === 'Savings' && p.activeFlag)
  const loanProducts = bankProducts.filter(p => p.productType === 'Loan' && p.activeFlag)
  const checkingProducts = bankProducts.filter(p => p.productType === 'Checking' && p.activeFlag)

  const ProductCard = ({ product, highlighted = false }) => {
    const categoryConfig = productCategories.find(c => c.type === product.productType)
    const Icon = categoryConfig?.icon || Star
    const colorClass = {
      crimson: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-ku-crimson', badge: 'bg-red-100 text-ku-crimson' },
      'crimson-light': { bg: 'bg-red-50', border: 'border-red-300', text: 'text-ku-crimson-light', badge: 'bg-red-100 text-ku-crimson-light' },
      'crimson-dark': { bg: 'bg-red-50', border: 'border-red-400', text: 'text-ku-crimson-dark', badge: 'bg-red-100 text-ku-crimson-dark' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', badge: 'bg-green-100 text-green-800' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-800' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-800' },
      gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-800' },
    }[categoryConfig?.color || 'gray']

    return (
      <div className={`rounded-xl p-6 border-2 ${highlighted ? 'border-ku-crimson ring-2 ring-red-100' : colorClass.border} ${colorClass.bg} card-hover relative`}>
        {highlighted && (
          <div className="absolute -top-3 left-4">
            <span className="px-3 py-1 bg-ku-crimson text-white text-xs font-bold rounded-full">
              ⭐ Recommended for You
            </span>
          </div>
        )}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${highlighted ? 'bg-red-100' : colorClass.badge.split(' ')[0]} rounded-xl`}>
            <Icon className={`w-6 h-6 ${highlighted ? 'text-ku-crimson' : colorClass.text}`} />
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass.badge}`}>
            {product.productType}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">{product.productName}</h3>
        <div className="mb-4">
          <p className="text-3xl font-bold text-gray-900">
            {(product.interestRate * 100).toFixed(2)}%
          </p>
          <p className="text-sm text-gray-500">
            {product.productType === 'Loan' ? 'Annual Rate' : 'APY'}
          </p>
        </div>
        <p className="text-sm text-gray-600 mb-4">{product.feeSchedule}</p>
        {highlighted && (
          <div className="text-center py-2 rounded-lg font-medium bg-ku-crimson/10 text-ku-crimson">
            Recommended for your portfolio
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bank Products</h1>
        <p className="text-gray-500 mt-1">Explore our financial products and services</p>
      </div>

      {/* High Balance Recommendation Banner */}
      {hasHighBalance && (
        <div className="bg-gradient-to-r from-ku-crimson to-ku-crimson-light rounded-2xl p-6 text-white mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Unlock Premium Investment Products!</h2>
              <p className="text-white/90 mb-4">
                With your balance of <strong>${totalBalance.toLocaleString()}</strong>, you qualify for our 
                exclusive investment products with returns up to <strong>9.99% APY</strong>. 
                Start growing your wealth today!
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span>High Balance Customer</span>
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4" />
                  <span>Premium Eligible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Products */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Investment Products</h2>
          {hasHighBalance && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Recommended
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investmentProducts.map(product => (
            <ProductCard 
              key={product.productId} 
              product={product} 
              highlighted={hasHighBalance && product.interestRate >= 0.05}
            />
          ))}
        </div>
      </section>

      {/* Savings Products */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Savings Products</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savingsProducts.map(product => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>

      {/* Loan Products */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Percent className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Loan Products</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loanProducts.map(product => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>

      {/* Checking Products */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Checking Accounts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checkingProducts.map(product => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>

      {/* Info Box */}
      <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Need Help Choosing?</h3>
            <p className="text-sm text-blue-700 mt-1">
              Our financial advisors are here to help you find the perfect products for your needs. 
              Schedule a consultation at any of our branches or call us at 1800-BANK-423.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
