import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import AdminLayout from './layouts/AdminLayout'
import ClientLayout from './layouts/ClientLayout'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminCustomers from './pages/admin/Customers'
import AdminAccounts from './pages/admin/Accounts'
import AdminTransactions from './pages/admin/Transactions'
import AdminFraudDetection from './pages/admin/FraudDetection'
import AdminInactiveAccounts from './pages/admin/InactiveAccounts'
import AdminHighBalance from './pages/admin/HighBalance'
import AdminDatabaseViews from './pages/admin/DatabaseViews'
import AdminAnalytics from './pages/admin/Analytics'

// Client Pages
import ClientDashboard from './pages/client/Dashboard'
import ClientAccounts from './pages/client/Accounts'
import ClientTransactions from './pages/client/Transactions'
import ClientProducts from './pages/client/Products'

// Landing Page
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="accounts" element={<AdminAccounts />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="fraud-detection" element={<AdminFraudDetection />} />
        <Route path="inactive-accounts" element={<AdminInactiveAccounts />} />
        <Route path="high-balance" element={<AdminHighBalance />} />
        <Route path="database-views" element={<AdminDatabaseViews />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
      
      {/* Client Routes */}
      <Route path="/client" element={<ClientLayout />}>
        <Route index element={<ClientDashboard />} />
        <Route path="accounts" element={<ClientAccounts />} />
        <Route path="transactions" element={<ClientTransactions />} />
        <Route path="products" element={<ClientProducts />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
