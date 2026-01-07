import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CreditCard, 
  ArrowLeftRight, 
  Package,
  Building2,
  LogOut,
  User
} from 'lucide-react'

const navItems = [
  { path: '/client', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/client/accounts', icon: CreditCard, label: 'My Accounts' },
  { path: '/client/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { path: '/client/products', icon: Package, label: 'Products' },
]

export default function ClientLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-bank-primary" />
              <div>
                <h1 className="font-bold text-bank-primary">IWC423-Team01-Bank</h1>
                <p className="text-xs text-gray-500">Online Banking Portal</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = item.exact 
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path)

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-bank-primary text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-bank-secondary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:inline text-gray-700">Jane Smith</span>
              </div>
              <NavLink
                to="/"
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Exit Portal"
              >
                <LogOut className="w-5 h-5" />
              </NavLink>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex overflow-x-auto px-4 py-2 gap-2">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path)

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'bg-bank-primary text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2026 IWC423-Team01-Bank-Pte-Ltd. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">
              IWC423 Advanced Database Systems - Team 1 Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
