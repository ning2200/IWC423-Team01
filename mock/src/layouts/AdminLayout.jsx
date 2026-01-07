import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  ArrowLeftRight, 
  ShieldAlert, 
  Clock, 
  TrendingUp,
  Database,
  BarChart3,
  Building2,
  LogOut
} from 'lucide-react'

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/customers', icon: Users, label: 'Customers' },
  { path: '/admin/accounts', icon: CreditCard, label: 'Accounts' },
  { path: '/admin/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { divider: true, label: 'Module 3 Rules' },
  { path: '/admin/fraud-detection', icon: ShieldAlert, label: 'Fraud Detection', alert: true },
  { path: '/admin/inactive-accounts', icon: Clock, label: 'Inactive Accounts' },
  { path: '/admin/high-balance', icon: TrendingUp, label: 'High Balance' },
  { divider: true, label: 'Database' },
  { path: '/admin/database-views', icon: Database, label: 'DB Views' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
]

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-bank-primary text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8" />
            <div>
              <h1 className="font-bold text-sm">IWC423-Team01</h1>
              <p className="text-xs text-white/70">Bank Pte Ltd</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => {
            if (item.divider) {
              return (
                <div key={index} className="pt-4 pb-2">
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    {item.label}
                  </p>
                </div>
              )
            }

            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
                {item.alert && (
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full fraud-alert" />
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Exit Admin</span>
          </NavLink>
          <p className="text-xs text-white/40 mt-3 text-center">
            IWC423 Advanced Database Systems
            <br />
            <span className="text-white/30">Korea University</span>
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
