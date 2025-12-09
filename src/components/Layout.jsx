import { FileText, Home, Users } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import { Toaster } from 'sonner'

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/vendors', label: 'Vendors', icon: Users },
  { to: '/pors', label: 'PORs', icon: FileText },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-yellow-50 text-slate-900 shadow-sm border-b border-yellow-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/">
              <img 
                src="/PORTAL_trans.png" 
                alt="Procurement-One" 
                className="h-8"
              />
            </Link>
            <nav className="flex gap-1">
              {navItems.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to || 
                  (to !== '/' && location.pathname.startsWith(to))
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-yellow-200 text-slate-900'
                        : 'text-slate-600 hover:bg-yellow-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-semibold text-white">
              JS
            </div>
            <span className="text-slate-600">Jane Smith</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

