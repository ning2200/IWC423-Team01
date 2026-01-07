import { Link } from 'react-router-dom'
import { Building2, Shield, User, Database, ArrowRight, Github } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bank-primary via-bank-primary to-blue-900">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Building2 className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            IWC423-Team01-Bank-Pte-Ltd
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Advanced Database Systems Mock Frontend
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">PostgreSQL</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">MongoDB</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">Hybrid Database</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">React + Vite</span>
          </div>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Admin Portal */}
          <Link 
            to="/admin"
            className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
                <p className="text-white/60 text-sm">/admin</p>
              </div>
            </div>
            <p className="text-white/70 mb-6">
              Bank operations dashboard with Module 3 business rules: Fraud Detection, 
              High Balance Recommendations, and Inactive Account Follow-up.
            </p>
            <ul className="space-y-2 text-sm text-white/60 mb-6">
              <li>• Customer & Account Management</li>
              <li>• Transaction Monitoring</li>
              <li>• Fraud Detection Alerts</li>
              <li>• PostgreSQL & MongoDB Views</li>
              <li>• Analytics Dashboard</li>
            </ul>
            <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
              <span className="font-medium">Enter Admin Portal</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Client Portal */}
          <Link 
            to="/client"
            className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <User className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Client Portal</h2>
                <p className="text-white/60 text-sm">/client</p>
              </div>
            </div>
            <p className="text-white/70 mb-6">
              Customer-facing online banking interface. View accounts, 
              transaction history, and explore recommended products.
            </p>
            <ul className="space-y-2 text-sm text-white/60 mb-6">
              <li>• Account Overview</li>
              <li>• Transaction History</li>
              <li>• Product Recommendations</li>
              <li>• Balance Summary</li>
              <li>• Personal Dashboard</li>
            </ul>
            <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
              <span className="font-medium">Enter Client Portal</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Project Info */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-white/80" />
            <h3 className="text-xl font-bold text-white">Project Overview</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-white mb-3">Database Schema</h4>
              <ul className="space-y-1 text-sm text-white/60">
                <li>• Customers (KYC, Risk Rating)</li>
                <li>• Accounts (Checking, Savings, Loan)</li>
                <li>• Transactions & TransactionLines</li>
                <li>• BankProducts & BankStaff</li>
                <li>• TransactionStatus</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Module 3 Business Rules</h4>
              <ul className="space-y-1 text-sm text-white/60">
                <li>• Fraud Detection (Threshold-based)</li>
                <li>• High Balance Recommendations</li>
                <li>• Inactive Account Follow-up</li>
                <li>• PostgreSQL Views</li>
                <li>• MongoDB Document Analytics</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="font-semibold text-white mb-3">Team Members</h4>
            <div className="flex flex-wrap gap-4">
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-sm text-white/80">Tan Le Xuan</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-sm text-white/80">Gabriel Ong Zhe Mian</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-sm text-white/80">Luke Nathaniel Teo Bo Sheng</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-white/40 text-sm">
            IWC423 Advanced Database Systems • January 2026
          </p>
          <a 
            href="https://github.com/gongahkia/IWC423-Team01" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-white/60 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="text-sm">View on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  )
}
